"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../../page.module.css";
import Reveal from "../shared/Reveal";
import { readAuthCache } from "../../lib/auth";

type TournamentItem = {
  name: string;
  date: string;
  teams: string;
  prize: string;
  tag: string;
  image: { src: string; alt: string };
  imageUrl?: string;
  href?: string;
};

type TournamentSectionData = {
  eyebrow: string;
  title: string;
  action: { label: string; href: string };
  ctaLabel: string;
  ctaHref: string;
  items: TournamentItem[];
};

type TournamentSectionProps = {
  data: TournamentSectionData;
  items?: TournamentItem[];
};

const isRemoteImage = (value?: string) =>
  Boolean(value && value.startsWith("http"));

export default function TournamentSection({ data, items }: TournamentSectionProps) {
  const list = items && items.length ? items : data.items;
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const updateAuth = () => {
      const cached = readAuthCache();
      setIsAuthed(Boolean(cached?.access));
    };

    updateAuth();
    window.addEventListener("auth-change", updateAuth);
    return () => window.removeEventListener("auth-change", updateAuth);
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeaderRow}>
        <Reveal>
          <p className={styles.eyebrow}>{data.eyebrow}</p>
          <h2>{data.title}</h2>
        </Reveal>
        <Reveal delay={120}>
          <Link className={styles.linkButton} href={data.action.href}>
            {data.action.label}
          </Link>
        </Reveal>
      </div>
      <div className={styles.tournamentGrid}>
        {list.map((tournament, index) => (
          <Reveal key={`${tournament.name}-${index}`} delay={index * 80}>
            <article className={styles.tournamentCard}>
              <div className={styles.tournamentMedia}>
                {isRemoteImage(tournament.imageUrl) ? (
                  <div
                    className={styles.tournamentImage}
                    style={{ backgroundImage: `url(${tournament.imageUrl})` }}
                    role="img"
                    aria-label={tournament.image.alt}
                  />
                ) : (
                  <Image
                    src={tournament.image.src}
                    alt={tournament.image.alt}
                    fill
                    className={styles.tournamentImage}
                  />
                )}
                <span className={styles.tag}>{tournament.tag}</span>
              </div>
              <div className={styles.tournamentBody}>
                <p className={styles.meta}>{tournament.date}</p>
                <h3>{tournament.name}</h3>
                <div className={styles.metaRow}>
                  <span>{tournament.teams}</span>
                  <span>{tournament.prize}</span>
                </div>
                <Link
                  className={styles.secondaryButton}
                  href={isAuthed ? tournament.href || data.ctaHref : "/signup"}
                >
                  {isAuthed ? "Details" : data.ctaLabel}
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
