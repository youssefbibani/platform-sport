export type MarketplaceEvent = {
  id: number;
  title: string;
  slug: string;
  short_description?: string;
  sport_name?: string;
  category_name?: string;
  event_type?: string;
  level_required?: string;
  start_at?: string;
  end_at?: string;
  city?: string;
  country?: string;
  capacity_total?: number;
  capacity_reserved?: number;
  is_free?: boolean;
  currency?: string;
  cover_image_url?: string;
};

export type EventTicket = {
  price: string | number;
  name?: string;
};

export type MarketplaceEventDetail = {
  id: number;
  ticket_types?: EventTicket[];
  is_free?: boolean;
  currency?: string;
};

export type EventCard = {
  name: string;
  date: string;
  location: string;
  level: string;
  capacity: string;
  price: string;
  tag: string;
  image: { src: string; alt: string };
  imageUrl?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

const levelLabels: Record<string, string> = {
  all: "Tous niveaux",
  beginner: "Debutant",
  intermediate: "Intermediaire",
  advanced: "Avance",
};

const formatDate = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getPriceLabel = (event: MarketplaceEvent, detail?: MarketplaceEventDetail | null) => {
  if (event.is_free) return "Gratuit";
  const currency = event.currency || detail?.currency || "TND";
  const prices = detail?.ticket_types
    ?.map((ticket) => Number(ticket.price))
    .filter((price) => Number.isFinite(price));
  if (prices && prices.length) {
    const minPrice = Math.min(...prices);
    return `A partir de ${minPrice} ${currency}`;
  }
  return `Billet ${currency}`;
};

export async function fetchPublishedEvents(): Promise<MarketplaceEvent[]> {
  try {
    const response = await fetch(`${API_BASE}/api/marketplace/events/`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data = (await response.json().catch(() => [])) as MarketplaceEvent[];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

export async function fetchEventDetail(slug: string): Promise<MarketplaceEventDetail | null> {
  if (!slug) return null;
  try {
    const response = await fetch(`${API_BASE}/api/marketplace/events/${slug}/`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json().catch(() => null)) as MarketplaceEventDetail | null;
  } catch (error) {
    return null;
  }
}

export async function buildEventCards(
  events: MarketplaceEvent[],
  fallbackImages: { src: string; alt: string }[]
): Promise<EventCard[]> {
  const detailList = await Promise.all(
    events.map((event) => fetchEventDetail(event.slug))
  );

  return events.map((event, index) => {
    const fallback = fallbackImages[index % fallbackImages.length];
    const detail = detailList[index];
    const location = event.city || event.country || "--";
    const level = levelLabels[event.level_required || "all"] || "Tous niveaux";
    const capacity = event.capacity_total ? `${event.capacity_total} places` : "--";
    const tag = event.category_name || event.sport_name || "Evenement";

    return {
      name: event.title,
      date: formatDate(event.start_at),
      location,
      level,
      capacity,
      price: getPriceLabel(event, detail),
      tag,
      image: fallback,
      imageUrl: event.cover_image_url || undefined,
    };
  });
}


export type MarketplaceEventFull = {
  id: number;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  event_type?: string;
  level_required?: string;
  start_at?: string;
  end_at?: string;
  timezone?: string;
  capacity_total?: number;
  capacity_reserved?: number;
  capacity_available?: number;
  is_free?: boolean;
  currency?: string;
  cover_image_url?: string;
  status?: string;
  published_at?: string;
  cancellation_policy?: string;
  cancellation_public?: boolean;
  organizer_name?: string;
  sport?: { name?: string };
  category?: { name?: string };
  location?: {
    venue_name?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    region?: string;
    country?: string;
    postal_code?: string;
  };
  ticket_types?: EventTicket[];
  media?: Array<{
    id: number;
    media_type: string;
    url: string;
    title?: string;
    is_cover?: boolean;
  }>;
};

export async function fetchEventFull(slug: string): Promise<MarketplaceEventFull | null> {
  if (!slug) return null;
  try {
    const response = await fetch(`${API_BASE}/api/marketplace/events/${slug}/`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json().catch(() => null)) as MarketplaceEventFull | null;
  } catch (error) {
    return null;
  }
}
