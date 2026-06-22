import styles from "@/styles/LineupPitch.module.scss";
import { getContrastTextColor } from "@/utils/getContrastTextColor";

function SubstituteColumn({ teamName, players, teamColor, onPlayerClick }) {
  return (
    <div className={styles.substitutesColumn}>
      <h3 className={styles.substitutesHeading}>
        <span
          className={styles.substitutesTeamDot}
          style={{ backgroundColor: teamColor }}
          aria-hidden="true"
        />
        {teamName}
      </h3>
      {players.length === 0 ? (
        <p className={styles.substitutesEmpty}>No substitute data</p>
      ) : (
        <ul className={styles.substitutesList}>
          {players.map((player) => (
            <li key={`${teamName}-${player.jerseyNumber}-${player.playerName}`}>
              <button
                type="button"
                className={styles.substituteButton}
                onClick={() => onPlayerClick(player, teamName)}
              >
                <span
                  className={styles.substituteJersey}
                  style={{
                    backgroundColor: teamColor,
                    color: getContrastTextColor(teamColor),
                  }}
                >
                  {player.jerseyNumber || "—"}
                </span>
                <span className={styles.substituteName}>{player.lastName}</span>
                {player.subOnMinute && (
                  <span className={styles.substituteMinute}>
                    {player.subOnMinute}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SubstitutesList({
  homeTeamName,
  awayTeamName,
  homeSubstitutes,
  awaySubstitutes,
  homeColor,
  awayColor,
  onPlayerClick,
}) {
  const hasSubstitutes =
    homeSubstitutes.length > 0 || awaySubstitutes.length > 0;

  if (!hasSubstitutes) return null;

  return (
    <section className={styles.substitutesSection} aria-label="Substitutes">
      <h2 className={styles.substitutesTitle}>Substitutes</h2>
      <div className={styles.substitutesGrid}>
        <SubstituteColumn
          teamName={homeTeamName}
          players={homeSubstitutes}
          teamColor={homeColor}
          onPlayerClick={onPlayerClick}
        />
        <SubstituteColumn
          teamName={awayTeamName}
          players={awaySubstitutes}
          teamColor={awayColor}
          onPlayerClick={onPlayerClick}
        />
      </div>
    </section>
  );
}
