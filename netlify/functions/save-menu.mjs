import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  if(req.method !== "POST") return new Response("Method not allowed", {status:405});

  const body = await req.json();

  /* Şifre kontrolü — Netlify dashboard'da env var olarak ayarlayacağız */
  if(body.token !== Netlify.env.get("MENU_SAVE_TOKEN")){
    return new Response("Unauthorized", { status: 401 });
  }

  const store = getStore({
    name: "menu",
    siteID: context.site.id,
    token: Netlify.env.get("NETLIFY_BLOBS_TOKEN")
  });

  await store.set("products", JSON.stringify(body.products));

  return new Response(JSON.stringify({ok: true}), {
    headers: { "Content-Type": "application/json" }
  });
};

export const config = { path: "/api/save-menu" };
