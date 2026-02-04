export type EventInfo = {
  title: string;
  shortDescription: string;
  description: string;
  sportId: string;
  categoryId: string;
  eventType: string;
  levelRequired: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timezone: string;
  venueName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  country: string;
  postalCode: string;
};

export type TicketDraft = {
  id?: number;
  name: string;
  price: string;
  quantity: string;
};

export type PricingDraft = {
  capacityTotal: string;
  isFree: boolean;
  currency: string;
  tickets: TicketDraft[];
  cancellationPolicy: string;
  cancellationPublic: boolean;
};

export type MediaDraftItem = {
  id?: number;
  url: string;
  mediaType: string;
  title: string;
};

export type MediaDraft = {
  coverImageUrl: string;
  items: MediaDraftItem[];
};

export type EventDraft = {
  eventId?: number;
  info: EventInfo;
  pricing: PricingDraft;
  media: MediaDraft;
};

const DRAFT_KEY = "event_draft";

const emptyDraft: EventDraft = {
  eventId: undefined,
  info: {
    title: "",
    shortDescription: "",
    description: "",
    sportId: "",
    categoryId: "",
    eventType: "tournament",
    levelRequired: "all",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    timezone: "UTC",
    venueName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    region: "",
    country: "Tunisie",
    postalCode: "",
  },
  pricing: {
    capacityTotal: "",
    isFree: false,
    currency: "TND",
    tickets: [
      {
        name: "Tarif standard",
        price: "",
        quantity: "",
      },
    ],
    cancellationPolicy: "",
    cancellationPublic: false,
  },
  media: {
    coverImageUrl: "",
    items: [
      { url: "", mediaType: "image", title: "" },
      { url: "", mediaType: "image", title: "" },
      { url: "", mediaType: "image", title: "" },
    ],
  },
};

export function getEmptyDraft(): EventDraft {
  return JSON.parse(JSON.stringify(emptyDraft)) as EventDraft;
}

export function readEventDraft(): EventDraft {
  if (typeof window === "undefined") return getEmptyDraft();
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return getEmptyDraft();
    const parsed = JSON.parse(raw) as EventDraft;
    return {
      ...getEmptyDraft(),
      ...parsed,
      info: { ...getEmptyDraft().info, ...parsed.info },
      pricing: { ...getEmptyDraft().pricing, ...parsed.pricing },
      media: { ...getEmptyDraft().media, ...parsed.media },
    };
  } catch (error) {
    return getEmptyDraft();
  }
}

export function writeEventDraft(nextDraft: EventDraft) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(nextDraft));
  } catch (error) {
    // Ignore storage errors.
  }
}

export function updateEventDraft(partial: Partial<EventDraft>) {
  const current = readEventDraft();
  const next: EventDraft = {
    ...current,
    ...partial,
    info: { ...current.info, ...(partial.info ?? {}) },
    pricing: { ...current.pricing, ...(partial.pricing ?? {}) },
    media: { ...current.media, ...(partial.media ?? {}) },
  };
  writeEventDraft(next);
}

export function clearEventDraft() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    // Ignore storage errors.
  }
}
