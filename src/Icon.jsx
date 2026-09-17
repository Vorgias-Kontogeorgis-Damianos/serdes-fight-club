export default function Icon({ name, className = '', style }) {
  return <span className={`icon icon-${name} ${className}`} style={style} aria-hidden="true" />;
}
