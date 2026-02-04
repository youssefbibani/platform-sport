import styles from "./page.module.css";
import { siteData } from "../data/home";
import SiteHeader from "../components/shared/SiteHeader";
import HeroSection from "../components/apropos/HeroSection";
import PhilosophySection from "../components/apropos/PhilosophySection";
import JourneySection from "../components/apropos/JourneySection";
import TeamSection from "../components/apropos/TeamSection";
import Footer from "../components/shared/Footer";

export default function AproposPage() {
  const { about } = siteData;

  return (
    <div className={styles.page}>
      <SiteHeader />
      <HeroSection hero={about.hero} stats={about.stats} />
      <PhilosophySection data={about.philosophy} />
      <JourneySection data={about.journey} />
      <TeamSection data={about.team} />
      <Footer />
    </div>
  );
}
