import Image from "next/image";
import styles from "../../a-propos/page.module.css";
import Reveal from "../shared/Reveal";

type Principle = {
  title: string;
  copy: string;
};

type ValueCard = {
  title: string;
  copy: string;
};

type PhilosophyData = {
  tag: string;
  title: string;
  description: string;
  principles: Principle[];
  values: ValueCard[];
  images: { src: string; alt: string }[];
};

type PhilosophySectionProps = {
  data: PhilosophyData;
};

export default function PhilosophySection({ data }: PhilosophySectionProps) {
  return (
    <section className={styles.philosophy}>
      <Reveal className={styles.philosophyIntro}>
        <p className={styles.sectionTag}>{data.tag}</p>
        <h2>{data.title}</h2>
        <p>{data.description}</p>
        <div className={styles.principles}>
          {data.principles.map((item) => (
            <div key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.copy}</p>
            </div>
          ))}
        </div>
      </Reveal>
      <div className={styles.philosophyGrid}>
        <Reveal className={styles.photoTall} delay={120}>
          <Image src={data.images[0].src} alt={data.images[0].alt} fill className={styles.photoMedia} />
        </Reveal>
        <Reveal className={styles.photoCard} delay={160}>
          <Image src={data.images[1].src} alt={data.images[1].alt} fill className={styles.photoMedia} />
        </Reveal>
        {data.values.map((value, index) => (
          <Reveal key={value.title} delay={200 + index * 80}>
            <div className={styles.valueCard}>
              <h3>{value.title}</h3>
              <p>{value.copy}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
