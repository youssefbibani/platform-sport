import styles from "../../a-propos/page.module.css";
import Reveal from "../shared/Reveal";

type Milestone = {
  year: string;
  title: string;
  copy: string;
};

type JourneyData = {
  tag: string;
  title: string;
  lead: string;
  timeline: Milestone[];
};

type JourneySectionProps = {
  data: JourneyData;
};

export default function JourneySection({ data }: JourneySectionProps) {
  return (
    <section className={styles.journey}>
      <Reveal>
        <p className={styles.sectionTag}>{data.tag}</p>
        <h2>{data.title}</h2>
        <p className={styles.sectionLead}>{data.lead}</p>
      </Reveal>
      <div className={styles.timeline}>
        {data.timeline.map((item, index) => (
          <Reveal key={item.year} delay={index * 80}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineMarker}>{index + 1}</div>
              <div>
                <p className={styles.timelineYear}>{item.year}</p>
                <h4>{item.title}</h4>
                <p>{item.copy}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
