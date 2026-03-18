import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  /* CORS preflight */
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin":  "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  /* Token kontrolü — Netlify dashboard'da MENU_SAVE_TOKEN env var olarak ayarlayın */
  const expected = Netlify.env.get("MENU_SAVE_TOKEN");
  if (!expected || body.token !== expected) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!body.products || !Array.isArray(body.products)) {
    return new Response("Invalid products", { status: 400 });
  }

  try {
    const store = getStore("menu");
    await store.set("products", JSON.stringify(body.products));

    return new Response(JSON.stringify({ ok: true, count: body.products.length }), {
      status: 200,
      headers: {
        "Content-Type":                "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    console.error("save-menu error:", e);
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: {
        "Content-Type":                "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};

export const config = { path: "/api/save-menu" };
