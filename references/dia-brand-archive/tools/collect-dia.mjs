import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const API_DATE = "2026-08-01";
const PROJECT_ID = "e5fj2khm";
const DATASET = "production";
const API_BASE = `https://${PROJECT_ID}.api.sanity.io/v${API_DATE}/data/query/${DATASET}`;
const outputRoot = path.resolve(
  process.argv.find((arg) => arg.startsWith("--out="))?.slice(6) ??
    "references/dia-brand-archive",
);
const downloadPreviews = process.argv.includes("--download-previews");
const downloadFiles = process.argv.includes("--download-files");
const previewWidth = Number(
  process.argv.find((arg) => arg.startsWith("--preview-width="))?.split("=")[1] ?? 1200,
);

const paths = {
  rawSanity: path.join(outputRoot, "raw", "sanity"),
  rawSite: path.join(outputRoot, "raw", "site"),
  manifests: path.join(outputRoot, "manifests"),
  analysis: path.join(outputRoot, "analysis"),
  previews: path.join(outputRoot, "previews", "images"),
  files: path.join(outputRoot, "files"),
};

for (const dir of Object.values(paths)) await mkdir(dir, { recursive: true });

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

async function fetchText(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.text();
}

async function groq(query) {
  const url = new URL(API_BASE);
  url.searchParams.set("query", query);
  const data = await fetchJson(url);
  return data.result;
}

function slugValue(value) {
  if (typeof value === "string") return value;
  return value?.current ?? "";
}

function csvEscape(value) {
  if (value == null) return "";
  const text = Array.isArray(value) ? value.join(" | ") : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(rows, columns) {
  return [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
  ].join("\n") + "\n";
}

function safeName(value) {
  return String(value || "asset")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

function walkReferences(value, doc, refs, currentPath = "$") {
  if (!value || typeof value !== "object") return;
  if (typeof value._ref === "string") {
    const records = refs.get(value._ref) ?? [];
    records.push({
      documentId: doc._id,
      documentType: doc._type,
      title: doc.title ?? doc.name ?? "",
      slug: slugValue(doc.slug),
      path: currentPath,
    });
    refs.set(value._ref, records);
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkReferences(item, doc, refs, `${currentPath}[${index}]`));
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    if (key === "lqip") continue;
    walkReferences(child, doc, refs, `${currentPath}.${key}`);
  }
}

const technicalKeys = new Set([
  "_id",
  "_type",
  "_key",
  "_ref",
  "_rev",
  "_createdAt",
  "_updatedAt",
  "url",
  "lqip",
  "assetId",
  "playbackId",
  "id",
  "filename",
  "originalFilename",
  "sha1hash",
  "mimeType",
  "path",
  "style",
  "marks",
  "markDefs",
  "format",
  "gradient",
  "query",
]);

function collectCopy(value, out, currentPath = "$") {
  if (value == null) return;
  if (typeof value === "string") {
    const key = currentPath.split(".").at(-1)?.replace(/\[\d+\]$/, "") ?? "";
    if (technicalKeys.has(key)) return;
    if (/^(https?:\/\/|image-|file-|drafts\.)/.test(value)) return;
    const normalized = value.replace(/\s+/g, " ").trim();
    if (normalized && /[A-Za-z]/.test(normalized)) out.push({ path: currentPath, text: normalized });
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectCopy(item, out, `${currentPath}[${index}]`));
    return;
  }
  if (typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (technicalKeys.has(key) || key === "palette") continue;
      collectCopy(child, out, `${currentPath}.${key}`);
    }
  }
}

const stopwords = new Set(
  "a an and are as at be been bullet but by can could did do does for from had has have he her here hers him his how i if image in into is it its just me more most my no normal not of on one or our ours out over she so some strong than that the their them then there these they this those to too up us video was we were what when where which who will with would you your yours".split(
    " ",
  ),
);

function wordsFrom(text) {
  return (text.toLowerCase().match(/[a-z][a-z'’-]*/g) ?? []).map((word) => word.replaceAll("’", "'"));
}

function frequency(items) {
  const counts = new Map();
  for (const item of items) counts.set(item, (counts.get(item) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([term, count]) => ({ term, count }));
}

async function downloadTo(url, destination) {
  try {
    await access(destination);
    return { status: "exists", destination };
  } catch {}
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, bytes);
  return { status: "downloaded", destination, bytes: bytes.length };
}

async function mapConcurrent(items, concurrency, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      try {
        results[index] = await fn(items[index], index);
      } catch (error) {
        results[index] = { error: String(error) };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

console.log("Collecting Dia's public Sanity corpus...");
const [content, images, files, videos] = await Promise.all([
  groq(`*[_type != "sanity.imageAsset" && _type != "sanity.fileAsset" && _type != "mux.videoAsset"] | order(_type asc, _createdAt asc)`),
  groq(`*[_type == "sanity.imageAsset"] | order(_createdAt asc){_id,_type,_createdAt,_updatedAt,assetId,extension,mimeType,originalFilename,path,sha1hash,size,url,metadata{dimensions,palette,hasAlpha,isOpaque}}`),
  groq(`*[_type == "sanity.fileAsset"] | order(_createdAt asc){_id,_type,_createdAt,_updatedAt,assetId,extension,mimeType,originalFilename,path,sha1hash,size,url}`),
  groq(`*[_type == "mux.videoAsset"] | order(_createdAt asc){_id,_type,_createdAt,_updatedAt,assetId,data{aspect_ratio,created_at,duration,id,max_resolution_tier,max_stored_frame_rate,max_stored_resolution,mp4_support,playback_ids,static_renditions,status}}`),
]);

await Promise.all([
  writeFile(path.join(paths.rawSanity, "content.json"), JSON.stringify(content, null, 2)),
  writeFile(path.join(paths.rawSanity, "image-assets.json"), JSON.stringify(images, null, 2)),
  writeFile(path.join(paths.rawSanity, "file-assets.json"), JSON.stringify(files, null, 2)),
  writeFile(path.join(paths.rawSanity, "video-assets.json"), JSON.stringify(videos, null, 2)),
]);

const refs = new Map();
for (const doc of content) walkReferences(doc, doc, refs);

const contentRows = content.map((doc) => ({
  id: doc._id,
  type: doc._type,
  created: doc._createdAt,
  updated: doc._updatedAt,
  title: doc.title ?? doc.name ?? doc.seo?.metaTitle ?? "",
  slug: slugValue(doc.slug),
  releaseDate: doc.releaseDate ?? doc.effectiveDate ?? "",
  version: doc.releaseVersion ?? doc.appVersion ?? "",
}));

const imageRows = images.map((asset) => {
  const usage = refs.get(asset._id) ?? [];
  return {
    id: asset._id,
    created: asset._createdAt,
    updated: asset._updatedAt,
    filename: asset.originalFilename,
    extension: asset.extension,
    mimeType: asset.mimeType,
    width: asset.metadata?.dimensions?.width,
    height: asset.metadata?.dimensions?.height,
    aspectRatio: asset.metadata?.dimensions?.aspectRatio,
    bytes: asset.size,
    hasAlpha: asset.metadata?.hasAlpha,
    dominant: asset.metadata?.palette?.dominant?.background,
    vibrant: asset.metadata?.palette?.vibrant?.background,
    muted: asset.metadata?.palette?.muted?.background,
    references: usage.length,
    sourceTypes: [...new Set(usage.map((item) => item.documentType))].join(" | "),
    sourceDocs: [...new Set(usage.map((item) => item.slug || item.title || item.documentId))].join(" | "),
    url: asset.url,
  };
});

const fileRows = files.map((asset) => {
  const usage = refs.get(asset._id) ?? [];
  return {
    id: asset._id,
    created: asset._createdAt,
    updated: asset._updatedAt,
    filename: asset.originalFilename,
    extension: asset.extension,
    mimeType: asset.mimeType,
    bytes: asset.size,
    references: usage.length,
    sourceTypes: [...new Set(usage.map((item) => item.documentType))].join(" | "),
    sourceDocs: [...new Set(usage.map((item) => item.slug || item.title || item.documentId))].join(" | "),
    url: asset.url,
  };
});

const videoRows = videos.map((asset) => {
  const usage = refs.get(asset._id) ?? [];
  const playbackId = asset.data?.playback_ids?.find((item) => item.policy === "public")?.id ?? "";
  return {
    id: asset._id,
    created: asset._createdAt,
    updated: asset._updatedAt,
    assetId: asset.assetId,
    durationSeconds: asset.data?.duration,
    aspectRatio: asset.data?.aspect_ratio,
    maxResolution: asset.data?.max_stored_resolution ?? asset.data?.max_resolution_tier,
    playbackId,
    streamUrl: playbackId ? `https://stream.mux.com/${playbackId}.m3u8` : "",
    posterUrl: playbackId ? `https://image.mux.com/${playbackId}/thumbnail.jpg?time=0` : "",
    references: usage.length,
    sourceTypes: [...new Set(usage.map((item) => item.documentType))].join(" | "),
    sourceDocs: [...new Set(usage.map((item) => item.slug || item.title || item.documentId))].join(" | "),
  };
});

await Promise.all([
  writeFile(path.join(paths.manifests, "content.csv"), toCsv(contentRows, Object.keys(contentRows[0]))),
  writeFile(path.join(paths.manifests, "images.csv"), toCsv(imageRows, Object.keys(imageRows[0]))),
  writeFile(path.join(paths.manifests, "files.csv"), toCsv(fileRows, Object.keys(fileRows[0]))),
  writeFile(path.join(paths.manifests, "videos.csv"), toCsv(videoRows, Object.keys(videoRows[0]))),
  writeFile(
    path.join(paths.manifests, "asset-usage.json"),
    JSON.stringify(Object.fromEntries([...refs.entries()].sort(([a], [b]) => a.localeCompare(b))), null, 2),
  ),
]);

const copyRecords = [];
const brandCopyTypes = new Set([
  "changelog",
  "downloadPage",
  "earlyBirdsPage",
  "enterprisePage",
  "footer",
  "gettingStartedPage",
  "globalConfig",
  "header",
  "homePage",
  "invitePage",
  "plansPage",
  "proPage",
  "releaseNote",
  "releaseNotesBanner",
  "releaseNotesLanding",
  "skillPack",
  "skillsLandingPage",
  "startPage",
  "studentsLandingPage",
  "socialTestimonial",
  "thankYouPage",
  "updateDiaInstructions",
  "useCase",
  "windowsPage",
]);
const brandContent = content.filter(
  (doc) => brandCopyTypes.has(doc._type) && slugValue(doc.slug) !== "lorem-ipsum-dolor-set",
);
for (const doc of brandContent) {
  const strings = [];
  collectCopy(doc, strings);
  copyRecords.push(
    ...strings.map((entry) => ({
      documentId: doc._id,
      documentType: doc._type,
      title: doc.title ?? doc.name ?? "",
      slug: slugValue(doc.slug),
      ...entry,
    })),
  );
}

const corpus = copyRecords.map((entry) => entry.text).join("\n");
const allWords = wordsFrom(corpus);
const meaningfulWords = allWords.filter(
  (word) => !stopwords.has(word) && word.length > 2 && word.length < 32,
);
const bigrams = [];
const trigrams = [];
for (const record of copyRecords) {
  const recordWords = wordsFrom(record.text).filter((word) => !stopwords.has(word));
  for (let i = 0; i < recordWords.length - 1; i++) bigrams.push(recordWords.slice(i, i + 2).join(" "));
  for (let i = 0; i < recordWords.length - 2; i++) trigrams.push(recordWords.slice(i, i + 3).join(" "));
}

const releaseDocs = content.filter((doc) => doc._type === "releaseNote" || doc._type === "changelog");
const copyStats = {
  generatedAt: new Date().toISOString(),
  corpus: {
    records: copyRecords.length,
    characters: corpus.length,
    words: allWords.length,
    documents: brandContent.length,
    releaseDocuments: releaseDocs.length,
  },
  voiceSignals: {
    firstPersonPlural: allWords.filter((word) => ["we", "we're", "we've", "our", "ours", "us"].includes(word)).length,
    secondPerson: allWords.filter((word) => ["you", "your", "yours", "you're", "you'll", "you've"].includes(word)).length,
    contractions: (corpus.match(/\b[A-Za-z]+['’](?:t|re|ve|ll|d|m|s)\b/g) ?? []).length,
    exclamationMarks: (corpus.match(/!/g) ?? []).length,
    questions: (corpus.match(/\?/g) ?? []).length,
    emDashes: (corpus.match(/—/g) ?? []).length,
    emojis: (corpus.match(/\p{Extended_Pictographic}/gu) ?? []).length,
  },
  topWords: frequency(meaningfulWords).slice(0, 150),
  topBigrams: frequency(bigrams).filter((item) => item.count > 2).slice(0, 100),
  topTrigrams: frequency(trigrams).filter((item) => item.count > 1).slice(0, 80),
  documentTypes: frequency(brandContent.map((doc) => doc._type)),
};

await Promise.all([
  writeFile(path.join(paths.analysis, "copy-corpus.txt"), corpus + "\n"),
  writeFile(path.join(paths.analysis, "copy-records.json"), JSON.stringify(copyRecords, null, 2)),
  writeFile(path.join(paths.analysis, "language-stats.json"), JSON.stringify(copyStats, null, 2)),
]);

const pages = {
  home: "https://www.diabrowser.com/",
  releaseNotesLatest: "https://www.diabrowser.com/release-notes/latest",
  reportsCampaign: "https://www.diabrowser.com/start",
  students: "https://www.diabrowser.com/students",
  skills: "https://www.diabrowser.com/skills",
  work: "https://www.diabrowser.com/forwork",
  security: "https://www.diabrowser.com/security",
  gettingStarted: "https://www.diabrowser.com/getting-started",
  download: "https://www.diabrowser.com/download",
  windows: "https://www.diabrowser.com/windows",
};

console.log("Saving current public pages and CSS...");
const pageHtml = {};
for (const [name, url] of Object.entries(pages)) {
  try {
    const html = await fetchText(url);
    pageHtml[name] = html;
    await writeFile(path.join(paths.rawSite, `${name}.html`), html);
  } catch (error) {
    console.warn(`Page skipped: ${name}: ${error}`);
  }
}

const homeHtml = pageHtml.home ?? "";
const cssPaths = [...homeHtml.matchAll(/href="([^"?]+\.css[^"<]*)"/g)].map((match) => match[1]);
const fontEndpoints = new Set();
for (let index = 0; index < cssPaths.length; index++) {
  const cssUrl = new URL(cssPaths[index], pages.home).toString().replaceAll("&amp;", "&");
  const css = await fetchText(cssUrl);
  await writeFile(path.join(paths.rawSite, `current-${index + 1}.css`), css);
  for (const match of css.matchAll(/url\(([^)]+\.(?:woff2?|ttf|otf))\)/g)) {
    fontEndpoints.add(new URL(match[1].replaceAll('"', "").replaceAll("'", ""), pages.home).toString());
  }
}
await writeFile(path.join(paths.manifests, "font-endpoints.txt"), [...fontEndpoints].sort().join("\n") + "\n");

const archiveSummary = {
  generatedAt: new Date().toISOString(),
  publicSanityApi: API_BASE,
  counts: {
    contentDocuments: content.length,
    imageAssets: images.length,
    contentLinkedImages: imageRows.filter((row) => row.references > 0).length,
    fileAssets: files.length,
    videoAssets: videos.length,
    changelogs: content.filter((doc) => doc._type === "changelog").length,
    releaseNotes: content.filter((doc) => doc._type === "releaseNote").length,
    skills: content.filter((doc) => doc._type === "skill").length,
    skillPacks: content.filter((doc) => doc._type === "skillPack").length,
    fontEndpoints: fontEndpoints.size,
  },
  totals: {
    originalImageBytes: images.reduce((sum, asset) => sum + (asset.size ?? 0), 0),
    fileBytes: files.reduce((sum, asset) => sum + (asset.size ?? 0), 0),
    videoDurationSeconds: videos.reduce((sum, asset) => sum + (asset.data?.duration ?? 0), 0),
  },
  notes: [
    "Image and video manifests are exhaustive for the public Sanity dataset at collection time.",
    "Commercial font endpoints are catalogued but font binaries are intentionally not downloaded or redistributed.",
    "Preview images are transformed reference copies; original URLs remain in images.csv.",
  ],
};
await writeFile(path.join(paths.manifests, "archive-summary.json"), JSON.stringify(archiveSummary, null, 2));

if (downloadPreviews) {
  const linkedImages = images.filter((asset) => (refs.get(asset._id) ?? []).length > 0 && asset.url);
  console.log(`Downloading ${linkedImages.length} content-linked image previews at max ${previewWidth}px...`);
  const previewResults = await mapConcurrent(linkedImages, 8, async (asset, index) => {
    const url = new URL(asset.url);
    if (asset.extension !== "svg") {
      url.searchParams.set("w", String(previewWidth));
      url.searchParams.set("fit", "max");
      url.searchParams.set("q", "82");
    }
    const filename = `${safeName(asset._id)}__${safeName(asset.originalFilename || path.basename(asset.url))}`;
    const destination = path.join(paths.previews, filename);
    const result = await downloadTo(url.toString(), destination);
    if ((index + 1) % 25 === 0 || index + 1 === linkedImages.length) {
      console.log(`  images ${index + 1}/${linkedImages.length}`);
    }
    return { id: asset._id, url: url.toString(), destination: path.relative(outputRoot, destination), ...result };
  });
  await writeFile(path.join(paths.manifests, "preview-downloads.json"), JSON.stringify(previewResults, null, 2));
}

if (downloadFiles) {
  console.log(`Downloading ${files.length} public file assets...`);
  const fileResults = await mapConcurrent(files.filter((asset) => asset.url), 4, async (asset, index) => {
    const filename = `${safeName(asset._id)}__${safeName(asset.originalFilename || path.basename(asset.url))}`;
    const destination = path.join(paths.files, filename);
    const result = await downloadTo(asset.url, destination);
    console.log(`  files ${index + 1}/${files.length}`);
    return { id: asset._id, url: asset.url, destination: path.relative(outputRoot, destination), ...result };
  });
  await writeFile(path.join(paths.manifests, "file-downloads.json"), JSON.stringify(fileResults, null, 2));
}

console.log(JSON.stringify(archiveSummary, null, 2));
