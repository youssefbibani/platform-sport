"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../components/shared/SiteHeader";
import styles from "./page.module.css";
import Footer from "../components/shared/Footer";
import { siteData } from "../data/home";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

type ErrorPayload = Record<string, string[] | string | undefined>;

const getErrorMessage = (data: unknown, fallback: string) => {
  if (!data || typeof data !== "object") return fallback;
  const record = data as ErrorPayload;
  if (typeof record.detail === "string") return record.detail;
  const nonField = record.non_field_errors;
  if (Array.isArray(nonField) && nonField.length) return nonField[0];
  for (const [key, value] of Object.entries(record)) {
    if (Array.isArray(value) && value.length) {
      return `${key}: ${value[0]}`;
    }
  }
  return fallback;
};

export default function Contact() {
  const { contact } = siteData;
  const defaultRole = contact.form.fields.role.options[0]?.value ?? "athlete";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(defaultRole);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  const isLoading = status === "loading";
  const isDisabled = isLoading || !name || !email || !message;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch(`${API_BASE}/api/contact/submit/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, message }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(getErrorMessage(data, contact.form.errorMessage));
      }

      setStatus("success");
      setFeedback(contact.form.successMessage);
      setName("");
      setEmail("");
      setRole(defaultRole);
      setMessage("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : contact.form.errorMessage;
      setStatus("error");
      setFeedback(errorMessage);
    }
  };

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroBackdrop} aria-hidden />
          <div className={styles.heroContent}>
            <h1>{contact.hero.title}</h1>
            <p>{contact.hero.description}</p>
          </div>
        </section>

        <section className={styles.contentGrid}>
          <div className={styles.leftCol}>
            <div>
              <h2>{contact.leftTitle}</h2>
              <p className={styles.sectionLead}>{contact.leftDescription}</p>
            </div>

            <div className={styles.infoStack}>
              {contact.channels.map((channel) => (
                <article key={channel.title} className={styles.infoCard}>
                  <span className={styles.infoIcon} />
                  <div>
                    <h3>{channel.title}</h3>
                    <p>{channel.detail}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.mapCard}>
              <Image
                src={contact.map.image.src}
                alt={contact.map.image.alt}
                fill
                className={styles.mapImage}
              />
              <div className={styles.mapMeta}>
                <span>{contact.map.label}</span>
                <small>{contact.map.note}</small>
              </div>
              <div className={styles.mapPin}>{contact.map.location}</div>
            </div>

            <div className={styles.socialRow}>
              <span>{contact.social.label} :</span>
              <div className={styles.socialIcons}>
                {contact.social.items.map((item) => (
                  <span key={item} className={styles.socialIcon}>
                    {item[0]}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <form className={styles.formCard} onSubmit={handleSubmit}>
            <h3>{contact.form.title}</h3>
            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span>{contact.form.fields.name.label}</span>
                <input
                  className={styles.input}
                  placeholder={contact.form.fields.name.placeholder}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <label className={styles.field}>
                <span>{contact.form.fields.email.label}</span>
                <input
                  className={styles.input}
                  placeholder={contact.form.fields.email.placeholder}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
              <label className={`${styles.field} ${styles.fullWidth}`}>
                <span>{contact.form.fields.role.label}</span>
                <select
                  className={styles.input}
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                >
                  {contact.form.fields.role.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            
               <label className={`${styles.field} ${styles.fullWidth}`}>
                <span>{contact.form.fields.message.label}</span>
                <textarea
                  className={styles.textarea}
                  placeholder={contact.form.fields.message.placeholder}
                  rows={5}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />
              </label>
            </div>
            <button className={styles.submitButton} type="submit" disabled={isDisabled}>
              {isLoading ? contact.form.loadingLabel : contact.form.submitLabel}
            </button>
            {feedback ? (
              <p
                className={`${styles.formStatus} ${
                  status === "error" ? styles.formStatusError : styles.formStatusSuccess
                }`}
                role="status"
              >
                {feedback}
              </p>
            ) : null}
            <p className={styles.formHint}>
              {contact.form.hint.text} <Link href={contact.form.hint.linkHref}>{contact.form.hint.linkLabel}</Link>{" "}
              {contact.form.hint.tail}
            </p>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
