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

    // 设备上报状态
    if (request.method === "POST" && url.pathname === "/api/status") {
      const auth = request.headers.get("Authorization")
      if (auth !== `Bearer ${env.AUTH_TOKEN}`) {
        return new Response(JSON.stringify({ error: "unauthorized" }), {
          status: 401,
          headers: corsHeaders,
        })
      }
      try {
        const { status, battery } = await request.json()
        const data = JSON.stringify({ status: status || null, battery: battery || null })
        if (env.STATUS) {
          await env.STATUS.put("current", data, { expirationTtl: 300 })
          return new Response("ok", { headers: corsHeaders })
        }
        return new Response("no status or no KV", { headers: corsHeaders })
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: corsHeaders,
        })
      }
    }

    // 网站读取状态
    if (request.method === "GET" && url.pathname === "/api/status") {
      try {
        const raw = env.STATUS ? await env.STATUS.get("current") : null
        const data = raw ? JSON.parse(raw) : { status: null, battery: null }
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: corsHeaders,
        })
      }
    }

    return new Response(JSON.stringify({ error: "not found" }), {
      status: 404,
      headers: corsHeaders,
    })
  },
}
