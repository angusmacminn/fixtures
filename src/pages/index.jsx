import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import Link from "next/link";
import matchInfo from "@/data/15-16-PLFixtures.json";

export default function Home() {
  const matches = [...matchInfo].sort(
    (a, b) => new Date(a.match_date) - new Date(b.match_date)
  );


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

  
          <section className={styles.gameList}>
      {matches.map((match) => (
        <article key={match.match_id} className={styles.gameCard}>
          <div className={styles.gameMeta}>
            <span className={styles.gameLabel}>
              GW {match.match_week} · {match.match_date}
            </span>
            <h2 className={styles.gameTitle}>
              {match.home_team.home_team_name} {match.home_score} – {match.away_score}{" "}
              {match.away_team.away_team_name}
            </h2>
          </div>
          <Link className={styles.gameButton} href={`/game/${match.match_id}`}>
            Open Match
          </Link>
        </article>
      ))}
    </section>
        </div>
      </main>
    </>
  );
}
