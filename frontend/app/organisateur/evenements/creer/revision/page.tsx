"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "../../../../components/shared/SiteHeader";
import Footer from "../../../../components/shared/Footer";
import styles from "../steps.module.css";
import { authorizedFetch } from "../../../../lib/auth";
import { clearEventDraft, readEventDraft } from "../../../../lib/eventDraft";

type EventDetailResponse = {
  id: number;
  title: string;
  short_description?: string;
  description?: string;
  start_at?: string;
  end_at?: string;
  status?: string;
  level_required?: string;
  event_type?: string;
  capacity_total?: number;
  is_free?: boolean;
  currency?: string;
  cover_image_url?: string;
  location?: {
    venue_name?: string;
    city?: string;
    country?: string;
  };
  sport?: {
    name?: string;
  };
  category?: {
    name?: string;
  };
  ticket_types?: Array<{
    id: number;
    name: string;
    price: string | number;
  }>;
};

type ErrorPayload = Record<string, string[] | string | undefined>;

const getErrorMessage = (data: unknown, fallback: string) => {
  if (!data || typeof data !== "object") return fallback;
  const record = data as ErrorPayload;
  if (typeof record.detail === "string") return record.detail;
  const nonField = record.non_field_errors;
  if (Array.isArray(nonField) && nonField.length) return String(nonField[0]);
  for (const [key, value] of Object.entries(record)) {
    if (Array.isArray(value) && value.length) return `${key}: ${value[0]}`;
  }
  return fallback;
};

const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
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

export default function CreerEvenementRevisionPage() {
  const router = useRouter();
  const [eventId, setEventId] = useState<number | null>(null);
  const [eventData, setEventData] = useState<EventDetailResponse | null>(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleMissingEvent = () => {
    clearEventDraft();
    setEventId(null);
    setStatus("error");
    setMessage("Evenement introuvable. Recommencez la creation.");
    router.push("/organisateur/evenements/creer");
  };

  const [agree, setAgree] = useState(false);

  useEffect(() => {
    const draft = readEventDraft();
    setEventId(draft.eventId ?? null);
  }, []);

  useEffect(() => {
    if (!eventId) return;
    let ignore = false;

    const loadEvent = async () => {
      const response = await authorizedFetch(`/api/marketplace/organizer/events/${eventId}/`);
      if (!response) return;
      if (response.status === 404) {
        handleMissingEvent();
        return;
      }
      const data = (await response.json().catch(() => ({}))) as EventDetailResponse;
      if (!response.ok) {
        setMessage(getErrorMessage(data, "Impossible de charger la revision."));
        return;
      }
      if (!ignore) setEventData(data);
    };

    loadEvent();

    return () => {
      ignore = true;
    };
  }, [eventId]);

  const handlePublish = async () => {
    if (!eventId) {
      setMessage("Commencez par les etapes precedentes.");
      return;
    }

    if (!agree) {
      setMessage("Veuillez accepter les conditions avant de soumettre.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await authorizedFetch(
        `/api/marketplace/organizer/events/${eventId}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "pending" }),
        }
      );

      if (!response) {
        setStatus("error");
        setMessage("Connectez-vous avec un compte organisateur pour continuer.");
        return;
      }

      if (response.status === 404) {
        handleMissingEvent();
        return;
      }

      const payload = (await response.json().catch(() => ({}))) as EventDetailResponse;
      if (!response.ok) {
        throw new Error(getErrorMessage(payload, "Soumission impossible."));
      }

      clearEventDraft();
      setStatus("success");
      setMessage("Evenement soumis pour validation.");
      router.push("/organisateur/evenements");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Soumission impossible.";
      setStatus("error");
      setMessage(errorMessage);
    }
  };

  const startDate = formatDate(eventData?.start_at);
  const startTime = formatTime(eventData?.start_at);
  const endTime = formatTime(eventData?.end_at);
  const ticketLabel = eventData?.is_free
    ? "Gratuit"
    : (eventData?.ticket_types || [])
        .map((ticket) => `${ticket.name} ${ticket.price}${eventData?.currency || ""}`)
        .join(" / ");

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <div className={styles.topBar}>
          <div className={styles.titleGroup}>
            <span className={styles.iconBadge} />
            <div>
              <p className={styles.topLabel}>Creer un evenement</p>
              <span className={styles.topMeta}>Revision et soumission</span>
            </div>
          </div>
          <button type="button" className={styles.secondaryButton}>
            Sauvegarder
          </button>
        </div>

        <div className={styles.stepper}>
          <div className={`${styles.step} ${styles.stepDone}`}>
            <span className={styles.stepCircle}>1</span>
            <span>Infos</span>
          </div>
          <div className={`${styles.step} ${styles.stepDone}`}>
            <span className={styles.stepCircle}>2</span>
            <span>Tarification</span>
          </div>
          <div className={`${styles.step} ${styles.stepDone}`}>
            <span className={styles.stepCircle}>3</span>
            <span>Medias</span>
          </div>
          <div className={`${styles.step} ${styles.stepActive}`}>
            <span className={styles.stepCircle}>4</span>
            <span>Revision</span>
          </div>
        </div>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.stepBadge}>ETAPE 4 SUR 4</span>
            <h2>Revision et soumission</h2>
            <p>Derniere etape. Verifiez les informations avant de valider.</p>
          </div>
          <div className={styles.sectionDivider} />

          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <strong>Recapitulatif de l'evenement</strong>
              <a className={styles.ghostButton} href="/organisateur/evenements/creer">
                Modifier
              </a>
            </div>
            <h3>{eventData?.title || "Votre evenement"}</h3>
            <div className={styles.chipRow}>
              {eventData?.sport?.name ? (
                <span className={styles.chip}>{eventData.sport.name}</span>
              ) : null}
              {eventData?.category?.name ? (
                <span className={styles.chip}>{eventData.category.name}</span>
              ) : null}
              {eventData?.level_required ? (
                <span className={styles.chip}>{eventData.level_required}</span>
              ) : null}
            </div>
            <div className={styles.summaryGrid}>
              <div>
                <strong>Date et heure</strong>
                <p>
                  {startDate} {startTime && endTime ? `, ${startTime} - ${endTime}` : ""}
                </p>
              </div>
              <div>
                <strong>Lieu</strong>
                <p>
                  {eventData?.location?.venue_name} {eventData?.location?.city}
                </p>
              </div>
              <div>
                <strong>Tarification</strong>
                <p>{ticketLabel || "A definir"}</p>
              </div>
              <div>
                <strong>Capacite</strong>
                <p>{eventData?.capacity_total ?? "--"} participants</p>
              </div>
            </div>
          </div>

          <div className={styles.sectionDivider} />

          <div className={styles.summaryCard}>
            <div className={styles.blockHeader}>
              <strong>Apercu joueur</strong>
              <button type="button" className={styles.secondaryButton}>
                Voir le rendu mobile
              </button>
            </div>
            <div className={styles.previewCard}>
              <div className={styles.mobileMock}>
                <strong>Image de couverture</strong>
                <span>{eventData?.title || "Evenement"}</span>
                <span>
                  {startDate} {startTime ? `, ${startTime}` : ""}
                </span>
                <span>{eventData?.location?.venue_name}</span>
                <span>{ticketLabel || "Tarif a definir"}</span>
              </div>
            </div>
          </div>

          <label className={styles.checkboxRow}>
            <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
            <span>
              J'accepte les Conditions Generales de Vente (CGV) et je confirme que les
              informations sont exactes.
            </span>
          </label>

          <div className={styles.formActions}>
            <a className={styles.secondaryButton} href="/organisateur/evenements/creer/medias">
              Retour aux medias
            </a>
            <div className={styles.actionGroup}>
              <button type="button" className={styles.primaryButton} onClick={handlePublish}>
                {status === "loading" ? "Soumission..." : "Soumettre pour validation"}
              </button>
            </div>
          </div>
          {message ? (
            <p
              className={`${styles.formMessage} ${
                status === "error" ? styles.formError : styles.formSuccess
              }`}
              role="status"
            >
              {message}
            </p>
          ) : null}
        </section>

        <div className={styles.noteCard}>
          <strong>Processus de validation</strong>
          <span>
            Votre evenement sera examine par notre equipe sous 24-48h. Vous recevrez une
            notification des que la validation sera terminee.
          </span>
        </div>
      </main>
      <Footer />
    </div>
  );
}
