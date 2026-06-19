"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/SiteNav.module.scss";

export default function SiteNav() {
  const router = useRouter();
  const isHome = router.pathname === "/";

  return (
    <nav className={styles.siteNav}>
      <Link href="/" className={styles.brand}>
        Fixtures
      </Link>
      <div className={styles.navLinks}>
        {isHome ? (
          <span className={styles.activeNav}>Home</span>
        ) : (
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
        )}
      </div>
    </nav>
  );
}
