import Image from 'next/image';
import Link from 'next/link';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="sticky bottom-0 left-0 z-0 w-full bg-foreground text-background">
      <div className="flex h-fit w-full items-center justify-center md:h-80">
        <div className="relative flex h-full w-full items-start justify-end overflow-hidden py-12 text-right">
          <div className="flex flex-row space-x-12 text-xl leading-4 sm:space-x-16 sm:text-lg md:space-x-24 md:text-xl md:leading-12 xl:text-3xl">
            <ul className="flex w-fit flex-col gap-0 text-left sm:gap-2">
              <Link
                href="/rest-client"
                className="cursor-pointer hover:underline"
              >
                {t('client')}
              </Link>
              <Link
                href="/variables"
                className="cursor-pointer hover:underline"
              >
                {t('variables')}
              </Link>
              <Link href="/history" className="cursor-pointer hover:underline">
                {t('history')}
              </Link>

              <li className="flex w-fit items-center justify-center">/2025</li>
            </ul>
            <ul className="flex w-fit flex-col gap-0 text-left sm:gap-2">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/wingedseraph"
              >
                /wing...
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/RobMarv1n"
              >
                /rob...
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/rustytrooper"
              >
                /rusty...
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://rs.school/courses/reactjs"
                className="flex h-8 w-10 items-center justify-center sm:h-16 sm:w-20"
              >
                <Image
                  src="/logo.webp"
                  alt="logo of rs school"
                  className="fixed right-0 bottom-0 invert"
                  width={100}
                  height={100}
                />
              </a>
            </ul>
          </div>
          <h2 className="absolute bottom-0 left-0 translate-y-1/3 text-[40px] sm:text-[80px] xl:text-[120px]">
            &#123; REST<span className="font-serif italic">ful</span>API &#125;
          </h2>
        </div>
      </div>
    </footer>
  );
}
