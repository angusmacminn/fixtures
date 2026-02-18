import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Fixtures</title>
        <meta
          name="description"
          content="Interactive football fixture visualizations and match heatmaps."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.homeMain}>
        <div className={styles.homeShell}>
          <nav className={styles.homeNav}>
            <span className={styles.brand}>Fixtures</span>
            <div className={styles.navLinks}>
              <span className={styles.activeNav}>Home</span>
              
            </div>
          </nav>

          <section className={styles.heroCard}>
            <h1 className={styles.heroTitle}>Football Match Visualizations</h1>
            
          </section>

          <section className={styles.gameList}>
            <article className={styles.gameCard}>
              <div className={styles.gameMeta}>
                <span className={styles.gameLabel}>Featured Fixture</span>
                <h2 className={styles.gameTitle}>
                  Arsenal vs Manchester United 2015/16
                </h2>
                
              </div>
              <Link className={styles.gameButton} href="/game">
                Open Match
              </Link>
            </article>
          </section>
        </div>
      </main>
    </>
  );
}
