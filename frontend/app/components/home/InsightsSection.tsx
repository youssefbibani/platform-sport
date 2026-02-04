import Image from "next/image";
import Link from "next/link";
import styles from "../../page.module.css";
import Reveal from "../shared/Reveal";

type InsightPost = {
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  href: string;
  image: { src: string; alt: string };
};

type InsightsSectionData = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  posts: InsightPost[];
};

type InsightsSectionProps = {
  data: InsightsSectionData;
};

export default function InsightsSection({ data }: InsightsSectionProps) {
  return (
    <section className={styles.insightsSection}>
      <Reveal>
        <p className={styles.eyebrow}>{data.eyebrow}</p>
        <h2>{data.title}</h2>
        <p className={styles.sectionCopy}>{data.description}</p>
      </Reveal>
      <div className={styles.insightGrid}>
        {data.posts.map((post, index) => (
          <Reveal key={post.title} delay={index * 90}>
            <article className={styles.insightCard}>
              <div className={styles.insightMedia}>
                <Image
                  src={post.image.src}
                  alt={post.image.alt}
                  fill
                  className={styles.insightImage}
                />
                <span className={styles.insightTag}>{post.tag}</span>
              </div>
              <div className={styles.insightBody}>
                <p className={styles.insightMeta}>{post.date}</p>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <Link className={styles.insightCta} href={post.href}>
                  {data.ctaLabel}
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
