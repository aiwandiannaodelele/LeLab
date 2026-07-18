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
    console.log(`${request.method} ${url.pathname}`)

    if (request.method === "POST" && url.pathname === "/api/status") {
      const auth = request.headers.get("Authorization")
      console.log("AUTH_TOKEN exists:", !!env.AUTH_TOKEN)
      console.log("STATUS KV exists:", !!env.STATUS)

      if (!env.AUTH_TOKEN || auth !== `Bearer ${env.AUTH_TOKEN}`) {
        console.log("auth failed")
        return new Response(JSON.stringify({ error: "unauthorized" }), {
          status: 401,
          headers: corsHeaders,
        })
      }

      if (!env.STATUS) {
        console.log("KV not bound")
        return new Response(JSON.stringify({ error: "KV not bound" }), {
          status: 500,
          headers: corsHeaders,
        })
      }

      try {
        const body = await request.text()
        console.log("body:", body)
        await env.STATUS.put("current", body, { expirationTtl: 60 })
        console.log("stored ok")
        return new Response("ok", { headers: corsHeaders })
      } catch (e) {
        console.log("error:", e.message)
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: corsHeaders,
        })
      }
    }

    if (request.method === "GET" && url.pathname === "/api/status") {
      try {
        const raw = env.STATUS ? await env.STATUS.get("current") : null
        console.log("get status:", raw)
        return new Response(raw || JSON.stringify({}), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      } catch (e) {
        console.log("get error:", e.message)
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
