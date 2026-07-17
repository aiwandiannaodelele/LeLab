export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders })
    }

    // 设备上报状态
    if (request.method === "POST" && url.pathname === "/api/status") {
      const auth = request.headers.get("Authorization")
      if (auth !== `Bearer ${env.AUTH_TOKEN}`) {
        return new Response("Unauthorized", { status: 401, headers: corsHeaders })
      }
      const { status } = await request.json()
      if (status) {
        await env.STATUS.put("current", status, { expirationTtl: 120 })
      }
      return new Response("ok", { headers: corsHeaders })
    }

    // 网站读取状态
    if (request.method === "GET" && url.pathname === "/api/status") {
      const status = await env.STATUS.get("current")
      return new Response(JSON.stringify({ status: status || null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    return new Response("Not Found", { status: 404 })
  },
}
