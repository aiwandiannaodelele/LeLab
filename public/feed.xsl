<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" encoding="UTF-8"/>
<xsl:template match="/">
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>乐乐 Lab - RSS 订阅</title>
  <style>
    body { font-family: -apple-system, sans-serif; max-width: 640px; margin: 40px auto; padding: 0 20px; background: #fafafa; color: #333; }
    h1 { font-size: 24px; }
    h2 { font-size: 18px; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .item { background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 12px 0; }
    .date { color: #888; font-size: 13px; }
    p { line-height: 1.6; }
  </style>
</head>
<body>
  <h1><xsl:value-of select="rss/channel/title"/></h1>
  <p><xsl:value-of select="rss/channel/description"/></p>
  <xsl:apply-templates select="rss/channel/item"/>
</body>
</html>
</xsl:template>
<xsl:template match="item">
  <div class="item">
    <h2><a href="{link}"><xsl:value-of select="title"/></a></h2>
    <div class="date"><xsl:value-of select="pubDate"/></div>
  </div>
</xsl:template>
</xsl:stylesheet>
