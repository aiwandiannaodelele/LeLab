export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders })
    }

    const url = new URL(request.url)

    if (request.method === "POST" && url.pathname === "/api/status") {
      const auth = request.headers.get("Authorization")
      if (!env.AUTH_TOKEN || auth !== `Bearer ${env.AUTH_TOKEN}`) {
        return new Response(JSON.stringify({ error: "unauthorized" }), {
          status: 401, headers: corsHeaders,
        })
      }
      if (!env.STATUS) {
        return new Response(JSON.stringify({ error: "KV not bound" }), {
          status: 500, headers: corsHeaders,
        })
      }
      try {
        const body = await request.text()
        const data = JSON.parse(body)
        const device = data.device || "unknown"
        const key = `device:${device}`

        // 读取旧值，只有变化时才写入
        const oldRaw = await env.STATUS.get(key)
        const changed = !oldRaw || oldRaw !== body

        if (changed) {
          await env.STATUS.put(key, body, { expirationTtl: 60 })
        }

        return new Response("ok", { headers: corsHeaders })
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500, headers: corsHeaders,
        })
      }
    }

    if (request.method === "GET" && url.pathname === "/api/status") {
      try {
        if (!env.STATUS) {
          return new Response(JSON.stringify({ devices: [] }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          })
        }
        const list = await env.STATUS.list({ prefix: "device:" })
        const devices = []
        for (const key of list.keys) {
          const raw = await env.STATUS.get(key.name)
          if (raw) {
            try {
              const data = JSON.parse(raw)
              devices.push(data)
            } catch {}
          }
        }
        return new Response(JSON.stringify({ devices }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500, headers: corsHeaders,
        })
      }
    }

    return new Response(JSON.stringify({ error: "not found" }), {
      status: 404, headers: corsHeaders,
    })
  },
}
