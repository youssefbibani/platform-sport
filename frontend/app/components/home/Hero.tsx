import Image from "next/image";
import Link from "next/link";
import styles from "../../page.module.css";
import Reveal from "../shared/Reveal";

type HeroCta = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
};

type HeroData = {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  highlights?: string[];
  ctas: HeroCta[];
  socialProof: {
    text: string;
    avatars: string[];
  };
  stats: { label: string; value: string }[];
  media: {
    kicker: string;
    leftTeam: string;
    rightTeam: string;
    score: string;
    summary: string;
    status: string;
  };
  image: { src: string; alt: string };
};

type HeroProps = {
  data: HeroData;
};

export default function Hero({ data }: HeroProps) {
  return (
    <section className={styles.hero}>
      <Reveal className={styles.heroContent} delay={120}>
        <span className={styles.badge}>{data.badge}</span>
        <h1>
          {data.title}
          <span> {data.highlight}</span>
        </h1>
        <p>{data.description}</p>
        {data.highlights?.length ? (
          <div className={styles.heroHighlights}>
            {data.highlights.map((item) => (
              <span key={item} className={styles.heroHighlight}>
                {item}
              </span>
            ))}
          </div>
        ) : null}
        <div className={styles.heroCtas}>
          {data.ctas.map((cta) => (
            <Link
              key={cta.label}
              className={cta.variant === "primary" ? styles.primaryButton : styles.secondaryButton}
              href={cta.href}
            >
              {cta.label}
            </Link>
          ))}
        </div>
        <div className={styles.socialProof}>
          <div className={styles.avatarStack}>
            {data.socialProof.avatars.map((avatar, index) => (
              <span key={`${avatar}-${index}`} className={styles.avatar}>
                {avatar}
              </span>
            ))}
          </div>
          <p>{data.socialProof.text}</p>
        </div>
      </Reveal>
      <Reveal className={styles.heroMedia} delay={220}>
        <div className={styles.mediaFrame}>
          <div className={styles.mediaScreen}>
            <Image
              src={data.image.src}
              alt={data.image.alt}
              fill
              priority
              className={styles.mediaImage}
            />
            <div className={styles.mediaOverlay}>
              <span>{data.media.kicker}</span>
              <strong>{data.media.leftTeam}</strong>
              <div className={styles.score}>{data.media.score}</div>
              <strong>{data.media.rightTeam}</strong>
            </div>
            <div className={styles.mediaBottom}>
              <div>
                <p>{data.media.kicker}</p>
                <h3>{data.media.summary}</h3>
              </div>
              <span className={styles.livePill}>{data.media.status}</span>
            </div>
          </div>
        </div>
      </Reveal>
      <div className={styles.heroStats}>
        {data.stats.map((stat) => (
          <div key={stat.label} className={styles.heroStatCard}>
            <p>{stat.label}</p>
            <h3>{stat.value}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
