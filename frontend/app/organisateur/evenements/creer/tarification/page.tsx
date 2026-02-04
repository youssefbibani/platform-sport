"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "../../../../components/shared/SiteHeader";
import Footer from "../../../../components/shared/Footer";
import styles from "../steps.module.css";
import { authorizedFetch } from "../../../../lib/auth";
import {
  getEmptyDraft,
  readEventDraft,
  updateEventDraft,
  type PricingDraft,
  type TicketDraft,
} from "../../../../lib/eventDraft";

type TicketResponse = {
  id: number;
  name: string;
  price: string | number;
  quantity_total: number;
};

type EventResponse = {
  capacity_total?: number;
  is_free?: boolean;
  currency?: string;
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

const buildTicket = (ticket: TicketDraft): TicketDraft => ({
  id: ticket.id,
  name: ticket.name,
  price: ticket.price,
  quantity: ticket.quantity,
});

export default function CreerEvenementTarificationPage() {
  const router = useRouter();
  const [eventId, setEventId] = useState<number | null>(null);
  const [pricing, setPricing] = useState<PricingDraft>(getEmptyDraft().pricing);
  const [initialTicketIds, setInitialTicketIds] = useState<number[]>([]);
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
    setPricing(draft.pricing);
  }, []);

  useEffect(() => {
    updateEventDraft({ pricing });
  }, [pricing]);

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
      setPricing((prev) => ({
        ...prev,
        capacityTotal: prev.capacityTotal || String(data.capacity_total ?? ""),
        isFree: typeof data.is_free === "boolean" ? data.is_free : prev.isFree,
        currency: data.currency || prev.currency,
      }));
    };

    const loadTickets = async () => {
      const response = await authorizedFetch(
        `/api/marketplace/organizer/events/${eventId}/tickets/`
      );
      if (!response) return;
      if (response.status === 404) {
        handleMissingEvent();
        return;
      }
      if (!response.ok) return;
      const data = (await response.json().catch(() => [])) as TicketResponse[];
      if (ignore || !data.length) return;
      const rows = data.map((ticket) => ({
        id: ticket.id,
        name: ticket.name,
        price: String(ticket.price ?? ""),
        quantity: String(ticket.quantity_total ?? ""),
      }));
      setInitialTicketIds(data.map((ticket) => ticket.id));
      setPricing((prev) => ({
        ...prev,
        tickets: rows,
      }));
    };

    loadEvent();
    loadTickets();

    return () => {
      ignore = true;
    };
  }, [eventId]);

  const handlePricingChange =
    (field: keyof PricingDraft) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const isToggle = field === "isFree" || field === "cancellationPublic";
      const value = isToggle ? event.target.checked : event.target.value;
      setPricing((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleTicketChange = (index: number, field: keyof TicketDraft, value: string) => {
    setPricing((prev) => {
      const nextTickets = [...prev.tickets];
      const current = nextTickets[index] || { name: "", price: "", quantity: "" };
      nextTickets[index] = { ...current, [field]: value };
      return { ...prev, tickets: nextTickets };
    });
  };

  const handleAddTicket = () => {
    setPricing((prev) => ({
      ...prev,
      tickets: [...prev.tickets, { name: "", price: "", quantity: "" }],
    }));
  };

  const handleRemoveTicket = (index: number) => {
    setPricing((prev) => {
      const nextTickets = prev.tickets.filter((_, idx) => idx !== index);
      return { ...prev, tickets: nextTickets.length ? nextTickets : prev.tickets };
    });
  };

  const normalizeTickets = (tickets: TicketDraft[], isFree: boolean) => {
    const cleaned = tickets
      .map((ticket) => ({
        id: ticket.id,
        name: ticket.name.trim(),
        price: isFree ? "0" : ticket.price.trim(),
        quantity: ticket.quantity.trim(),
      }))
      .filter((ticket) => ticket.name || ticket.quantity || ticket.price);

    if (!cleaned.length && isFree) {
      return [
        {
          name: "Entree gratuite",
          price: "0",
          quantity: pricing.capacityTotal || "0",
        },
      ];
    }

    return cleaned;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    if (!eventId) {
      setStatus("error");
      setMessage("Commencez par l'etape 1 avant la tarification.");
      return;
    }

    const capacity = Number(pricing.capacityTotal);
    if (!Number.isFinite(capacity) || capacity <= 0) {
      setStatus("error");
      setMessage("La capacite doit etre superieure a zero.");
      return;
    }

    try {
      const response = await authorizedFetch(
        `/api/marketplace/organizer/events/${eventId}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            capacity_total: capacity,
            is_free: pricing.isFree,
            currency: pricing.currency,
            cancellation_policy: pricing.cancellationPolicy,
            cancellation_public: pricing.cancellationPublic,
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

      const preparedTickets = normalizeTickets(pricing.tickets, pricing.isFree);
      const nextTickets: TicketDraft[] = [];
      const currentIds: number[] = [];

      for (const ticket of preparedTickets) {
        const quantityTotal = Number(ticket.quantity);
        const priceValue = pricing.isFree ? 0 : Number(ticket.price);

        if (!ticket.name || !Number.isFinite(quantityTotal) || quantityTotal <= 0) {
          continue;
        }

        const body = {
          name: ticket.name,
          price: Number.isFinite(priceValue) ? priceValue : 0,
          quantity_total: quantityTotal,
        };

        if (ticket.id) {
          const updateResponse = await authorizedFetch(
            `/api/marketplace/organizer/events/${eventId}/tickets/${ticket.id}/`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            }
          );
          const data = (await updateResponse?.json().catch(() => ({}))) as TicketResponse;
          if (!updateResponse || !updateResponse.ok) {
            throw new Error("Mise a jour des tickets impossible.");
          }
          currentIds.push(data.id ?? ticket.id);
          nextTickets.push({
            id: data.id ?? ticket.id,
            name: ticket.name,
            price: String(data.price ?? ticket.price),
            quantity: String(data.quantity_total ?? ticket.quantity),
          });
        } else {
          const createResponse = await authorizedFetch(
            `/api/marketplace/organizer/events/${eventId}/tickets/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            }
          );
          const data = (await createResponse?.json().catch(() => ({}))) as TicketResponse;
          if (!createResponse || !createResponse.ok) {
            throw new Error("Creation des tickets impossible.");
          }
          currentIds.push(data.id);
          nextTickets.push({
            id: data.id,
            name: data.name,
            price: String(data.price ?? ticket.price),
            quantity: String(data.quantity_total ?? ticket.quantity),
          });
        }
      }

      const removedIds = initialTicketIds.filter((id) => !currentIds.includes(id));
      for (const removedId of removedIds) {
        await authorizedFetch(
          `/api/marketplace/organizer/events/${eventId}/tickets/${removedId}/`,
          { method: "DELETE" }
        );
      }

      setInitialTicketIds(currentIds);
      setPricing((prev) => ({
        ...prev,
        tickets: nextTickets.length ? nextTickets : prev.tickets.map(buildTicket),
      }));
      setStatus("success");
      setMessage("Tarification enregistree. Passez aux medias.");
      router.push("/organisateur/evenements/creer/medias");
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
              <span className={styles.topMeta}>Modele economique et capacite</span>
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
          <div className={`${styles.step} ${styles.stepActive}`}>
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
            <span className={styles.stepBadge}>ETAPE 2 SUR 4</span>
            <h2>Tarification et capacite</h2>
            <p>Definissez le modele economique et la logistique de votre evenement.</p>
          </div>
          <div className={styles.sectionDivider} />

          <form className={styles.sectionBlock} onSubmit={handleSubmit}>
            <div className={styles.sectionBlock}>
              <div className={styles.blockHeader}>
                <div className={styles.blockTitle}>Capacite maximale *</div>
              </div>
              <div className={styles.inlineFields}>
                <label className={styles.field}>
                  <span>Nombre de places</span>
                  <input
                    className={styles.input}
                    type="number"
                    placeholder="Ex: 50"
                    value={pricing.capacityTotal}
                    onChange={handlePricingChange("capacityTotal")}
                  />
                </label>
                <label className={styles.switchRow}>
                  <input
                    className={styles.toggle}
                    type="checkbox"
                    checked={pricing.isFree}
                    onChange={handlePricingChange("isFree")}
                  />
                  <span>Evenement gratuit</span>
                </label>
              </div>
              <span className={styles.helperText}>Nombre total de places disponibles.</span>
            </div>

            <div className={styles.sectionDivider} />

            <div className={styles.sectionBlock}>
              <div className={styles.blockHeader}>
                <div className={styles.blockTitle}>Variantes de prix</div>
                <button type="button" className={styles.secondaryButton} onClick={handleAddTicket}>
                  Ajouter une variante
                </button>
              </div>
              <div className={styles.variantTable}>
                <div className={styles.variantHeader}>
                  <span>Type de ticket</span>
                  <span>Prix (TND)</span>
                  <span>Places</span>
                </div>
                {pricing.tickets.map((ticket, index) => (
                  <div key={`${ticket.name}-${index}`} className={styles.variantRow}>
                    <input
                      className={styles.variantInput}
                      placeholder="Tarif Standard"
                      value={ticket.name}
                      onChange={(event) =>
                        handleTicketChange(index, "name", event.target.value)
                      }
                    />
                    <input
                      className={styles.variantInput}
                      placeholder="25"
                      value={pricing.isFree ? "0" : ticket.price}
                      onChange={(event) =>
                        handleTicketChange(index, "price", event.target.value)
                      }
                      disabled={pricing.isFree}
                    />
                    <div className={styles.ticketRow}>
                      <input
                        className={styles.variantInput}
                        placeholder="40"
                        value={ticket.quantity}
                        onChange={(event) =>
                          handleTicketChange(index, "quantity", event.target.value)
                        }
                      />
                      {pricing.tickets.length > 1 ? (
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => handleRemoveTicket(index)}
                          aria-label="Supprimer cette variante"
                        >
                          x
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.infoBanner}>
                <span>Commission plateforme estimee: 5% du CA</span>
                <strong>Automatique apres publication</strong>
              </div>
            </div>

            <div className={styles.sectionDivider} />

            <div className={styles.sectionBlock}>
              <div className={styles.blockTitle}>Politique d'annulation</div>
              <textarea
                className={styles.textarea}
                rows={4}
                placeholder="Decrivez les conditions d'annulation et de remboursement."
                value={pricing.cancellationPolicy}
                onChange={handlePricingChange("cancellationPolicy")}
              />
              <label className={styles.switchRow}>
                <input
                  className={styles.toggle}
                  type="checkbox"
                  checked={pricing.cancellationPublic}
                  onChange={handlePricingChange("cancellationPublic")}
                />
                <span>Visible par les joueurs</span>
              </label>
            </div>

            <div className={styles.formActions}>
              <a className={styles.secondaryButton} href="/organisateur/evenements/creer">
                Precedent
              </a>
              <div className={styles.actionGroup}>
                <button type="submit" className={styles.primaryButton}>
                  {status === "loading" ? "Enregistrement..." : "Suivant"}
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
      </main>
      <Footer />
    </div>
  );
}
