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

  try {
    const store = getStore("menu");
    const data  = await store.get("products");

    return new Response(data || "null", {
      status: 200,
      headers: {
        "Content-Type":                "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control":               "no-cache, no-store, must-revalidate",
      },
    });
  } catch (e) {
    console.error("get-menu error:", e);
    return new Response("null", {
      status: 200,
      headers: {
        "Content-Type":                "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};

export const config = { path: "/api/get-menu" };
