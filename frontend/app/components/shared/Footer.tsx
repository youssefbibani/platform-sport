import Link from "next/link";
import styles from "./footer.module.css";
import { siteData } from "../../data/home";

const brandName = siteData.brand.name;

export default function Footer() {
  const { footer } = siteData;

  return (
    <footer className={styles.footer}>
      <div className={styles.footerBrand}>
        <div className={styles.brand}>
          <span className={styles.brandMark} />
          {brandName}
        </div>
        <p>{footer.summary}</p>
      </div>
      <div className={styles.footerColumns}>
        {footer.columns.map((column) => (
          <div key={column.title}>
            <h4>{column.title}</h4>
            {column.links.map((link) => (
              <Link key={link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.footerBottom}>
        <span>{footer.bottom.note}</span>
        <div className={styles.footerLinks}>
          {footer.bottom.links.map((link) => (
            <Link key={link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
