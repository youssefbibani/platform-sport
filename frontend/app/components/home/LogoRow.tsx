import styles from "../../page.module.css";
import Reveal from "../shared/Reveal";

type LogoRowProps = {
  logos: string[];
};

export default function LogoRow({ logos }: LogoRowProps) {
  return (
    <Reveal className={styles.logoRow} delay={140}>
      {logos.map((logo) => (
        <span key={logo}>{logo}</span>
      ))}
    </Reveal>
  );
}
