// API du plan de travail partagé (theosury.fr/pdt-aleks) : un état JSON dans Netlify Blobs + la présence de chacun
import { getStore } from "@netlify/blobs";
import { createHash, timingSafeEqual } from "node:crypto";

// le code d'accès est dans la variable d'environnement Netlify PDT_KEY (jamais dans le dépôt)
const digest = v => createHash("sha256").update(String(v)).digest();
function keyOk(given) {
  const secret = (globalThis.Netlify?.env?.get("PDT_KEY")) || process.env.PDT_KEY;
  return !!secret && timingSafeEqual(digest(given), digest(secret));
}
const COLLS = ["cast", "seqs", "strips", "breaks", "days"];
const PRESENCE_TTL = 20000;

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
const okPath = p => typeof p === "string" && /^[a-z]+\/[A-Za-z0-9_-]{1,80}$/.test(p) && COLLS.includes(p.split("/")[0]);

async function peers(store) {
  const { blobs } = await store.list({ prefix: "presence/" });
  const now = Date.now(), out = [];
  await Promise.all(blobs.map(async b => {
    const p = await store.get(b.key, { type: "json" }).catch(() => null);
    if (!p || now - p.t > PRESENCE_TTL) { if (p && now - p.t > 5 * 60000) store.delete(b.key).catch(() => {}); return; }
    out.push({ peer: b.key.slice(9), presence: p.presence || {} });
  }));
  return out;
}

export default async (req) => {
  const key = req.headers.get("x-pdt-key") || "";
  if (!keyOk(key)) { await new Promise(r => setTimeout(r, 800)); return json({ error: "code" }, 401); }
  const store = getStore({ name: "pdt-aleks", consistency: "strong" });

  if (req.method === "GET") {
    const url = new URL(req.url);
    const cur = await store.get("state", { type: "json" }) || { rev: 0, docs: {} };
    const ps = await peers(store);
    if (url.searchParams.get("rev") === String(cur.rev)) return json({ rev: cur.rev, same: true, peers: ps });
    return json({ rev: cur.rev, docs: cur.docs, peers: ps });
  }

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return json({ error: "json" }, 400); }

    if (body.presence && typeof body.peer === "string" && /^[a-z0-9]{6,24}$/.test(body.peer)) {
      const text = JSON.stringify(body.presence);
      if (text.length > 2000) return json({ error: "trop gros" }, 400);
      await store.setJSON("presence/" + body.peer, { t: Date.now(), presence: body.presence });
      return json({ ok: true });
    }

    const ops = Array.isArray(body.ops) ? body.ops : null;
    if (!ops || !ops.length || ops.length > 200 || !ops.every(o => Array.isArray(o) && okPath(o[0]) && (o[1] === null || typeof o[1] === "object"))) return json({ error: "ops" }, 400);
    if (JSON.stringify(ops).length > 500000) return json({ error: "trop gros" }, 400);

    // écriture conditionnelle : on relit et on réessaie si quelqu'un a écrit entre-temps
    for (let i = 0; i < 8; i++) {
      const got = await store.getWithMetadata("state", { type: "json" });
      const cur = got?.data || { rev: 0, docs: {} };
      for (const [path, v] of ops) {
        const [c, id] = path.split("/");
        cur.docs[c] ||= {};
        if (v === null) delete cur.docs[c][id]; else cur.docs[c][id] = v;
      }
      cur.rev += 1;
      const res = got ? await store.setJSON("state", cur, { onlyIfMatch: got.etag }) : await store.setJSON("state", cur, { onlyIfNew: true });
      if (res.modified) return json({ rev: cur.rev, docs: cur.docs });
      await new Promise(r => setTimeout(r, 40 + Math.random() * 120));
    }
    return json({ error: "occupé, réessayer" }, 409);
  }
  return json({ error: "méthode" }, 405);
};

export const config = { path: "/api/pdt" };
