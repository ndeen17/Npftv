import type { CSSProperties } from "react";
import { SPRITE, type IconName } from "./icon-sprite";

export type { IconName };

export function Icon({ name, fill, className = "", style, label }: { name: IconName; fill?: boolean; className?: string; style?: CSSProperties; label?: string }) {
  return (
    <svg className={`ico${fill ? " fill" : ""} ${className}`} style={style} aria-hidden={label ? undefined : true} role={label ? "img" : undefined} aria-label={label}>
      <use href={`#i-${name}`} />
    </svg>
  );
}

/** Rendered once in the root layout. */
export function IconSprite() {
  return <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }} dangerouslySetInnerHTML={{ __html: SPRITE }} />;
}
