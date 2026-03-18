import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore({
    name: "menu",
    siteID: context.site.id,
    token: Netlify.env.get("NETLIFY_BLOBS_TOKEN")
  });

  try {
    const data = await store.get("products");
    return new Response(data || "null", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch(e) {
    return new Response("null", { status: 200 });
  }
};

export const config = { path: "/api/get-menu" };
