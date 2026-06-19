import SiteNav from "@/components/SiteNav";
import styles from "@/styles/AppLayout.module.scss";

export default function AppLayout({ children }) {
  return (
    <div className={styles.appLayout}>
      <SiteNav />
      {children}
    </div>
  );
}
