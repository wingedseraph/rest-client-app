'use client';
import { type RefObject, useEffect, useRef, useState } from 'react';

type StickyState = {
  isSticky: boolean;
  offset: number;
};

export default function useScroll<T extends HTMLElement>(): {
  sticky: StickyState;
  headerRef: RefObject<T | null>;
} {
  const [sticky, setSticky] = useState<StickyState>({
    isSticky: false,
    offset: 0,
  });
  const headerRef = useRef<T>(null);
  const offsetTopRef = useRef(0);
  const heightRef = useRef(0);

  useEffect(() => {
    if (!headerRef.current) return;

    const node = headerRef.current;
    const rect = node.getBoundingClientRect();
    offsetTopRef.current = rect.top + window.scrollY;
    heightRef.current = rect.height;

    const handleScroll = () => {
      const shouldStick =
        window.scrollY > offsetTopRef.current + heightRef.current;
      setSticky((prev) => {
        if (prev.isSticky === shouldStick) return prev;
        return {
          isSticky: shouldStick,
          offset: shouldStick ? heightRef.current : 0,
        };
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { sticky, headerRef };
}
