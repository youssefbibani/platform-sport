"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SiteHeader from "../../../components/shared/SiteHeader";
import Footer from "../../../components/shared/Footer";
import Reveal from "../../../components/shared/Reveal";
import styles from "../../../tournois/[slug]/page.module.css";
import { authorizedFetch } from "../../../lib/auth";

const levelLabels: Record<string, string> = {
  all: "Tous niveaux",
  beginner: "Debutant",
  intermediate: "Intermediaire",
  advanced: "Avance",
};

const typeLabels: Record<string, string> = {
  tournament: "Tournoi",
  match: "Match",
  stage: "Stage",
  course: "Cours",
};

const statusLabels: Record<string, string> = {
  published: "Publie",
  pending: "En attente",
  rejected: "Rejete",
  draft: "Brouillon",
  cancelled: "Annule",
  completed: "Termine",
};

const formatDate = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getCoverImage = (cover?: string, media?: Array<{ url: string; is_cover?: boolean }>) => {
  if (cover) return cover;
  if (!media || !media.length) return "";
  const coverMedia = media.find((item) => item.is_cover) || media[0];
  return coverMedia?.url || "";
};

const getPriceLabel = (
  isFree?: boolean,
  currency?: string,
  tickets?: Array<{ price: string | number; name?: string }>
) => {
  if (isFree) return "Gratuit";
  const safeCurrency = currency || "TND";
  const prices = tickets
    ?.map((ticket) => Number(ticket.price))
    .filter((price) => Number.isFinite(price));
  if (prices && prices.length) {
    const minPrice = Math.min(...prices);
    return `A partir de ${minPrice} ${safeCurrency}`;
  }
  return `Billet ${safeCurrency}`;
};

type EventDetail = {
  id: number;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  event_type?: string;
  level_required?: string;
  start_at?: string;
  end_at?: string;
  capacity_total?: number;
  capacity_reserved?: number;
  capacity_available?: number;
  is_free?: boolean;
  currency?: string;
  cover_image_url?: string;
  status?: string;
  organizer_name?: string;
  cancellation_policy?: string;
  cancellation_public?: boolean;
  sport?: { name?: string };
  category?: { name?: string };
  location?: {
    venue_name?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    country?: string;
  };
  ticket_types?: Array<{ price: string | number; name?: string }>;
  media?: Array<{ id: number; media_type: string; url: string; title?: string; is_cover?: boolean }>;
};

export default function OrganizerEventDetailPage() {
  const params = useParams();
  const eventId = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!eventId) return;
    let ignore = false;

    const loadEvent = async () => {
      const response = await authorizedFetch(`/api/marketplace/organizer/events/${eventId}/`);
      if (!response) {
        if (!ignore) {
          setStatus("error");
          setMessage("Connectez-vous avec un compte organisateur.");
        }
        return;
      }
      const data = (await response.json().catch(() => null)) as EventDetail | null;
      if (!response.ok || !data) {
        if (!ignore) {
          setStatus("error");
          setMessage("Evenement introuvable ou acces refuse.");
        }
        return;
      }
      if (!ignore) {
        setEvent(data);
        setStatus("success");
      }
    };

    loadEvent();

    return () => {
      ignore = true;
    };
  }, [eventId]);

  if (status === "loading") {
    return (
      <div className={styles.page}>
        <SiteHeader />
        <main className={styles.main}>
          <div className={styles.card}>Chargement des details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (status === "error" || !event) {
    return (
      <div className={styles.page}>
        <SiteHeader />
        <main className={styles.main}>
          <div className={styles.card}>{message || "Impossible de charger l'evenement."}</div>
        </main>
        <Footer />
      </div>
    );
  }

  const cover = getCoverImage(event.cover_image_url, event.media);
  const startDate = formatDate(event.start_at);
  const startTime = formatTime(event.start_at);
  const endTime = formatTime(event.end_at);
  const timeRange = startTime && endTime ? `${startTime} - ${endTime}` : startTime || "";
  const priceLabel = getPriceLabel(event.is_free, event.currency, event.ticket_types);
  const location = event.location;
  const locationLine = [
    location?.venue_name,
    location?.address_line1,
    location?.city,
    location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <section className={styles.hero}>
          <Reveal className={styles.heroContent}>
            <p className={styles.eyebrow}>Evenement (organisateur)</p>
            <h1>{event.title}</h1>
            <p className={styles.heroLead}>
              {event.short_description || "Consultez les details de votre evenement."}
            </p>
            <div className={styles.badges}>
              {event.sport?.name ? <span className={styles.badge}>{event.sport.name}</span> : null}
              {event.category?.name ? (
                <span className={styles.badge}>{event.category.name}</span>
              ) : null}
              {event.level_required ? (
                <span className={styles.badge}>
                  {levelLabels[event.level_required] || event.level_required}
                </span>
              ) : null}
            </div>
            <div className={styles.heroMeta}>
              <div>
                <span>Date</span>
                <strong>{startDate}</strong>
              </div>
              <div>
                <span>Heure</span>
                <strong>{timeRange || "--"}</strong>
              </div>
              <div>
                <span>Lieu</span>
                <strong>{location?.city || "--"}</strong>
              </div>
            </div>
          </Reveal>

          <Reveal className={styles.heroMedia} delay={140}>
            <div className={styles.heroImage}>
              {cover ? (
                <div
                  className={styles.heroImageMedia}
                  style={{ backgroundImage: `url(${cover})` }}
                  role="img"
                  aria-label={event.title}
                />
              ) : (
                <div className={styles.heroImagePlaceholder}>Apercu indisponible</div>
              )}
            </div>
          </Reveal>
        </section>

        <section className={styles.detailsGrid}>
          <div className={styles.mainColumn}>
            <Reveal className={styles.card}>
              <h2>Description</h2>
              <p>{event.description || event.short_description || "Aucune description."}</p>
            </Reveal>

            <Reveal className={styles.card} delay={100}>
              <h2>Informations pratiques</h2>
              <div className={styles.infoGrid}>
                <div>
                  <span>Type</span>
                  <strong>{typeLabels[event.event_type || ""] || event.event_type || "--"}</strong>
                </div>
                <div>
                  <span>Niveau</span>
                  <strong>
                    {levelLabels[event.level_required || ""] || event.level_required || "--"}
                  </strong>
                </div>
                <div>
                  <span>Capacite</span>
                  <strong>
                    {event.capacity_total ?? "--"} places (restantes {event.capacity_available ?? "--"})
                  </strong>
                </div>
                <div>
                  <span>Prix</span>
                  <strong>{priceLabel}</strong>
                </div>
              </div>
              {locationLine ? (
                <div className={styles.locationBlock}>
                  <h3>Adresse</h3>
                  <p>{locationLine}</p>
                </div>
              ) : null}
            </Reveal>

            <Reveal className={styles.card} delay={180}>
              <h2>Billets</h2>
              {event.is_free ? (
                <p>Participation gratuite.</p>
              ) : event.ticket_types && event.ticket_types.length ? (
                <div className={styles.ticketList}>
                  {event.ticket_types.map((ticket, index) => (
                    <div key={`${ticket.name || "ticket"}-${index}`} className={styles.ticketRow}>
                      <div>
                        <strong>{ticket.name || "Tarif"}</strong>
                        <span>Billet</span>
                      </div>
                      <span className={styles.ticketPrice}>
                        {ticket.price} {event.currency || "TND"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Tarifs a venir.</p>
              )}
            </Reveal>

            <Reveal className={styles.card} delay={240}>
              <h2>Medias</h2>
              {event.media && event.media.length ? (
                <div className={styles.mediaGrid}>
                  {event.media.map((item) => (
                    <div key={item.id} className={styles.mediaCard}>
                      <span className={styles.mediaTag}>{item.media_type}</span>
                      <div
                        className={styles.mediaThumb}
                        style={{ backgroundImage: `url(${item.url})` }}
                        role="img"
                        aria-label={item.title || event.title}
                      />
                      <p>{item.title || "Contenu visuel"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Aucun media pour le moment.</p>
              )}
            </Reveal>
          </div>

          <aside className={styles.sideColumn}>
            <Reveal className={styles.summaryCard}>
              <div className={styles.summaryHeader}>
                <h3>Resume</h3>
                <span
                  className={`${styles.statusBadge} ${
                    event.status === "pending"
                      ? styles.statusPending
                      : event.status === "rejected"
                        ? styles.statusRejected
                        : event.status === "draft"
                          ? styles.statusDraft
                          : styles.statusLive
                  }`}
                >
                  {statusLabels[event.status || "published"] || "Publie"}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span>Date</span>
                <strong>{startDate}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Heure</span>
                <strong>{timeRange || "--"}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Lieu</span>
                <strong>{location?.city || "--"}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Prix</span>
                <strong>{priceLabel}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Organisateur</span>
                <strong>{event.organizer_name || "--"}</strong>
              </div>
              <button className={styles.primaryButton} type="button">
                Modifier l'evenement
              </button>
              <button className={styles.secondaryButton} type="button">
                Retour au tableau
              </button>
            </Reveal>

            {event.cancellation_public && event.cancellation_policy ? (
              <Reveal className={styles.policyCard} delay={120}>
                <h3>Politique d'annulation</h3>
                <p>{event.cancellation_policy}</p>
              </Reveal>
            ) : null}
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
