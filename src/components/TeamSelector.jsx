import styles from "@/styles/TeamSelector.module.scss";
import { motion } from "motion/react";

export default function TeamSelector({
  homeTeam,
  awayTeam,
  value, // "home" | "away" | "both"
  onChange,
  showBoth = true,
  layoutId = "teamPill",
  className = "",
}) {
  const options = [
    { id: "home", label: homeTeam },
    { id: "away", label: awayTeam },
    ...(showBoth ? [{ id: "both", label: "Both" }] : []),
  ];

  return (
    <div className={`${styles.wrapper} ${className}`.trim()}>
      <div className={styles.teamSelector}>
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`${styles.teamTab} ${value === opt.id ? styles.active : ""}`}
          >
            {value === opt.id && (
              <motion.span
                layoutId={layoutId}
                className={styles.teamPill}
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            <span className={styles.label}>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
