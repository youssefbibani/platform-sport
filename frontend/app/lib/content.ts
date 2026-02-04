const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

export type PageContentPayload = Record<string, unknown>;

export type PageContentResponse = {
  slug: string;
  title?: string;
  payload: PageContentPayload;
  updated_at?: string;
};

async function fetchPageContent(slug: "home" | "about") {
  try {
    const response = await fetch(`${API_BASE}/api/content/${slug}/`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as PageContentResponse;
  } catch (error) {
    return null;
  }
}

export async function fetchHomeContent() {
  const data = await fetchPageContent("home");
  return data?.payload ?? null;
}

export async function fetchAboutContent() {
  const data = await fetchPageContent("about");
  return data?.payload ?? null;
}
