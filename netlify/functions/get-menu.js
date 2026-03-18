import { getStore } from "@netlify/blobs";

export default async () => {
  const store = getStore("menu");
  const data = await store.get("products");

  return new Response(data || "[]", {
    headers: { "Content-Type": "application/json" }
  });
};

export const config = { path: "/api/get-menu" };
