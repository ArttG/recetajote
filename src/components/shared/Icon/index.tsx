import { CSSProperties } from "react";

interface Props {
  /** Material Symbols Rounded ligature name, e.g. "favorite", "schedule". */
  name: string;
  size?: number;
  /** 0 = outlined, 1 = filled */
  fill?: 0 | 1;
  weight?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Renders a Material Symbols Rounded icon. The font is loaded globally in _document.
 */
const Icon = ({ name, size = 20, fill = 0, weight = 400, color, className, style }: Props) => (
  <span
    className={`ms${className ? ` ${className}` : ""}`}
    aria-hidden="true"
    style={{
      fontSize: size,
      color,
      fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'opsz' 24`,
      ...style,
    }}
  >
    {name}
  </span>
);

export default Icon;
