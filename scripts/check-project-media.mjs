import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "src/data/folioProjects.ts"), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { folioProjects } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const failures = [];
const checked = new Set();
function check(src, context) {
  if (!src?.startsWith("/assets/")) {
    failures.push(`${context}: expected a local asset, got ${src}`);
    return;
  }
  const file = path.join(root, "public", src.split(/[?#]/)[0]);
  if (!fs.existsSync(file) || fs.statSync(file).size === 0) failures.push(`${context}: missing or empty ${src}`);
  checked.add(src);
}
function media(items, context) {
  for (const item of items) {
    if (item.kind === "note" || item.kind === "sketch") continue;
    if (item.kind === "group") { media(item.media, `${context}/${item.id}`); continue; }
    check(item.src, context);
    if (item.kind === "video") check(item.poster, `${context} video poster`);
  }
}
for (const project of Object.values(folioProjects)) {
  media(project.media, project.id);
  media(project.previewMedia, `${project.id} preview`);
  if (project.logo) check(project.logo, `${project.id} logo`);
  for (const preview of project.folderPreviews) if (preview.src) check(preview.src, `${project.id} folder`);
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Verified ${checked.size} case-study assets, including video posters.`);
