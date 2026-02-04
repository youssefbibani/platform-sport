"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../components/shared/SiteHeader";
import Footer from "../../components/shared/Footer";
import styles from "./page.module.css";
import { authorizedFetch } from "../../lib/auth";

type OrganizerEvent = {
  id: number;
  title: string;
  start_at?: string;
  city?: string;
  country?: string;
  capacity_total?: number;
  capacity_reserved?: number;
  status?: string;
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
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const STATUS_LABELS: Record<string, string> = {
  published: "Publie",
  pending: "En attente",
  rejected: "Rejete",
  draft: "Brouillon",
  cancelled: "Annule",
  completed: "Termine",
};

const statusClass = (status?: string) => {
  if (status === "published") return styles.statusLive;
  if (status === "pending") return styles.statusPending;
  if (status === "rejected") return styles.statusRejected;
  if (status === "draft") return styles.statusDraft;
  if (status === "cancelled") return styles.statusPending;
  return styles.statusDone;
};

export default function EvenementsOrganisateurPage() {
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadEvents = async () => {
      setStatus("loading");
      const response = await authorizedFetch("/api/marketplace/organizer/events/");
      if (!response) {
        setStatus("error");
        setMessage("Connectez-vous avec un compte organisateur.");
        return;
      }
      const data = (await response.json().catch(() => [])) as OrganizerEvent[];
      if (!response.ok) {
        setStatus("error");
        setMessage(getErrorMessage(data, "Impossible de charger les evenements."));
        return;
      }
      if (!ignore) {
        setEvents(Array.isArray(data) ? data : []);
        setStatus("success");
        setMessage("");
      }
    };

    loadEvents();

    return () => {
      ignore = true;
    };
  }, []);

  const stats = useMemo(() => {
    const published = events.filter((event) => event.status === "published").length;
    const drafts = events.filter((event) => event.status === "draft").length;
    const reserved = events.reduce(
      (total, event) => total + (event.capacity_reserved || 0),
      0
    );
    const capacity = events.reduce(
      (total, event) => total + (event.capacity_total || 0),
      0
    );

    return [
      { label: "Evenements publies", value: String(published), note: "En ligne" },
      { label: "Brouillons", value: String(drafts), note: "A finaliser" },
      { label: "Places reservees", value: String(reserved), note: "Participants" },
      { label: "Capacite totale", value: String(capacity), note: "Places" },
    ];
  }, [events]);

  const handleDelete = async (eventId: number) => {
    if (!window.confirm("Supprimer cet evenement ?")) return;

    setDeletingId(eventId);
    setStatus("loading");
    setMessage("");

    const response = await authorizedFetch(
      `/api/marketplace/organizer/events/${eventId}/`,
      { method: "DELETE" }
    );

    if (!response) {
      setStatus("error");
      setMessage("Connectez-vous avec un compte organisateur.");
      setDeletingId(null);
      return;
    }

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as ErrorPayload;
      setStatus("error");
      setMessage(getErrorMessage(data, "Suppression impossible."));
      setDeletingId(null);
      return;
    }

    setEvents((prev) => prev.filter((event) => event.id !== eventId));
    setStatus("success");
    setMessage("Evenement supprime.");
    setDeletingId(null);
  };

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.kicker}>Centre de controle</p>
            <h1>Creation et gestion des evenements</h1>
            <p>
              Pilotez vos tournois, suivez les inscriptions et gardez une vue claire
              sur les performances de vos evenements.
            </p>
          </div>
          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href="/organisateur/evenements/creer">
              Creer un evenement
            </Link>
            <button type="button" className={styles.secondaryButton}>
              Exporter les donnees
            </button>
          </div>
        </section>

        <section className={styles.statsRow}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles.statIcon} />
              <div>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statValue}>{stat.value}</p>
                <span className={styles.statNote}>{stat.note}</span>
              </div>
            </div>
          ))}
        </section>

        <section className={styles.grid}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <div>
                <h2>Nouveau evenement</h2>
                <p>Suivez le parcours en 4 etapes pour publier votre evenement.</p>
              </div>
              <span className={styles.formTag}>Assistant</span>
            </div>
            <p>
              Utilisez l'assistant pour renseigner les informations, la tarification,
              les medias puis valider la publication. Vous pouvez enregistrer a chaque
              etape et revenir plus tard.
            </p>
            <div className={styles.formActions}>
              <Link className={styles.primaryButton} href="/organisateur/evenements/creer">
                Lancer l'assistant
              </Link>
              <Link className={styles.ghostButton} href="/organisateur/evenements/creer">
                Reprendre un brouillon
              </Link>
            </div>
            {message ? (
              <p
                className={`${styles.formStatus} ${
                  status === "error" ? styles.formError : styles.formSuccess
                }`}
              >
                {message}
              </p>
            ) : null}
          </div>

          <aside className={styles.sideColumn}>
            <div className={styles.sideCard}>
              <h3>Checklist de publication</h3>
              <ul className={styles.checklist}>
                <li>
                  <span className={styles.checkDot} />
                  Informations generales completes
                </li>
                <li>
                  <span className={styles.checkDot} />
                  Conditions de participation definies
                </li>
                <li>
                  <span className={styles.checkDot} />
                  Billetterie et prix verifies
                </li>
                <li>
                  <span className={styles.checkDot} />
                  Visuels charges
                </li>
              </ul>
              <button type="button" className={styles.secondaryButton}>
                Charger les visuels
              </button>
            </div>

            <div className={styles.sideCard}>
              <h3>Prochaines actions</h3>
              <div className={styles.actionRow}>
                <div>
                  <p className={styles.actionTitle}>Gerer les participants</p>
                  <span className={styles.actionNote}>Liste et statut des inscrits</span>
                </div>
                <button type="button" className={styles.textButton}>
                  Ouvrir
                </button>
              </div>
              <div className={styles.actionRow}>
                <div>
                  <p className={styles.actionTitle}>Suivi financier</p>
                  <span className={styles.actionNote}>Revenus et commissions</span>
                </div>
                <button type="button" className={styles.textButton}>
                  Voir
                </button>
              </div>
              <div className={styles.actionRow}>
                <div>
                  <p className={styles.actionTitle}>Communication</p>
                  <span className={styles.actionNote}>Messages aux equipes</span>
                </div>
                <button type="button" className={styles.textButton}>
                  Envoyer
                </button>
              </div>
            </div>
          </aside>
        </section>

        <section className={styles.listSection}>
          <div className={styles.listHeader}>
            <div>
              <h2>Evenements recents</h2>
              <p>Suivez vos operations en cours et terminees.</p>
            </div>
            <button type="button" className={styles.secondaryButton}>
              Voir tous les evenements
            </button>
          </div>

          <div className={styles.eventTable}>
            <div className={styles.eventHeader}>
              <span>Evenement</span>
              <span>Date</span>
              <span>Lieu</span>
              <span>Inscrits</span>
              <span>Capacite</span>
              <span>Statut</span>
              <span>Actions</span>
            </div>
            {events.length === 0 ? (
              <div className={styles.eventRow}>
                <span>Aucun evenement pour le moment.</span>
              </div>
            ) : (
              events.map((eventItem) => (
                <div key={eventItem.id} className={styles.eventRow}>
                  <span className={styles.eventTitle}>{eventItem.title}</span>
                  <span>{formatDate(eventItem.start_at)}</span>
                  <span>{eventItem.city || "--"}</span>
                  <span>{eventItem.capacity_reserved ?? 0}</span>
                  <span>{eventItem.capacity_total ?? 0}</span>
                  <span className={`${styles.status} ${statusClass(eventItem.status)}`}>
                    {STATUS_LABELS[eventItem.status ?? "draft"] ?? "--"}
                  </span>
                  <div className={styles.eventActions}>
                    <Link
                      className={styles.textButton}
                      href={`/organisateur/evenements/${eventItem.id}`}
                    >
                      Details
                    </Link>
                    <a
                      className={styles.textButton}
                      href={`/organisateur/evenements/creer?event=${eventItem.id}`}
                    >
                      Editer
                    </a>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleDelete(eventItem.id)}
                      disabled={deletingId === eventItem.id}
                      aria-label="Supprimer"
                      title="Supprimer"
                    >
                      <span className={styles.trashIcon} aria-hidden />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
