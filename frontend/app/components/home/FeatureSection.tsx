import styles from "../../page.module.css";
import Reveal from "../shared/Reveal";

type FeatureCard = {
  title: string;
  copy: string;
  icon: string;
};

type FeatureSectionData = {
  eyebrow: string;
  title: string;
  description: string;
  tabs: string[];
  cards: FeatureCard[];
};

type FeatureSectionProps = {
  data: FeatureSectionData;
};

export default function FeatureSection({ data }: FeatureSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Reveal>
          <p className={styles.eyebrow}>{data.eyebrow}</p>
          <h2>{data.title}</h2>
          <p className={styles.sectionCopy}>{data.description}</p>
        </Reveal>
        <Reveal className={styles.tabs} delay={120}>
          {data.tabs.map((tab, index) => (
            <button
              key={tab}
              className={`${styles.tab} ${index === 0 ? styles.tabActive : ""}`}
              type="button"
            >
              {tab}
            </button>
          ))}
        </Reveal>
      </div>
      <div className={styles.cardGrid}>
        {data.cards.map((card, index) => (
          <Reveal key={card.title} delay={index * 80}>
            <article className={styles.infoCard}>
              <div className={styles.cardIcon}>{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
