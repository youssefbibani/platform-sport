"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "../components/shared/SiteHeader";
import Footer from "../components/shared/Footer";
import styles from "./page.module.css";
import { authorizedFetch, readAuthCache } from "../lib/auth";

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

type ParticipationEvent = {
  id: number;
  title?: string;
  slug?: string;
  start_at?: string;
  city?: string;
  sport_name?: string;
  status?: string;
};

type Participation = {
  id: number;
  status?: string;
  event: ParticipationEvent;
};

type LoadingMap = Record<number, boolean>;

type AlertState = {
  tone: "success" | "error";
  message: string;
} | null;

export default function MesEvenementsPage() {
  const [items, setItems] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertState>(null);
  const [rowLoading, setRowLoading] = useState<LoadingMap>({});

  const isAuthed = Boolean(readAuthCache()?.access);

  useEffect(() => {
    const load = async () => {
      if (!isAuthed) {
        setLoading(false);
        return;
      }
      const response = await authorizedFetch("/api/marketplace/me/participations/");
      if (!response) {
        setLoading(false);
        return;
      }
      const data = (await response.json().catch(() => [])) as Participation[];
      if (response.ok) {
        setItems(Array.isArray(data) ? data : []);
      }
      setLoading(false);
    };

    load();
  }, [isAuthed]);

  const handleLeave = async (participation: Participation) => {
    const slug = participation.event?.slug;
    if (!slug) return;
    setRowLoading((prev) => ({ ...prev, [participation.id]: true }));
    setAlert(null);

    const response = await authorizedFetch(`/api/marketplace/events/${slug}/join/`, {
      method: "DELETE",
    });

    if (!response || !response.ok) {
      setAlert({ tone: "error", message: "Impossible de se retirer." });
      setRowLoading((prev) => ({ ...prev, [participation.id]: false }));
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== participation.id));
    setAlert({ tone: "success", message: "Vous avez ete retire de l'evenement." });
    setRowLoading((prev) => ({ ...prev, [participation.id]: false }));
  };

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>Mon compte</p>
            <h1>Mes evenements</h1>
            <p className={styles.subhead}>
              Retrouvez vos inscriptions en cours et gerez vos participations.
            </p>
          </div>
          <Link className={styles.primaryButton} href="/tournois">
            Explorer les tournois
          </Link>
        </header>

        {!isAuthed ? (
          <section className={styles.emptyState}>
            <h2>Connectez-vous pour voir vos evenements</h2>
            <p>Accedez a vos participations et suivez vos prochains matchs.</p>
            <Link className={styles.primaryButton} href="/login">
              Se connecter
            </Link>
          </section>
        ) : loading ? (
          <section className={styles.card}>Chargement...</section>
        ) : items.length ? (
          <section className={styles.list}>
            {alert ? (
              <div
                className={`${styles.alert} ${
                  alert.tone === "error" ? styles.alertError : styles.alertSuccess
                }`}
              >
                {alert.message}
              </div>
            ) : null}
            {items.map((item) => (
              <article key={item.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <p className={styles.eventDate}>{formatDate(item.event?.start_at)}</p>
                    <h2>{item.event?.title || "Evenement"}</h2>
                    <p className={styles.eventMeta}>
                      {item.event?.city || "--"} � {item.event?.sport_name || "Sport"}
                    </p>
                  </div>
                  <span className={styles.statusBadge}>{item.event?.status || "Publie"}</span>
                </div>
                <div className={styles.actions}>
                  {item.event?.slug ? (
                    <Link className={styles.secondaryButton} href={`/tournois/${item.event.slug}`}>
                      Voir details
                    </Link>
                  ) : null}
                  <button
                    className={styles.dangerButton}
                    type="button"
                    onClick={() => handleLeave(item)}
                    disabled={Boolean(rowLoading[item.id])}
                  >
                    {rowLoading[item.id] ? "Suppression..." : "Se retirer"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className={styles.emptyState}>
            <h2>Aucun evenement</h2>
            <p>Vous n'avez pas encore participe a un evenement.</p>
            <Link className={styles.primaryButton} href="/tournois">
              Trouver un evenement
            </Link>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
