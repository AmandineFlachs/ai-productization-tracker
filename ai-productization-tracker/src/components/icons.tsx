import type { ReactNode } from 'react';

type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
  fill?: string;
};

function Icon({
  d,
  size = 14,
  className = '',
  strokeWidth = 1.5,
  fill = 'none',
}: IconProps & { d: string | ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {typeof d === 'string' ? <path d={d} /> : d}
    </svg>
  );
}

export const IconChevron = (p: IconProps) => <Icon {...p} d="M6 9l6 6 6-6" />;
export const IconArrowUR = (p: IconProps) => <Icon {...p} d="M7 17 17 7 M9 7h8v8" />;
export const IconClose = (p: IconProps) => <Icon {...p} d="M6 6l12 12 M18 6 6 18" />;
export const IconCheck = (p: IconProps) => <Icon {...p} d="M4 12l5 5 11-12" />;
export const IconSort = (p: IconProps) => (
  <Icon {...p} d="M7 4v16 M3 8l4-4 4 4 M17 20V4 M13 16l4 4 4-4" />
);
export const IconSun = (p: IconProps) => (
  <Icon
    {...p}
    d={
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M4.93 19.07l1.41-1.41 M17.66 6.34l1.41-1.41" />
      </>
    }
  />
);
export const IconMoon = (p: IconProps) => (
  <Icon {...p} d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
);
export const IconSearch = (p: IconProps) => (
  <Icon
    {...p}
    d={
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    }
  />
);
