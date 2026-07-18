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
      if (auth !== `Bearer ${env.AUTH_TOKEN}`) {
        return new Response(JSON.stringify({ error: "unauthorized" }), {
          status: 401,
          headers: corsHeaders,
        })
      }
      try {
        const body = await request.text()
        if (env.STATUS) {
          await env.STATUS.put("current", body, { expirationTtl: 30 })
          return new Response("ok", { headers: corsHeaders })
        }
        return new Response("no KV", { headers: corsHeaders })
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: corsHeaders,
        })
      }
    }

    if (request.method === "GET" && url.pathname === "/api/status") {
      try {
        const raw = env.STATUS ? await env.STATUS.get("current") : null
        return new Response(raw || JSON.stringify({}), {
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
