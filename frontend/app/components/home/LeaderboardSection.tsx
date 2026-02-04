import styles from "../../page.module.css";
import Reveal from "../shared/Reveal";

type TopPlayer = {
  name: string;
  team: string;
  points: string;
  win: string;
};

type LiveMatch = {
  title: string;
  meta: string;
  status: string;
};

type LeaderboardData = {
  eyebrow: string;
  title: string;
  table: { headers: string[] };
  players: TopPlayer[];
  live: {
    title: string;
    cta: string;
    items: LiveMatch[];
  };
};

type LeaderboardSectionProps = {
  data: LeaderboardData;
};

export default function LeaderboardSection({ data }: LeaderboardSectionProps) {
  return (
    <section className={styles.splitSection}>
      <Reveal className={styles.leaderboard}>
        <div className={styles.sectionHeaderRow}>
          <div>
            <p className={styles.eyebrow}>{data.eyebrow}</p>
            <h2>{data.title}</h2>
          </div>
        </div>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            {data.table.headers.map((header) => (
              <span key={header}>{header}</span>
            ))}
          </div>
          {data.players.map((player, index) => (
            <div key={player.name} className={styles.tableRow}>
              <span className={styles.rank}>{index + 1}</span>
              <span>
                <strong>{player.name}</strong>
                <small>{player.team}</small>
              </span>
              <span>{player.points}</span>
              <span className={styles.positive}>{player.win}</span>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal className={styles.livePanel} delay={120}>
        <div className={styles.liveHeader}>
          <span className={styles.liveDot} />
          {data.live.title}
        </div>
        {data.live.items.map((match) => (
          <div key={match.title} className={styles.liveItem}>
            <div>
              <p className={styles.liveStatus}>{match.status}</p>
              <h4>{match.title}</h4>
              <span>{match.meta}</span>
            </div>
            <button className={styles.ghostButton} type="button">
              {data.live.cta}
            </button>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
