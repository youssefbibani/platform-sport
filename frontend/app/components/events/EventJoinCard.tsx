"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../tournois/[slug]/page.module.css";
import { authorizedFetch, readAuthCache } from "../../lib/auth";

type JoinStatus = {
  joined: boolean;
  capacity_available?: number;
};

type Props = {
  slug: string;
  capacityAvailable?: number;
  isFree?: boolean;
};

export default function EventJoinCard({ slug, capacityAvailable = 0, isFree = true }: Props) {
  const [joined, setJoined] = useState(false);
  const [capacity, setCapacity] = useState(capacityAvailable);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const authed = Boolean(readAuthCache()?.access);
  const isLoading = status === "loading";
  const isFull = capacity <= 0;

  useEffect(() => {
    const loadStatus = async () => {
      if (!authed) return;
      const response = await authorizedFetch(`/api/marketplace/events/${slug}/join/`);
      if (!response || !response.ok) return;
      const data = (await response.json().catch(() => null)) as JoinStatus | null;
      if (data) {
        setJoined(Boolean(data.joined));
        if (typeof data.capacity_available === "number") {
          setCapacity(data.capacity_available);
        }
      }
    };

    loadStatus();
  }, [authed, slug]);

  const handleJoin = async () => {
    if (!authed) return;
    setStatus("loading");
    setMessage("");

    const response = await authorizedFetch(`/api/marketplace/events/${slug}/join/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response) {
      setStatus("error");
      setMessage("Connectez-vous pour participer.");
      return;
    }

    const data = (await response.json().catch(() => ({}))) as { detail?: string };
    if (!response.ok) {
      setStatus("error");
      setMessage(data.detail || "Inscription impossible.");
      return;
    }

    setStatus("success");
    setJoined(true);
    setCapacity((prev) => Math.max(prev - 1, 0));
    setMessage("Participation confirmee.");
  };

  if (!isFree) {
    return <div className={styles.joinNotice}>Paiement requis. Disponible bientot.</div>;
  }

  if (!authed) {
    return (
      <Link className={styles.primaryButton} href="/signup">
        Se connecter pour participer
      </Link>
    );
  }

  return (
    <div className={styles.joinBox}>
      <button
        className={styles.primaryButton}
        type="button"
        onClick={handleJoin}
        disabled={isLoading || joined || isFull}
      >
        {joined ? "Deja inscrit" : isFull ? "Complet" : "Participer"}
      </button>
      {message ? (
        <p className={status === "error" ? styles.joinError : styles.joinSuccess}>{message}</p>
      ) : null}
    </div>
  );
}
