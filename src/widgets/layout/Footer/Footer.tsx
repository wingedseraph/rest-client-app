import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="sticky bottom-0 left-0 z-0 w-full bg-foreground text-background">
      <div className="flex h-fit w-full items-center justify-center md:h-80">
        <div className="relative flex h-full w-full items-start justify-end overflow-hidden px-12 py-12 text-right">
          <div className="sm:pace-x-16 flex flex-row space-x-12 text-xl sm:text-lg md:space-x-24 md:text-2xl md:leading-16 xl:text-4xl">
            <ul>
              <Link
                href="/rest-client"
                className="cursor-pointer hover:underline"
              >
                /rest-client
              </Link>
              <Link
                href="/variables"
                className="cursor-pointer hover:underline"
              >
                /variables
              </Link>
              <Link href="/history" className="cursor-pointer hover:underline">
                /history
              </Link>
            </ul>
            <ul>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/wingedseraph"
              >
                /github
              </a>
              <li className="flex w-fit items-center justify-center">/2025</li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://rs.school/courses/reactjs"
              >
                /
                <Image
                  src="/logo.webp"
                  alt="logo of rs school"
                  className="invert"
                  width={80}
                  height={80}
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
