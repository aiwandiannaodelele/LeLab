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

        // 读取现有数据，更新对应设备
        let all = {}
        const raw = await env.STATUS.get("all")
        if (raw) try { all = JSON.parse(raw) } catch {}

        const oldVal = JSON.stringify(all[device] || {})
        if (oldVal !== body) {
          all[device] = data
          await env.STATUS.put("all", JSON.stringify(all), { expirationTtl: 60 })
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
        const raw = await env.STATUS.get("all")
        const all = raw ? JSON.parse(raw) : {}
        const devices = Object.values(all)
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
