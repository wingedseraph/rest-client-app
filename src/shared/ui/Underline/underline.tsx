import type { ReactNode } from 'react';

export const UnderlineText = (chunks: ReactNode) => (
  <span className="relative mx-1 inline-block stroke-current font-extrabold">
    {chunks}
    <svg
      className="-bottom-0.5 absolute max-h-1.5 w-full"
      viewBox="0 0 55 5"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <title>Underline</title>
      <path
        d="M0.652466 4.00002C15.8925 2.66668 48.0351 0.400018 54.6853 2.00002"
        strokeWidth="2"
      ></path>
    </svg>
  </span>
);
