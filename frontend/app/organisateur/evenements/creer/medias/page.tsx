"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "../../../../components/shared/SiteHeader";
import Footer from "../../../../components/shared/Footer";
import styles from "../steps.module.css";
import { authorizedFetch } from "../../../../lib/auth";
import {
  getEmptyDraft,
  readEventDraft,
  updateEventDraft,
  type MediaDraft,
  type MediaDraftItem,
} from "../../../../lib/eventDraft";

type MediaResponse = {
  id: number;
  media_type: string;
  url: string;
  title?: string;
};

type EventResponse = {
  cover_image_url?: string;
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

export default function CreerEvenementMediasPage() {
  const router = useRouter();
  const [eventId, setEventId] = useState<number | null>(null);
  const [media, setMedia] = useState<MediaDraft>(getEmptyDraft().media);
  const [initialMediaIds, setInitialMediaIds] = useState<number[]>([]);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleMissingEvent = () => {
    updateEventDraft({ eventId: undefined });
    setEventId(null);
    setStatus("error");
    setMessage("Evenement introuvable. Retournez a l'etape 1.");
    router.push("/organisateur/evenements/creer");
  };


  useEffect(() => {
    const draft = readEventDraft();
    setEventId(draft.eventId ?? null);
    setMedia(draft.media);
  }, []);

  useEffect(() => {
    updateEventDraft({ media });
  }, [media]);

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
      if (!response.ok) return;
      const data = (await response.json().catch(() => ({}))) as EventResponse;
      if (ignore) return;
      setMedia((prev) => ({
        ...prev,
        coverImageUrl: prev.coverImageUrl || data.cover_image_url || "",
      }));
    };

    const loadMedia = async () => {
      const response = await authorizedFetch(
        `/api/marketplace/organizer/events/${eventId}/media/`
      );
      if (!response) return;
      if (response.status === 404) {
        handleMissingEvent();
        return;
      }
      if (!response.ok) return;
      const data = (await response.json().catch(() => [])) as MediaResponse[];
      if (ignore || !data.length) return;
      const items = data.map((item) => ({
        id: item.id,
        url: item.url,
        mediaType: item.media_type,
        title: item.title ?? "",
      }));
      setInitialMediaIds(data.map((item) => item.id));
      setMedia((prev) => ({
        ...prev,
        items,
      }));
    };

    loadEvent();
    loadMedia();

    return () => {
      ignore = true;
    };
  }, [eventId]);

  const handleMediaChange = (index: number, field: keyof MediaDraftItem, value: string) => {
    setMedia((prev) => {
      const nextItems = [...prev.items];
      const current = nextItems[index] || { url: "", mediaType: "image", title: "" };
      nextItems[index] = { ...current, [field]: value };
      return { ...prev, items: nextItems };
    });
  };

  const handleAddMedia = () => {
    setMedia((prev) => ({
      ...prev,
      items: [...prev.items, { url: "", mediaType: "image", title: "" }],
    }));
  };

  const handleRemoveMedia = (index: number) => {
    setMedia((prev) => {
      const nextItems = prev.items.filter((_, idx) => idx !== index);
      return { ...prev, items: nextItems.length ? nextItems : prev.items };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    if (!eventId) {
      setStatus("error");
      setMessage("Commencez par les informations de base.");
      return;
    }

    try {
      const response = await authorizedFetch(
        `/api/marketplace/organizer/events/${eventId}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cover_image_url: media.coverImageUrl,
            status: "draft",
          }),
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

      const payload = (await response.json().catch(() => ({}))) as EventResponse;
      if (!response.ok) {
        throw new Error(getErrorMessage(payload, "Mise a jour impossible."));
      }

      const prepared = media.items
        .map((item) => ({
          id: item.id,
          url: item.url.trim(),
          mediaType: item.mediaType,
          title: item.title.trim(),
        }))
        .filter((item) => item.url);

      const nextItems: MediaDraftItem[] = [];
      const currentIds: number[] = [];

      for (const [index, item] of prepared.entries()) {
        const body = {
          media_type: item.mediaType,
          url: item.url,
          title: item.title,
          is_cover: false,
          sort_order: index,
        };

        if (item.id) {
          const updateResponse = await authorizedFetch(
            `/api/marketplace/organizer/events/${eventId}/media/${item.id}/`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            }
          );
          const data = (await updateResponse?.json().catch(() => ({}))) as MediaResponse;
          if (!updateResponse || !updateResponse.ok) {
            throw new Error("Mise a jour des medias impossible.");
          }
          currentIds.push(data.id ?? item.id);
          nextItems.push({
            id: data.id ?? item.id,
            url: data.url ?? item.url,
            mediaType: data.media_type ?? item.mediaType,
            title: data.title ?? item.title,
          });
        } else {
          const createResponse = await authorizedFetch(
            `/api/marketplace/organizer/events/${eventId}/media/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            }
          );
          const data = (await createResponse?.json().catch(() => ({}))) as MediaResponse;
          if (!createResponse || !createResponse.ok) {
            throw new Error("Creation des medias impossible.");
          }
          currentIds.push(data.id);
          nextItems.push({
            id: data.id,
            url: data.url,
            mediaType: data.media_type,
            title: data.title ?? "",
          });
        }
      }

      const removedIds = initialMediaIds.filter((id) => !currentIds.includes(id));
      for (const removedId of removedIds) {
        await authorizedFetch(
          `/api/marketplace/organizer/events/${eventId}/media/${removedId}/`,
          { method: "DELETE" }
        );
      }

      setInitialMediaIds(currentIds);
      setMedia((prev) => ({
        ...prev,
        items: nextItems.length ? nextItems : prev.items,
      }));
      setStatus("success");
      setMessage("Medias enregistres. Passez a la revision.");
      router.push("/organisateur/evenements/creer/revision");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Mise a jour impossible.";
      setStatus("error");
      setMessage(errorMessage);
    }
  };

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <div className={styles.topBar}>
          <div className={styles.titleGroup}>
            <span className={styles.iconBadge} />
            <div>
              <p className={styles.topLabel}>Creer un evenement</p>
              <span className={styles.topMeta}>Medias et visuels</span>
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
          <div className={`${styles.step} ${styles.stepActive}`}>
            <span className={styles.stepCircle}>3</span>
            <span>Medias</span>
          </div>
          <div className={styles.step}>
            <span className={styles.stepCircle}>4</span>
            <span>Revision</span>
          </div>
        </div>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.stepBadge}>ETAPE 3 SUR 4</span>
            <h2>Medias et visuels</h2>
            <p>Personnalisez l'apparence de votre competition avec des images attractives.</p>
          </div>
          <div className={styles.sectionDivider} />

          <form className={styles.sectionBlock} onSubmit={handleSubmit}>
            <div className={styles.sectionBlock}>
              <div className={styles.blockTitle}>Image principale (couverture)</div>
              <input
                className={styles.input}
                type="url"
                placeholder="https://image.com/cover.jpg"
                value={media.coverImageUrl}
                onChange={(event) =>
                  setMedia((prev) => ({ ...prev, coverImageUrl: event.target.value }))
                }
              />
              <span className={styles.helperText}>
                Ajoutez un lien direct vers l'image de couverture.
              </span>
            </div>

            <div className={styles.mediaGrid}>
              <div className={styles.mediaPreview} />
              <div className={styles.mediaInfo}>
                <strong>Pourquoi c'est important ?</strong>
                <span>
                  Une bonne image de couverture augmente le nombre d'inscriptions.
                  Choisissez une photo claire qui represente l'ambiance de l'evenement.
                </span>
              </div>
            </div>

            <div className={styles.sectionBlock}>
              <div className={styles.blockHeader}>
                <div className={styles.blockTitle}>Galerie photo / video</div>
                <button type="button" className={styles.secondaryButton} onClick={handleAddMedia}>
                  Ajouter un media
                </button>
              </div>
              <div className={styles.mediaStack}>
                {media.items.map((item, index) => (
                  <div key={`${item.url}-${index}`} className={styles.mediaFieldRow}>
                    <select
                      className={styles.select}
                      value={item.mediaType}
                      onChange={(event) =>
                        handleMediaChange(index, "mediaType", event.target.value)
                      }
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="document">Document</option>
                    </select>
                    <input
                      className={styles.input}
                      type="url"
                      placeholder="https://media.com/file"
                      value={item.url}
                      onChange={(event) => handleMediaChange(index, "url", event.target.value)}
                    />
                    <input
                      className={styles.input}
                      type="text"
                      placeholder="Titre (optionnel)"
                      value={item.title}
                      onChange={(event) => handleMediaChange(index, "title", event.target.value)}
                    />
                    {media.items.length > 1 ? (
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => handleRemoveMedia(index)}
                        aria-label="Supprimer ce media"
                      >
                        x
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.formActions}>
              <a className={styles.secondaryButton} href="/organisateur/evenements/creer/tarification">
                Etape precedente
              </a>
              <div className={styles.actionGroup}>
                <button type="submit" className={styles.primaryButton}>
                  {status === "loading" ? "Enregistrement..." : "Enregistrer et continuer"}
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
          </form>
        </section>

        <div className={styles.noteCard}>
          <strong>Conseils pour des visuels impactants</strong>
          <span>Utilisez des images lumineuses et de haute resolution.</span>
          <span>Privilegiez les photos d'action pour montrer l'intensite.</span>
          <span>Evitez le texte sur les images pour garder la lisibilite.</span>
        </div>
      </main>
      <Footer />
    </div>
  );
}
