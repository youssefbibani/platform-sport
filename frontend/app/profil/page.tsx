"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import SiteHeader from "../components/shared/SiteHeader";
import Footer from "../components/shared/Footer";
import styles from "./page.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";
const AUTH_STORAGE_KEY = "auth_user";
const DEFAULT_NAME = "Utilisateur";

type ProfileResponse = {
  email?: string;
  role?: string;
  full_name?: string;
  handle?: string;
  bio?: string;
  phone?: string;
  website?: string;
  address_line?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  organization_name?: string;
  organization_website?: string;
  organization_type?: string;
  organization_description?: string;
};

type FormState = {
  fullName: string;
  handle: string;
  bio: string;
  email: string;
  phone: string;
  website: string;
  addressLine: string;
  postalCode: string;
  city: string;
  country: string;
  organizationName: string;
  organizationWebsite: string;
  organizationType: string;
  organizationDescription: string;
};

type ErrorPayload = Record<string, string[] | string | undefined>;

type AuthCache = {
  email?: string;
  role?: string;
  access?: string;
  refresh?: string;
  display_name?: string;
  handle?: string;
};

const baseProfile = {
  name: DEFAULT_NAME,
  email: "",
  role: "athlete",
};

const baseForm: FormState = {
  fullName: "",
  handle: "",
  bio: "",
  email: "",
  phone: "",
  website: "",
  addressLine: "",
  postalCode: "",
  city: "",
  country: "Tunisie",
  organizationName: "",
  organizationWebsite: "",
  organizationType: "",
  organizationDescription: "",
};


const getErrorMessage = (data: unknown, fallback: string) => {
  if (!data || typeof data !== "object") return fallback;
  const record = data as ErrorPayload;
  if (typeof record.detail === "string") return record.detail;
  const nonField = record.non_field_errors;
  if (Array.isArray(nonField) && nonField.length) return String(nonField[0]);
  for (const [key, value] of Object.entries(record)) {
    if (Array.isArray(value) && value.length) {
      return `${key}: ${value[0]}`;
    }
  }
  return fallback;
};

function readAuthCache(): AuthCache | null {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthCache;
  } catch (error) {
    return null;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const cached = readAuthCache();
  if (!cached?.refresh) return null;

  try {
    const response = await fetch(`${API_BASE}/api/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: cached.refresh }),
    });

    const data = (await response.json().catch(() => ({}))) as { access?: string };
    if (!response.ok) return null;

    const nextAccess = typeof data.access === "string" ? data.access : "";
    if (!nextAccess) return null;

    const nextCache: AuthCache = {
      ...cached,
      access: nextAccess,
    };
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextCache));
    window.dispatchEvent(new Event("auth-change"));
    return nextAccess;
  } catch (error) {
    return null;
  }
}

async function authorizedFetch(path: string, options: RequestInit = {}) {
  const cached = readAuthCache();
  const access = cached?.access;
  if (!access) return null;

  const baseHeaders = options.headers ? { ...options.headers } : {};
  let response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...baseHeaders,
      Authorization: `Bearer ${access}`,
    },
  });

  if (response.status !== 401) return response;

  const refreshed = await refreshAccessToken();
  if (!refreshed) return response;

  response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...baseHeaders,
      Authorization: `Bearer ${refreshed}`,
    },
  });

  return response;
}

function buildFormState(data: ProfileResponse | null, fallbackEmail: string): FormState {
  const email = data?.email ?? fallbackEmail;
  const fullName = (data?.full_name || "").trim();

  return {
    fullName,
    handle: data?.handle ?? "",
    bio: data?.bio ?? "",
    email,
    phone: data?.phone ?? "",
    website: data?.website ?? "",
    addressLine: data?.address_line ?? "",
    postalCode: data?.postal_code ?? "",
    city: data?.city ?? "",
    country: data?.country ?? "Tunisie",
    organizationName: data?.organization_name ?? "",
    organizationWebsite: data?.organization_website ?? "",
    organizationType: data?.organization_type ?? "",
    organizationDescription: data?.organization_description ?? "",
  };
}

function updateAuthCache(update: { email?: string; role?: string; fullName?: string; handle?: string }) {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    const parsed = (raw ? JSON.parse(raw) : {}) as AuthCache;
    const nextFullName = update.fullName?.trim();
    const nextHandle = update.handle?.trim();

    const next: AuthCache = {
      ...parsed,
      email: update.email ?? parsed.email,
      role: update.role ?? parsed.role,
      display_name: nextFullName ? nextFullName : parsed.display_name,
      handle: nextHandle ? nextHandle : parsed.handle,
    };

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("auth-change"));
  } catch (error) {
    // Ignore cache errors.
  }
}

export default function ProfilPage() {
  const [profile, setProfile] = useState(baseProfile);
  const [formData, setFormData] = useState<FormState>(baseForm);
  const [initialData, setInitialData] = useState<FormState>(baseForm);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");

  const isOrganizer = profile.role === "organizer";
  const isSaving = status === "loading";
  const displayName = formData.fullName || profile.name || DEFAULT_NAME;
  const displayInitial = displayName.charAt(0) || "U";

  useEffect(() => {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    let fallbackEmail = "";
    let fallbackRole = "athlete";
    let fallbackName = DEFAULT_NAME;
    let fallbackHandle = "";

    try {
      if (raw) {
        const parsed = JSON.parse(raw) as {
          email?: string;
          role?: string;
          display_name?: string;
          handle?: string;
        };
        fallbackEmail = parsed.email ?? "";
        fallbackRole = parsed.role ?? "athlete";
        fallbackName = parsed.display_name?.trim() || DEFAULT_NAME;
        fallbackHandle = parsed.handle?.trim() || "";
      }
    } catch (error) {
      fallbackEmail = "";
      fallbackRole = "athlete";
      fallbackName = DEFAULT_NAME;
      fallbackHandle = "";
    }

    setProfile({
      name: fallbackName,
      email: fallbackEmail,
      role: fallbackRole,
    });


    const loadProfile = async () => {
      try {
        const response = await authorizedFetch("/api/auth/profile/");
        if (!response) return;

        const data = (await response.json().catch(() => ({}))) as ProfileResponse;

        if (!response.ok) {
          throw new Error(getErrorMessage(data, "Impossible de charger le profil."));
        }

        const nextForm = buildFormState(data, fallbackEmail);
        setFormData(nextForm);
        setInitialData(nextForm);
        setProfile({
          name: nextForm.fullName || fallbackName,
          email: nextForm.email,
          role: data.role ?? fallbackRole,
        });
        updateAuthCache({
          email: nextForm.email,
          role: data.role ?? fallbackRole,
          fullName: nextForm.fullName,
          handle: nextForm.handle || fallbackHandle,
        });
        setLoadError("");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Impossible de charger le profil.";
        setLoadError(errorMessage);
      }
    };

    loadProfile();
  }, []);

  const handleChange =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleReset = () => {
    setFormData(initialData);
    setStatus("idle");
    setMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const payload: Record<string, string> = {
      full_name: formData.fullName,
      handle: formData.handle,
      bio: formData.bio,
      phone: formData.phone,
      website: formData.website,
      address_line: formData.addressLine,
      postal_code: formData.postalCode,
      city: formData.city,
      country: formData.country,
    };

    if (isOrganizer) {
      payload.organization_name = formData.organizationName;
      payload.organization_website = formData.organizationWebsite;
      payload.organization_type = formData.organizationType;
      payload.organization_description = formData.organizationDescription;
    }

    try {
      const response = await authorizedFetch("/api/auth/profile/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response) {
        setStatus("error");
        setMessage("Connectez-vous pour mettre a jour votre profil.");
        return;
      }

      const data = (await response.json().catch(() => ({}))) as ProfileResponse;

      if (!response.ok) {
        throw new Error(getErrorMessage(data, "Mise a jour echouee."));
      }

      const nextForm = buildFormState(data, formData.email);
      setFormData(nextForm);
      setInitialData(nextForm);
      setProfile({
        name: nextForm.fullName || profile.name,
        email: nextForm.email,
        role: data.role ?? profile.role,
      });
      updateAuthCache({
        email: nextForm.email,
        role: data.role ?? profile.role,
        fullName: nextForm.fullName,
        handle: nextForm.handle,
      });
      setStatus("success");
      setMessage("Profil mis a jour.");
      setLoadError("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Mise a jour echouee.";
      setStatus("error");
      setMessage(errorMessage);
    }
  };

  const feedback = loadError || message;
  const feedbackTone = loadError || status === "error" ? "error" : "success";

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <section className={styles.intro}>
          <div>
            <p className={styles.kicker}>Mon compte</p>
            <h1>Informations personnelles</h1>
            <p className={styles.subhead}>Gerez vos informations de compte.</p>
          </div>
          <div className={styles.profileBadge}>
            <div className={styles.avatar}>{displayInitial}</div>
            <div>
              <p className={styles.profileName}>{displayName}</p>
              <span className={styles.profileRole}>
                {profile.role === "organizer" ? "Organisateur" : "Athlete"}
              </span>
            </div>
          </div>
        </section>


        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.contentGrid}>
            <section className={styles.card}>
              <h2>Profil</h2>
              <div className={styles.photoRow}>
                <div className={styles.photoCircle}>{displayInitial}</div>
                <div>
                  <button type="button" className={styles.secondaryButton}>
                    Changer la photo
                  </button>
                  <p className={styles.helperText}>JPG, PNG ou GIF. Max 2MB</p>
                </div>
              </div>
              <label className={styles.field}>
                <span>Nom complet</span>
                <input
                  className={styles.input}
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange("fullName")}
                />
              </label>
              <label className={styles.field}>
                <span>Nom d'utilisateur</span>
                <input
                  className={styles.input}
                  type="text"
                  value={formData.handle}
                  onChange={handleChange("handle")}
                  placeholder="@user"
                />
              </label>
              <label className={styles.field}>
                <span>Bio</span>
                <textarea
                  className={styles.textarea}
                  rows={4}
                  placeholder="Parlez-nous de vous..."
                  value={formData.bio}
                  onChange={handleChange("bio")}
                />
              </label>
            </section>

            {isOrganizer && (
              <section className={styles.card}>
                <h2>Organisation</h2>
                <label className={styles.field}>
                  <span>Nom de l'organisation</span>
                  <input
                    className={styles.input}
                    type="text"
                    value={formData.organizationName}
                    onChange={handleChange("organizationName")}
                  />
                </label>
                <label className={styles.field}>
                  <span>Site web</span>
                  <input
                    className={styles.input}
                    type="url"
                    value={formData.organizationWebsite}
                    onChange={handleChange("organizationWebsite")}
                    placeholder="https://organisation.com"
                  />
                </label>
                <label className={styles.field}>
                  <span>Type d'organisation</span>
                  <input
                    className={styles.input}
                    type="text"
                    value={formData.organizationType}
                    onChange={handleChange("organizationType")}
                    placeholder="Club, Ligue, Academie"
                  />
                </label>
                <label className={styles.field}>
                  <span>Description publique</span>
                  <textarea
                    className={styles.textarea}
                    rows={4}
                    placeholder="Presentez votre organisation en quelques lignes."
                    value={formData.organizationDescription}
                    onChange={handleChange("organizationDescription")}
                  />
                </label>
              </section>
            )}

            <section className={styles.card}>
              <h2>Contact</h2>
              <label className={styles.field}>
                <span>Email</span>
                <input className={styles.input} type="email" value={formData.email} readOnly />
              </label>
              <label className={styles.field}>
                <span>Telephone</span>
                <input
                  className={styles.input}
                  type="tel"
                  placeholder="+216 00 000 000"
                  value={formData.phone}
                  onChange={handleChange("phone")}
                />
              </label>
              <label className={styles.field}>
                <span>Site web</span>
                <input
                  className={styles.input}
                  type="url"
                  placeholder="https://votresite.com"
                  value={formData.website}
                  onChange={handleChange("website")}
                />
              </label>
            </section>

            <section className={styles.card}>
              <h2>Securite</h2>
              <label className={styles.field}>
                <span>Mot de passe actuel</span>
                <input className={styles.input} type="password" placeholder="********" />
              </label>
              <label className={styles.field}>
                <span>Nouveau mot de passe</span>
                <input className={styles.input} type="password" placeholder="********" />
              </label>
              <label className={styles.field}>
                <span>Confirmer le mot de passe</span>
                <input className={styles.input} type="password" placeholder="********" />
              </label>
              <button type="button" className={styles.primaryButton}>
                Mettre a jour le mot de passe
              </button>
            </section>

            <section className={styles.card}>
              <h2>Adresse</h2>
              <label className={styles.field}>
                <span>Rue</span>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="123 Rue de la Republique"
                  value={formData.addressLine}
                  onChange={handleChange("addressLine")}
                />
              </label>
              <div className={styles.inlineFields}>
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
                <label className={styles.field}>
                  <span>Ville</span>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Tunis"
                    value={formData.city}
                    onChange={handleChange("city")}
                  />
                </label>
              </div>
              <label className={styles.field}>
                <span>Pays</span>
                <select
                  className={styles.input}
                  value={formData.country}
                  onChange={handleChange("country")}
                >
                  <option>Tunisie</option>
                  <option>France</option>
                  <option>Maroc</option>
                </select>
              </label>
            </section>
          </div>

          <div className={styles.actions}>
            {feedback ? (
              <p
                className={`${styles.formStatus} ${
                  feedbackTone === "error" ? styles.formStatusError : styles.formStatusSuccess
                }`}
                role="status"
              >
                {feedback}
              </p>
            ) : null}
            <button type="submit" className={styles.primaryButton} disabled={isSaving}>
              {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
            <button type="button" className={styles.ghostButton} onClick={handleReset}>
              Annuler
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
