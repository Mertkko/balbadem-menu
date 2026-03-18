import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { products, password } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return new Response("Unauthorized", { status: 401 });
  }

  const store = getStore("menu");
  await store.set("products", JSON.stringify(products));

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
};

export const config = { path: "/api/save-menu" };
