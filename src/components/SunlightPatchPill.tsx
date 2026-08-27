interface SunlightPatchPillProps {
  label: string;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  inactive?: boolean;
  ariaControls?: string;
  ariaExpanded?: boolean;
  onClick?: () => void;
}

export function SunlightPatchPill({
  label,
  href,
  target,
  rel,
  className = "",
  inactive = false,
  ariaControls,
  ariaExpanded,
  onClick,
}: SunlightPatchPillProps) {
  const content = (
    <>
      <span aria-hidden="true" className="sunlight-patch-pill__light" />
      <span className="sunlight-patch-pill__label">{label}</span>
    </>
  );
  const classes = `sunlight-patch-pill ${className}`.trim();

  if (href) {
    return (
      <a
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        className={classes}
        data-inactive={inactive ? "true" : "false"}
        href={href}
        onClick={onClick}
        rel={rel}
        target={target}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      className={classes}
      data-inactive={inactive ? "true" : "false"}
      onClick={onClick}
      type="button"
    >
      {content}
    </button>
  );
}
