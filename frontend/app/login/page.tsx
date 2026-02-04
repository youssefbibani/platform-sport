"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "../components/shared/SiteHeader";
import Footer from "../components/shared/Footer";
import styles from "./page.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";
const AUTH_STORAGE_KEY = "auth_user";

type ErrorPayload = Record<string, string[] | string | undefined>;

const ERROR_TRANSLATIONS: Record<string, string> = {
  "Invalid credentials": "Identifiants invalides.",
  "Role mismatch": "Role incorrect pour ce compte.",
  "Account already exists": "Compte deja existant.",
  "Passwords do not match": "Les mots de passe ne correspondent pas.",
  "This field is required.": "Ce champ est requis.",
  "Enter a valid email address.": "Adresse e-mail invalide.",
  "Ensure this field has at least 8 characters.":
    "Le mot de passe doit contenir au moins 8 caracteres.",
};

const translate = (value: string) => ERROR_TRANSLATIONS[value] ?? value;

const getErrorMessage = (data: unknown, fallback: string) => {
  if (!data || typeof data !== "object") return fallback;
  const record = data as ErrorPayload;
  if (typeof record.detail === "string") return translate(record.detail);
  const nonField = record.non_field_errors;
  if (Array.isArray(nonField) && nonField.length) {
    return translate(String(nonField[0]));
  }
  for (const [key, value] of Object.entries(record)) {
    if (Array.isArray(value) && value.length) {
      return `${key}: ${translate(String(value[0]))}`;
    }
  }
  return fallback;
};

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState("athlete");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const isLoading = status === "loading";
  const isDisabled = isLoading || !email || !password;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(getErrorMessage(data, "Connexion echouee. Reessayez."));
      }

      const payload = {
        email: data.email ?? email,
        role: data.role ?? role,
        access: data.access ?? "",
        refresh: data.refresh ?? "",
        display_name: (data.full_name ?? "").trim(),
        handle: (data.handle ?? "").trim(),
      };
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
      window.dispatchEvent(new Event("auth-change"));

      setStatus("success");
      setMessage("Connexion reussie. Redirection en cours.");
      router.replace("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inattendue.";
      setStatus("error");
      setMessage(errorMessage);
    }
  };

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <section className={styles.heroPanel}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>Plateforme de competition live</span>
            <h1>
              Jouez.
              <br />
              Classez.
              <br />
              <span>Gagnez.</span>
            </h1>
            <p>
              Rejoignez la plateforme sportive mobile qui relie les athletes et
              organisateurs partout dans le monde. L'arene est digitale, la
              gloire est reelle.
            </p>
            <div className={styles.heroChips}>
              <span className={styles.chip}>Classements globaux</span>
              <span className={styles.chip}>Recompenses cash</span>
              <span className={styles.chip}>Gestion d'equipe</span>
            </div>
          </div>
        </section>

        <section className={styles.formPanel}>
          <div className={styles.formCard}>
            <h2>Bon retour</h2>
            <p className={styles.formLead}>
              Connectez-vous pour continuer votre parcours.
            </p>
            <div className={styles.roleToggle}>
              <button
                type="button"
                className={`${styles.roleButton} ${
                  role === "athlete" ? styles.active : ""
                }`}
                onClick={() => setRole("athlete")}
                aria-pressed={role === "athlete"}
              >
                Je suis un athlete
              </button>
              <button
                type="button"
                className={`${styles.roleButton} ${
                  role === "organizer" ? styles.active : ""
                }`}
                onClick={() => setRole("organizer")}
                aria-pressed={role === "organizer"}
              >
                Je suis un organisateur
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.label}>
                <span>Adresse e-mail</span>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
              <label className={styles.label}>
                <span>Mot de passe</span>
                <input
                  className={styles.input}
                  type="password"
                  placeholder="********"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              <button className={styles.submit} type="submit" disabled={isDisabled}>
                {isLoading ? "Connexion..." : "Se connecter"}
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
              <div className={styles.divider}>
                <span>Ou continuer avec</span>
              </div>
              <div className={styles.socialRow}>
                <button type="button" className={styles.socialButton}>
                  Google
                </button>
                <button type="button" className={styles.socialButton}>
                  Apple
                </button>
              </div>
            </form>
            <p className={styles.formFooter}>
              Nouveau ici ? <a href="/signup">Creer un compte</a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
