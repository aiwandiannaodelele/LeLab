export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      })
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 })
    }

    const origin = request.headers.get("Origin")
    const referer = request.headers.get("Referer")
    const baseDomain = env.BASE_DOMAIN

    if (baseDomain) {
      const isLocalhost = origin && (origin.includes("localhost") || origin.includes("127.0.0.1"))
      if (!isLocalhost) {
        let valid = false
        if (origin && origin.includes(baseDomain)) valid = true
        else if (!origin && referer && referer.includes(baseDomain)) valid = true
        if (!valid) {
          return Response.json({ error: "CSRF check failed" }, {
            status: 403,
            headers: { "Access-Control-Allow-Origin": "*" },
          })
        }
      }
    }

    try {
      let pathname, url, expired_at
      try {
        const body = await request.json()
        pathname = body.pathname
        url = body.url
        expired_at = body.expired_at
      } catch {
        return Response.json({ error: "Invalid JSON body" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } })
      }

      if (!pathname || typeof pathname !== "string" || pathname.length < 5 || pathname.length > 10) {
        return Response.json({ error: "Invalid pathname (5-10 chars)" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } })
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(pathname)) {
        return Response.json({ error: "Invalid characters in pathname" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } })
      }

      if (!url || typeof url !== "string" || url.length > 300) {
        return Response.json({ error: "Invalid URL (max 300 chars)" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } })
      }

      let parsedUrl
      try {
        parsedUrl = new URL(url)
        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
          return Response.json({ error: "Only http/https allowed" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } })
        }
        if (/[^\x00-\x7F]/.test(url)) {
          return Response.json({ error: "Non-ASCII characters not allowed" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } })
        }
        if (baseDomain && parsedUrl.hostname.toLowerCase() === baseDomain.toLowerCase()) {
          return Response.json({ error: "Loop protection" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } })
        }
      } catch {
        return Response.json({ error: "Invalid URL format" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } })
      }

      try {
        const hostname = parsedUrl.hostname
        const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.includes(":")
        if (!isIp) {
          const dohResp = await fetch(`https://family.cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=A`, {
            headers: { Accept: "application/dns-json" },
          })
          if (dohResp.ok) {
            const dnsData = await dohResp.json()
            if (dnsData.Answer) {
              for (const answer of dnsData.Answer) {
                if (answer.data === "0.0.0.0" || answer.data === "::") {
                  return Response.json({ error: "URL blocked by Cloudflare Family DNS" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } })
                }
              }
            }
          }
        }
      } catch (e) {
        return Response.json({ error: "Security check failed" }, { status: 500, headers: { "Access-Control-Allow-Origin": "*" } })
      }

      let expiredAtISO = null
      if (expired_at && typeof expired_at === "number") {
        const expiredDate = new Date(expired_at * 1000)
        if (isNaN(expiredDate.getTime())) {
          return Response.json({ error: "Invalid timestamp" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } })
        }
        const diffDays = (expiredDate.getTime() - Date.now()) / (1000 * 3600 * 24)
        if (diffDays > 7) {
          return Response.json({ error: "Max 7 days" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } })
        }
        if (diffDays <= 0) {
          return Response.json({ error: "Must be in the future" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } })
        }
        expiredAtISO = expiredDate.toISOString()
      }

      const owner = env.GITHUB_OWNER
      const repo = env.GITHUB_REPO
      const branch = env.GITHUB_BRANCH || "main"
      const filePath = "js/rules_intermediate.js"
      const token = env.GITHUB_TOKEN

      if (!token || !owner || !repo) {
        return Response.json({ error: "Server configuration error" }, { status: 500, headers: { "Access-Control-Allow-Origin": "*" } })
      }

      const getResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`, {
        headers: { Authorization: `Bearer ${token}`, "User-Agent": "Cloudflare-Worker" },
      })
      if (!getResp.ok) return Response.json({ error: "Failed to fetch rules file" }, { status: 502, headers: { "Access-Control-Allow-Origin": "*" } })

      const fileData = await getResp.json()
      const binaryString = atob(fileData.content.replace(/\s/g, ""))
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i)
      const content = new TextDecoder("utf-8").decode(bytes)
      const sha = fileData.sha

      const jsonStart = content.indexOf("{")
      const jsonEnd = content.lastIndexOf("}")
      if (jsonStart === -1 || jsonEnd === -1) return Response.json({ error: "Parse error" }, { status: 500, headers: { "Access-Control-Allow-Origin": "*" } })

      let rules
      try {
        rules = JSON.parse(content.substring(jsonStart, jsonEnd + 1))
      } catch {
        return Response.json({ error: "Invalid JSON in rules file" }, { status: 500, headers: { "Access-Control-Allow-Origin": "*" } })
      }

      const pathKey = "/" + pathname
      if (rules[pathKey]) {
        return Response.json({ error: "Pathname already exists" }, { status: 409, headers: { "Access-Control-Allow-Origin": "*" } })
      }

      rules[pathKey] = { url, expired_at: expiredAtISO }

      const encoder = new TextEncoder()
      const data = encoder.encode(`window.RULES_INTERMEDIATE = ${JSON.stringify(rules, null, 4)};\n`)
      let binary = ""
      for (let i = 0; i < data.byteLength; i++) binary += String.fromCharCode(data[i])

      const putResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "User-Agent": "Cloudflare-Worker", "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Add short link: ${pathname}`, content: btoa(binary), sha, branch }),
      })
      if (!putResp.ok) return Response.json({ error: "Failed to commit" }, { status: 502, headers: { "Access-Control-Allow-Origin": "*" } })

      const putRespData = await putResp.json()
      const shortUrl = baseDomain ? `https://${baseDomain}/${pathname}` : null

      return Response.json({ success: true, short_url: shortUrl }, {
        headers: { "Access-Control-Allow-Origin": "*" },
      })
    } catch (err) {
      return Response.json({ error: err.message }, { status: 500, headers: { "Access-Control-Allow-Origin": "*" } })
    }
  },
}
