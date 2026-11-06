import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { isIP } from "node:net";
import { legalService, siteOrigin } from "../site.config.mjs";

const src = new URL("../src/", import.meta.url);
const dist = new URL("../dist/", import.meta.url);
const pages = [
  {
    file: "index.html",
    route: "/",
    title: "Advocacia Rodrigues e Alves | Escritório de Advocacia em Valparaíso - SP",
    description: "Conheça a Advocacia Rodrigues e Alves, escritório de advocacia em Valparaíso - SP. Informações institucionais, localização e canais de contato."
  },
  {
    file: "privacidade.html",
    route: "/privacidade",
    title: "Política de Privacidade | Advocacia Rodrigues e Alves",
    description: "Saiba como o site da Advocacia Rodrigues e Alves trata dados pessoais no rascunho de contato e nas integrações externas."
  }
];
const origin = siteOrigin ? new URL(siteOrigin) : null;
if (origin && (
  origin.protocol !== "https:" || origin.origin !== siteOrigin || origin.port ||
  !origin.hostname.includes(".") || isIP(origin.hostname) || /(^|\.)(vercel\.app|localhost|local)\.?$/.test(origin.hostname)
)) {
  throw new Error("siteOrigin deve conter a origem HTTPS do domínio definitivo, sem porta, caminho ou barra final.");
}

const production = origin && process.env.VERCEL_ENV === "production";
const year = new Intl.DateTimeFormat("pt-BR", { year: "numeric", timeZone: "America/Sao_Paulo" }).format(new Date());
const schema = JSON.stringify({
  ...legalService,
  ...(production && { "@id": new URL("/#escritorio", origin).href, url: origin.href })
}).replaceAll("<", "\\u003c");
const imageAlt = "Balança jurídica dourada e o nome Advocacia Rodrigues e Alves";

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

await mkdir(dist, { recursive: true });
await cp(new URL("assets/", src), new URL("assets/", dist), { recursive: true });

for (const { file, route, title, description } of pages) {
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}">`,
    `<meta name="robots" content="${production ? "index, follow, max-image-preview:large" : "noindex, follow"}">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:locale" content="pt_BR">',
    `<meta property="og:site_name" content="${escapeHtml(legalService.name)}">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
    `<meta name="twitter:card" content="${production ? "summary_large_image" : "summary"}">`,
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(description)}">`
  ];
  if (production) {
    const canonical = new URL(route, origin).href;
    const image = new URL("/assets/compartilhamento.png", origin).href;
    tags.push(
      `<link rel="canonical" href="${canonical}">`,
      `<meta property="og:url" content="${canonical}">`,
      `<meta property="og:image" content="${image}">`,
      '<meta property="og:image:type" content="image/png">',
      '<meta property="og:image:width" content="1200">',
      '<meta property="og:image:height" content="630">',
      `<meta property="og:image:alt" content="${imageAlt}">`,
      `<meta name="twitter:image" content="${image}">`,
      `<meta name="twitter:image:alt" content="${imageAlt}">`
    );
  }

  const template = await readFile(new URL(file, src), "utf8");
  const html = template.replaceAll("{{YEAR}}", year)
    .replace("{{LEGAL_SCHEMA}}", () => schema)
    .replace("{{PAGE_SEO}}", () => tags.join("\n  "));
  await writeFile(new URL(file, dist), html);
}

const sitemapFile = new URL("sitemap.xml", dist);
let robots = "User-agent: *\nAllow: /\n";
if (production) {
  robots += `Sitemap: ${origin.origin}/sitemap.xml\n`;
  const urls = pages.map(({ route }) => `  <url><loc>${new URL(route, origin).href}</loc></url>`).join("\n");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  await writeFile(sitemapFile, sitemap);
} else {
  await rm(sitemapFile, { force: true });
}
await writeFile(new URL("robots.txt", dist), robots);
console.log("Build concluído em dist/.");
