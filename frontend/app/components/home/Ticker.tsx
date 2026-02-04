import styles from "../../page.module.css";

type TickerProps = {
  items: string[];
};

export default function Ticker({ items }: TickerProps) {
  return (
    <div className={styles.ticker}>
      <div className={styles.tickerTrack}>
        {items.concat(items).map((item, index) => (
          <span key={`${item}-${index}`} className={styles.tickerItem}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
