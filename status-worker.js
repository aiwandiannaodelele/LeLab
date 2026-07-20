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
      try {
        const body = await request.text()
        const data = JSON.parse(body)
        const device = data.device || "unknown"
        const now = Date.now()

        // 查旧值，只有变化时才写入
        const row = await env.DB.prepare("SELECT data FROM status WHERE device = ?").bind(device).first()
        const oldData = row ? row.data : null

        if (oldData !== body) {
          await env.DB.prepare(
            "INSERT OR REPLACE INTO status (device, data, updated_at) VALUES (?, ?, ?)"
          ).bind(device, body, now).run()
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
        const cutoff = Date.now() - 120000 // 120秒内上报的才显示
        const { results } = await env.DB.prepare("SELECT data, updated_at FROM status").all()
        const devices = (results || [])
          .filter(r => r.updated_at > cutoff)
          .map(r => JSON.parse(r.data))
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
