import Image from "next/image";
import Link from "next/link";
import styles from "../../a-propos/page.module.css";
import Reveal from "../shared/Reveal";

type HeroAction = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
};

type HeroData = {
  tag: string;
  title: string;
  highlight: string;
  description: string;
  actions: HeroAction[];
  image: { src: string; alt: string };
};

type Stat = {
  label: string;
  value: string;
};

type HeroSectionProps = {
  hero: HeroData;
  stats: Stat[];
};

export default function HeroSection({ hero, stats }: HeroSectionProps) {
  return (
    <section className={styles.hero}>
      <Reveal className={styles.heroContent}>
        <p className={styles.heroTag}>{hero.tag}</p>
        <h1>
          {hero.title}
          <span> {hero.highlight}</span>
        </h1>
        <p className={styles.heroCopy}>{hero.description}</p>
        <div className={styles.heroActions}>
          {hero.actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={
                action.variant === "primary" ? styles.primaryButton : styles.secondaryButton
              }
            >
              {action.label}
            </Link>
          ))}
        </div>
      </Reveal>
      <Reveal className={styles.heroVisual} delay={160}>
        <div className={styles.heroImage}>
          <Image src={hero.image.src} alt={hero.image.alt} fill className={styles.heroImageMedia} />
        </div>
      </Reveal>
      <div className={styles.statsRow}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <p>{stat.label}</p>
            <h3>{stat.value}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
