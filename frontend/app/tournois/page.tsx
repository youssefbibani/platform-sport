import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../components/shared/SiteHeader";
import Footer from "../components/shared/Footer";
import Reveal from "../components/shared/Reveal";
import { siteData } from "../data/home";
import styles from "./page.module.css";
import { buildEventCards, fetchPublishedEvents } from "../lib/marketplace";


type UpcomingItem = {
  name: string;
  date: string;
  location: string;
  level: string;
  capacity: string;
  price: string;
  tag: string;
  image: { src: string; alt: string };
  imageUrl?: string;
  href?: string;
};

export default async function TournoisPage() {
  const { tournois } = siteData;
  const events = await fetchPublishedEvents();
  const mappedEvents = await buildEventCards(
    events,
    tournois.upcoming.items.map((item) => item.image)
  );

  const upcomingItems: UpcomingItem[] = mappedEvents.length
    ? mappedEvents.map((event, index) => ({
        name: event.name,
        date: event.date,
        location: event.location,
        level: event.level,
        capacity: event.capacity,
        price: event.price,
        tag: event.tag,
        image: event.image,
        imageUrl: event.imageUrl,
        href: events[index]?.slug ? `/tournois/${events[index].slug}` : tournois.upcoming.ctaHref,
      }))
    : tournois.upcoming.items;

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <section className={styles.hero}>
          <Reveal className={styles.heroContent}>
            <p className={styles.eyebrow}>{tournois.hero.eyebrow}</p>
            <h1>{tournois.hero.title}</h1>
            <p className={styles.heroCopy}>{tournois.hero.description}</p>
            <div className={styles.heroActions}>
              {tournois.hero.actions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={
                    action.variant === "primary" ? styles.primaryButton : styles.secondaryButton
                  }
                >
                  {action.label}
                </Link>
              ))}
            </div>
            <div className={styles.heroStats}>
              {tournois.hero.stats.map((stat) => (
                <div key={stat.label} className={styles.heroStat}>
                  <p>{stat.label}</p>
                  <h3>{stat.value}</h3>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className={styles.heroMedia} delay={160}>
            <div className={styles.heroImage}>
              <Image
                src={tournois.hero.image.src}
                alt={tournois.hero.image.alt}
                fill
                className={styles.heroImageMedia}
              />
            </div>
          </Reveal>
        </section>

        <Reveal className={styles.filters}>
          <div className={styles.filterRow}>
            {tournois.filters.map((filter, index) => (
              <button
                key={filter}
                type="button"
                className={`${styles.filterButton} ${index === 0 ? styles.filterActive : ""}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </Reveal>

        <section className={styles.upcoming}>
          <Reveal>
            <h2>{tournois.upcoming.title}</h2>
            <p className={styles.sectionCopy}>{tournois.upcoming.description}</p>
          </Reveal>
          <div className={styles.eventGrid}>
            {upcomingItems.map((item, index) => (
              <Reveal key={`${item.name}-${index}`} delay={index * 80}>
                <article className={styles.eventCard}>
                  <div className={styles.eventMedia}>
                    {item.imageUrl && item.imageUrl.startsWith("http") ? (
                      <div
                        className={styles.eventImage}
                        style={{ backgroundImage: `url(${item.imageUrl})` }}
                        role="img"
                        aria-label={item.image.alt}
                      />
                    ) : (
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        fill
                        className={styles.eventImage}
                      />
                    )}
                    <span className={styles.eventTag}>{item.tag}</span>
                  </div>
                  <div className={styles.eventBody}>
                    <p className={styles.eventDate}>{item.date}</p>
                    <h3>{item.name}</h3>
                    <div className={styles.eventMeta}>
                      <span>{item.location}</span>
                      <span>{item.level}</span>
                    </div>
                    <div className={styles.eventMeta}>
                      <span>{item.capacity}</span>
                      <span>{item.price}</span>
                    </div>
                    <Link
                      className={styles.secondaryButton}
                      href={item.href || tournois.upcoming.ctaHref}
                    >
                      {tournois.upcoming.ctaLabel}
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal className={styles.spotlight}>
          <div className={styles.spotlightCard}>
            <div>
              <p className={styles.eyebrow}>{tournois.spotlight.tag}</p>
              <h2>{tournois.spotlight.title}</h2>
              <p className={styles.sectionCopy}>{tournois.spotlight.description}</p>
              <ul className={styles.bulletList}>
                {tournois.spotlight.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <Link className={styles.primaryButton} href={tournois.spotlight.action.href}>
                {tournois.spotlight.action.label}
              </Link>
            </div>
            <div className={styles.spotlightImage}>
              <Image
                src={tournois.spotlight.image.src}
                alt={tournois.spotlight.image.alt}
                fill
                className={styles.spotlightImageMedia}
              />
            </div>
          </div>
        </Reveal>

        <Reveal className={styles.cta}>
          <div className={styles.ctaCard}>
            <div>
              <h2>{tournois.cta.title}</h2>
              <p>{tournois.cta.description}</p>
            </div>
            <Link className={styles.primaryButton} href={tournois.cta.action.href}>
              {tournois.cta.action.label}
            </Link>
          </div>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
