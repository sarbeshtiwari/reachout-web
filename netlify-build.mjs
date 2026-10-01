// Netlify build for the public pages (landing, contact, 404). Base directory on Netlify: web
// Flask fills in {{SITE_URL}} and security headers when it serves these pages itself; here the same is
// done once at build time. Output: _site/
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "_site");
const site = (process.env.URL || "").replace(/\/$/, "");       // this site's address (set by Netlify)
const app = (process.env.APP_URL || "").replace(/\/$/, "");     // the app's Netlify address (netlify.toml)
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const operator = esc(process.env.OPERATOR_NAME || "the Reachout team"), jurisdiction = esc(process.env.JURISDICTION || "India");
if (!site || !app) throw new Error("URL (set by Netlify) and APP_URL (netlify.toml) are required");

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(here, "assets"), join(out, "assets"), { recursive: true });

const hashes = new Set();
for (const [src, dest] of [["landing.html", "index.html"], ["contact.html", "contact.html"], ["404.html", "404.html"],
                           ["privacy.html", "privacy.html"], ["terms.html", "terms.html"]]) {
  let html = readFileSync(join(here, src), "utf8").replaceAll("{{SITE_URL}}", site)
    .replaceAll("{{OPERATOR}}", operator).replaceAll("{{JURISDICTION}}", jurisdiction);
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g))
    hashes.add(`'sha256-${createHash("sha256").update(m[1]).digest("base64")}'`);
  writeFileSync(join(out, dest), html);
}

writeFileSync(join(out, "site.webmanifest"), JSON.stringify({
  name: "Reachout", short_name: "Reachout", start_url: "/", display: "standalone", background_color: "#ffffff", theme_color: "#4f46e5",
  icons: [{ src: "/assets/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/assets/icon-512.png", sizes: "512x512", type: "image/png" }],
}));
writeFileSync(join(out, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site}/sitemap.xml\n`);
const day = new Date().toISOString().slice(0, 10);
writeFileSync(join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
  [["/", "1.0"], ["/contact", "0.7"], ["/privacy", "0.3"], ["/terms", "0.3"]].map(([p, pri]) => `<url><loc>${site}${p}</loc><lastmod>${day}</lastmod><priority>${pri}</priority></url>`).join("") +
  `<url><loc>${app}/signup</loc><lastmod>${day}</lastmod><priority>0.6</priority></url></urlset>`);

// Sign-in and the app live on the app site.
writeFileSync(join(out, "_redirects"), `/login     ${app}/login     301
/signup    ${app}/signup    301
/app       ${app}/app       301
/app/*     ${app}/app/:splat 301
`);

const csp = [
  "default-src 'self'", `script-src 'self' ${[...hashes].join(" ")}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: https:", "connect-src 'self'", "frame-ancestors 'none'", "base-uri 'self'", "form-action 'self'", "object-src 'none'",
].join("; ");
writeFileSync(join(out, "_headers"), `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: ${csp}

/assets/*
  Cache-Control: public, max-age=604800
`);
console.log(`Landing site built for ${site} (app: ${app}), ${hashes.size} inline script hash(es).`);
