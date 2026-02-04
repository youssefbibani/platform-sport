import Link from "next/link";
import styles from "../../page.module.css";
import Reveal from "../shared/Reveal";

type CtaAction = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
};

type CtaData = {
  title: string;
  description: string;
  actions: CtaAction[];
};

type CtaSectionProps = {
  data: CtaData;
};

export default function CtaSection({ data }: CtaSectionProps) {
  return (
    <Reveal className={styles.ctaSection}>
      <div>
        <h2>{data.title}</h2>
        <p>{data.description}</p>
      </div>
      <div className={styles.heroCtas}>
        {data.actions.map((action) => (
          <Link
            key={action.label}
            className={action.variant === "primary" ? styles.primaryButton : styles.secondaryButton}
            href={action.href}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </Reveal>
  );
}
