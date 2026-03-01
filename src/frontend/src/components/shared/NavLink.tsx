import type { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
}

/**
 * Simple anchor-based navigation for hash router.
 * href should NOT include the # (it's added automatically).
 */
export function NavLink({
  href,
  children,
  className,
  onClick,
  "aria-label": ariaLabel,
}: NavLinkProps) {
  const fullHref = href.startsWith("http") ? href : `#${href}`;

  return (
    <a
      href={fullHref}
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}
