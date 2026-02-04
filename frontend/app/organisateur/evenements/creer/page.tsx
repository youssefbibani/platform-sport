"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SiteHeader from "../../../components/shared/SiteHeader";
import Footer from "../../../components/shared/Footer";
import styles from "./steps.module.css";
import { API_BASE, authorizedFetch } from "../../../lib/auth";
import {
  getEmptyDraft,
  readEventDraft,
  updateEventDraft,
  writeEventDraft,
  type EventInfo,
} from "../../../lib/eventDraft";

type SportOption = {
  id: number;
  name: string;
  slug: string;
};

type CategoryOption = {
  id: number;
  name: string;
  slug: string;
  sport: number;
};

type EventDetailResponse = {
  id: number;
  title: string;
  short_description?: string;
  description?: string;
  event_type?: string;
  level_required?: string;
  start_at?: string;
  end_at?: string;
  timezone?: string;
  sport?: { id?: number };
  category?: { id?: number };
  location?: {
    venue_name?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    region?: string;
    country?: string;
    postal_code?: string;
  };
};

type ErrorPayload = Record<string, string[] | string | undefined>;

const EVENT_TYPES = [
  { value: "tournament", label: "Tournoi" },
  { value: "stage", label: "Stage" },
  { value: "course", label: "Cours" },
  { value: "match", label: "Match" },
];

const LEVELS = [
  { value: "all", label: "Tous niveaux" },
  { value: "beginner", label: "Debutant" },
  { value: "intermediate", label: "Intermediaire" },
  { value: "advanced", label: "Avance" },
];

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

const combineDateTime = (dateValue: string, timeValue: string) => {
  if (!dateValue || !timeValue) return "";
  const composed = new Date(`${dateValue}T${timeValue}`);
  if (Number.isNaN(composed.getTime())) return "";
  return composed.toISOString();
};

const splitDateTime = (value?: string) => {
  if (!value) return { date: "", time: "" };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { date: "", time: "" };
  const dateValue = date.toLocaleDateString("en-CA");
  const timeValue = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date: dateValue, time: timeValue };
};

export default function CreerEvenementInfosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [eventId, setEventId] = useState<number | null>(null);
  const [formData, setFormData] = useState<EventInfo>(getEmptyDraft().info);
  const [sports, setSports] = useState<SportOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const draft = readEventDraft();
    setEventId(draft.eventId ?? null);
    setFormData(draft.info);
  }, []);

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    setFormData((prev) => (prev.timezone ? prev : { ...prev, timezone }));
  }, []);

  useEffect(() => {
    updateEventDraft({ info: formData });
  }, [formData]);

  useEffect(() => {
    let ignore = false;

    const loadSports = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/marketplace/sports/`);
        const data = (await response.json().catch(() => [])) as SportOption[];
        if (!response.ok) return;
        if (!ignore) setSports(data);
      } catch (error) {
        // Ignore load errors.
      }
    };

    loadSports();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!formData.sportId) {
      setCategories([]);
      return;
    }

    let ignore = false;

    const loadCategories = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/marketplace/categories/?sport=${formData.sportId}`
        );
        const data = (await response.json().catch(() => [])) as CategoryOption[];
        if (!response.ok) return;
        if (!ignore) setCategories(data);
      } catch (error) {
        // Ignore load errors.
      }
    };

    loadCategories();

    return () => {
      ignore = true;
    };
  }, [formData.sportId]);

  useEffect(() => {
    const param = searchParams.get("event");
    if (!param) return;
    const parsedId = Number(param);
    if (!Number.isFinite(parsedId)) return;

    const loadEvent = async () => {
      const response = await authorizedFetch(`/api/marketplace/organizer/events/${parsedId}/`);
      if (!response || !response.ok) return;
      const data = (await response.json().catch(() => ({}))) as EventDetailResponse;
      const start = splitDateTime(data.start_at);
      const end = splitDateTime(data.end_at);

      setEventId(parsedId);
      updateEventDraft({ eventId: parsedId });
      setFormData((prev) => ({
        ...prev,
        title: data.title || prev.title,
        shortDescription: data.short_description || prev.shortDescription,
        description: data.description || prev.description,
        eventType: data.event_type || prev.eventType,
        levelRequired: data.level_required || prev.levelRequired,
        startDate: start.date || prev.startDate,
        startTime: start.time || prev.startTime,
        endDate: end.date || prev.endDate,
        endTime: end.time || prev.endTime,
        timezone: data.timezone || prev.timezone,
        sportId: data.sport?.id ? String(data.sport.id) : prev.sportId,
        categoryId: data.category?.id ? String(data.category.id) : prev.categoryId,
        venueName: data.location?.venue_name || prev.venueName,
        addressLine1: data.location?.address_line1 || prev.addressLine1,
        addressLine2: data.location?.address_line2 || prev.addressLine2,
        city: data.location?.city || prev.city,
        region: data.location?.region || prev.region,
        country: data.location?.country || prev.country,
        postalCode: data.location?.postal_code || prev.postalCode,
      }));
    };

    loadEvent();
  }, [searchParams]);

  const handleChange =
    (field: keyof EventInfo) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        ...(field === "sportId" ? { categoryId: "" } : null),
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    if (
      !formData.title ||
      !formData.sportId ||
      !formData.categoryId ||
      !formData.description ||
      !formData.startDate ||
      !formData.startTime ||
      !formData.endDate ||
      !formData.endTime ||
      !formData.venueName ||
      !formData.addressLine1 ||
      !formData.city ||
      !formData.country
    ) {
      setStatus("error");
      setMessage("Merci de remplir tous les champs obligatoires.");
      return;
    }

    const startAt = combineDateTime(formData.startDate, formData.startTime);
    const endAt = combineDateTime(formData.endDate, formData.endTime);

    if (!startAt || !endAt) {
      setStatus("error");
      setMessage("Dates ou heures invalides. Verifiez les valeurs.");
      return;
    }

    const payload = {
      title: formData.title,
      short_description: formData.shortDescription,
      description: formData.description,
      sport: Number(formData.sportId),
      category: Number(formData.categoryId),
      event_type: formData.eventType,
      level_required: formData.levelRequired,
      start_at: startAt,
      end_at: endAt,
      timezone: formData.timezone || "UTC",
      location: {
        venue_name: formData.venueName,
        address_line1: formData.addressLine1,
        address_line2: formData.addressLine2,
        city: formData.city,
        region: formData.region,
        country: formData.country,
        postal_code: formData.postalCode,
      },
      status: "draft",
    };

    try {
      const target = eventId
        ? `/api/marketplace/organizer/events/${eventId}/`
        : "/api/marketplace/organizer/events/";

      let response = await authorizedFetch(target, {
        method: eventId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response) {
        setStatus("error");
        setMessage("Connectez-vous avec un compte organisateur pour continuer.");
        return;
      }

      if (response.status == 404 && eventId) {
        updateEventDraft({ eventId: undefined });
        setEventId(null);
        response = await authorizedFetch("/api/marketplace/organizer/events/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = (await response.json().catch(() => ({}))) as { id?: number; detail?: string };

      if (!response.ok) {
        throw new Error(getErrorMessage(data, "Creation impossible. Verifiez les informations."));
      }

      const nextId = data.id ?? eventId ?? null;
      const draft = readEventDraft();
      writeEventDraft({
        ...draft,
        eventId: nextId ?? undefined,
        info: formData,
      });
      if (nextId) setEventId(nextId);

      setStatus("success");
      setMessage("Etape 1 enregistree. Vous pouvez passer a la suite.");
      router.push("/organisateur/evenements/creer/tarification");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Creation impossible. Reessayez.";
      setStatus("error");
      setMessage(errorMessage);
    }
  };

  const isLoading = status === "loading";

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <div className={styles.topBar}>
          <div className={styles.titleGroup}>
            <span className={styles.iconBadge} />
            <div>
              <p className={styles.topLabel}>Creer un evenement</p>
              <span className={styles.topMeta}>Centre de controle organisateur</span>
            </div>
          </div>
          <button type="button" className={styles.secondaryButton}>
            Sauvegarder en brouillon
          </button>
        </div>

        <div className={styles.stepper}>
          <div className={`${styles.step} ${styles.stepActive}`}>
            <span className={styles.stepCircle}>1</span>
            <span>Infos</span>
          </div>
          <div className={styles.step}>
            <span className={styles.stepCircle}>2</span>
            <span>Tarification</span>
          </div>
          <div className={styles.step}>
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
            <span className={styles.stepBadge}>ETAPE 1 SUR 4</span>
            <h2>Informations de base et description</h2>
            <p>Definissez l'identite visuelle et les details cles de votre competition.</p>
          </div>
          <div className={styles.sectionDivider} />

          <form className={styles.formGrid} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span>Titre de l'evenement *</span>
              <input
                className={styles.input}
                type="text"
                placeholder="Ex: Grand Tournoi Open 2026"
                value={formData.title}
                onChange={handleChange("title")}
              />
            </label>
            <label className={styles.field}>
              <span>Resume court</span>
              <input
                className={styles.input}
                type="text"
                placeholder="Une phrase pour attirer les joueurs"
                value={formData.shortDescription}
                onChange={handleChange("shortDescription")}
              />
            </label>
            <label className={styles.field}>
              <span>Sport *</span>
              <select
                className={styles.select}
                value={formData.sportId}
                onChange={handleChange("sportId")}
              >
                <option value="">Selectionner un sport</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span>Categorie d'evenement *</span>
              <select
                className={styles.select}
                value={formData.categoryId}
                onChange={handleChange("categoryId")}
                disabled={!formData.sportId}
              >
                <option value="">Selectionner une categorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span>Type d'evenement *</span>
              <select
                className={styles.select}
                value={formData.eventType}
                onChange={handleChange("eventType")}
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span>Niveau requis</span>
              <select
                className={styles.select}
                value={formData.levelRequired}
                onChange={handleChange("levelRequired")}
              >
                {LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span>Date et heure de debut *</span>
              <div className={styles.inlineFields}>
                <input
                  className={styles.input}
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange("startDate")}
                />
                <input
                  className={styles.input}
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange("startTime")}
                />
              </div>
            </label>
            <label className={styles.field}>
              <span>Date et heure de fin *</span>
              <div className={styles.inlineFields}>
                <input
                  className={styles.input}
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange("endDate")}
                />
                <input
                  className={styles.input}
                  type="time"
                  value={formData.endTime}
                  onChange={handleChange("endTime")}
                />
              </div>
            </label>
            <div className={`${styles.field} ${styles.fullSpan}`}>
              <span>Description detaillee *</span>
              <textarea
                className={styles.textarea}
                rows={5}
                placeholder="Decrivez votre evenement: regles, programme, materiel requis, etc."
                value={formData.description}
                onChange={handleChange("description")}
              />
            </div>
            <label className={styles.field}>
              <span>Nom du lieu *</span>
              <input
                className={styles.input}
                type="text"
                placeholder="Centre sportif, stade, salle"
                value={formData.venueName}
                onChange={handleChange("venueName")}
              />
            </label>
            <label className={styles.field}>
              <span>Adresse principale *</span>
              <input
                className={styles.input}
                type="text"
                placeholder="Rue, avenue, numero"
                value={formData.addressLine1}
                onChange={handleChange("addressLine1")}
              />
            </label>
            <label className={styles.field}>
              <span>Complement d'adresse</span>
              <input
                className={styles.input}
                type="text"
                placeholder="Etage, batiment, quartier"
                value={formData.addressLine2}
                onChange={handleChange("addressLine2")}
              />
            </label>
            <label className={styles.field}>
              <span>Ville *</span>
              <input
                className={styles.input}
                type="text"
                placeholder="Tunis"
                value={formData.city}
                onChange={handleChange("city")}
              />
            </label>
            <label className={styles.field}>
              <span>Region</span>
              <input
                className={styles.input}
                type="text"
                placeholder="Tunis"
                value={formData.region}
                onChange={handleChange("region")}
              />
            </label>
            <label className={styles.field}>
              <span>Pays *</span>
              <input
                className={styles.input}
                type="text"
                placeholder="Tunisie"
                value={formData.country}
                onChange={handleChange("country")}
              />
            </label>
            <label className={styles.field}>
              <span>Code postal</span>
              <input
                className={styles.input}
                type="text"
                placeholder="1000"
                value={formData.postalCode}
                onChange={handleChange("postalCode")}
              />
            </label>

            <div className={`${styles.fullSpan} ${styles.formActions}`}>
              <button type="submit" className={styles.primaryButton} disabled={isLoading}>
                {isLoading ? "Enregistrement..." : "Enregistrer et continuer"}
              </button>
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
            </div>
          </form>
        </section>

        <div className={styles.tipCard}>
          <strong>Conseils pour une description efficace</strong>
          <span>
            Une bonne description attire plus de participants. Mentionnez les regles,
            le materiel requis et le niveau d'intensite.
          </span>
        </div>
      </main>
      <Footer />
    </div>
  );
}
