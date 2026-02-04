import styles from "./page.module.css";
import { siteData } from "./data/home";
import SiteHeader from "./components/shared/SiteHeader";
import Ticker from "./components/home/Ticker";
import Hero from "./components/home/Hero";
import LogoRow from "./components/home/LogoRow";
import FeatureSection from "./components/home/FeatureSection";
import TournamentSection from "./components/home/TournamentSection";
import LeaderboardSection from "./components/home/LeaderboardSection";
import InsightsSection from "./components/home/InsightsSection";
import CtaSection from "./components/home/CtaSection";
import Footer from "./components/shared/Footer";
import { buildEventCards, fetchPublishedEvents } from "./lib/marketplace";

export default async function Home() {
  const { home } = siteData;
  const events = await fetchPublishedEvents();
  const mappedEvents = await buildEventCards(
    events.slice(0, home.tournaments.items.length),
    home.tournaments.items.map((item) => item.image)
  );

  const tournamentItems = mappedEvents.length
    ? mappedEvents.map((event, index) => ({
        name: event.name,
        date: event.date,
        teams: event.capacity,
        prize: event.price,
        tag: event.tag,
        image: event.image,
        imageUrl: event.imageUrl,
        href: events[index]?.slug ? `/tournois/${events[index].slug}` : home.tournaments.ctaHref,
      }))
    : home.tournaments.items;

  return (
    <div className={styles.page}>
      <SiteHeader />
      <Ticker items={home.ticker} />

      <main className={styles.main}>
        <Hero data={home.hero} />
        <LogoRow logos={home.logos} />
        <TournamentSection data={home.tournaments} items={tournamentItems} />
        <FeatureSection data={home.features} />
        <LeaderboardSection data={home.leaderboard} />
        <InsightsSection data={home.insights} />
        <CtaSection data={home.cta} />
      </main>

      <Footer />
    </div>
  );
}
