import styles from "@/styles/Skeleton.module.scss";

const VARIANT_CLASS = {
  text: styles.text,
  title: styles.title,
  block: styles.block,
  circle: styles.circle,
  pitch: styles.pitch,
  slider: styles.slider,
  tab: styles.tab,
  statRow: styles.statRow,
};

export default function Skeleton({
  variant = "block",
  className = "",
  style,
  width,
  height,
  as: Tag = "span",
  "aria-hidden": ariaHidden = true,
}) {
  const variantClass = VARIANT_CLASS[variant] ?? styles.block;

  return (
    <Tag
      className={`${styles.skeleton} ${variantClass} ${className}`.trim()}
      style={{
        ...(width != null ? { width } : null),
        ...(height != null ? { height } : null),
        ...style,
      }}
      aria-hidden={ariaHidden}
    />
  );
}
