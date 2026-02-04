"use client";

import { usePathname } from "next/navigation";
import styles from "./pageTransition.module.css";

type PageTransitionProps = {
  children: React.ReactNode;
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <div key={pathname} className={styles.pageTransition}>
      {children}
    </div>
  );
}
