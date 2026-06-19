import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import Link from "next/link";
import matchInfo from "@/data/15-16-PLFixtures.json";
import HeroHeatMap from "@/components/HeroHeatMap";
import RandomGameButton from "@/components/RandomGameButton";


function formatMatchDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function groupMatchesByWeek(matches) {
  const byWeek = matches.reduce((acc, match) => {
    const week = match.match_week;
    if (!acc[week]) acc[week] = [];
    acc[week].push(match);
    return acc;
  }, {});

  return Object.keys(byWeek)
    .map(Number)
    .sort((a, b) => a - b)
    .map((week) => ({
      week,
      matches: byWeek[week].sort(
        (a, b) => new Date(a.match_date) - new Date(b.match_date)
      ),
    }));
}

export default function Home() {
  const matches = [...matchInfo].sort(
    (a, b) => new Date(a.match_date) - new Date(b.match_date)
  );
  const gameweeks = groupMatchesByWeek(matches);

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

      <main className={styles.homeContent}>
          <section className={styles.heroCard}>
            <div className={styles.heroContent}> 
              <h1 className={styles.heroTitle}>Fixtures 15/16</h1>
              <div className={styles.heroHeatMap}>
                <HeroHeatMap />
              </div>
            </div>
            <div className={styles.heroText}>
              <p className={styles.heroSubtitle}>
              A data-driven exploration of the 2015–16 Premier League season. Open a match to view stats, shot maps, and heatmaps.
              </p>
              <div className={styles.heroFooter}>
                  <p className={styles.heroSubtitle}>
                  Created by  
                  <Link className={styles.heroLink} href="https://www.angusmacminn.com" target="_blank"> Angus MacMinn</Link>,
                   data sourced via <Link className={styles.heroLink} href="https://github.com/statsbomb/open-data" target="_blank">SportsBomb Open Data</Link>
                  </p>
                  <RandomGameButton matches={matches} />
              </div>
            </div>
          </section>

          <div className={styles.gameweeksList}>
            {gameweeks.map(({ week, matches: weekMatches }) => (
              <section key={week} className={styles.gameweekSection}>
                <h2 className={styles.gameweekHeader}>Gameweek {week}</h2>
                <div className={styles.gameList}>
                  {weekMatches.map((match) => (
                    <Link
                      key={match.match_id}
                      href={`/game/${match.match_id}`}
                      className={styles.gameCard}
                    >
                      <div className={styles.gameMeta}>
                        <span className={styles.gameLabel}>
                          {formatMatchDate(match.match_date)}
                        </span>
                        <h3 className={styles.gameTitle}>
                          {match.home_team.home_team_name} {match.home_score} –{" "}
                          {match.away_score} {match.away_team.away_team_name}
                        </h3>
                        <span className={styles.gameStadium}>
                          {match.stadium?.name?.trim() ?? ""}
                        </span>
                      </div>
                      <svg
                        className={styles.gameCardArrow}
                        aria-hidden="true"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h12" />
                        <path d="m13 7 5 5-5 5" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
      </main>
    </>
  );
}
