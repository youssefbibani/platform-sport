import Image from "next/image";
import Link from "next/link";
import styles from "../../a-propos/page.module.css";
import Reveal from "../shared/Reveal";

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: { src: string; alt: string };
};

type TeamData = {
  tag: string;
  title: string;
  trustLabel: string;
  action: { label: string; href: string };
  members: TeamMember[];
  logos: string[];
  cta: {
    title: string;
    description: string;
    actions: { label: string; href: string; variant: "primary" | "secondary" }[];
  };
};

type TeamSectionProps = {
  data: TeamData;
};

export default function TeamSection({ data }: TeamSectionProps) {
  return (
    <section className={styles.team}>
      <div className={styles.teamHeader}>
        <Reveal>
          <p className={styles.sectionTag}>{data.tag}</p>
          <h2>{data.title}</h2>
        </Reveal>
        <Reveal delay={120}>
          <Link className={styles.linkButton} href={data.action.href}>
            {data.action.label}
          </Link>
        </Reveal>
      </div>
      <div className={styles.teamGrid}>
        {data.members.map((member, index) => (
          <Reveal key={member.name} delay={index * 90}>
            <article className={styles.teamCard}>
              <div className={styles.teamAvatar}>
                <Image src={member.image.src} alt={member.image.alt} fill className={styles.teamAvatarImage} />
              </div>
              <h3>{member.name}</h3>
              <p className={styles.role}>{member.role}</p>
              <p className={styles.bio}>{member.bio}</p>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal className={styles.trustRow} delay={120}>
        <p>{data.trustLabel}</p>
        <div className={styles.logoRow}>
          {data.logos.map((logo) => (
            <span key={logo}>{logo}</span>
          ))}
        </div>
      </Reveal>
      <Reveal className={styles.cta} delay={140}>
        <div>
          <h2>{data.cta.title}</h2>
          <p>{data.cta.description}</p>
        </div>
        <div className={styles.ctaActions}>
          {data.cta.actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={action.variant === "primary" ? styles.primaryButton : styles.secondaryButton}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
