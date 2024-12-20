/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { MobileNav } from "./mobile-nav";
import { Badge } from "./ui/badge";
import { siteConfig } from "@/config/site";
import { GithubIcon, TwitterIcon } from "lucide-react";
export function Header() {

  return (
    <header className="w-full sticky top-0 z-50 border-b bg-background">
      <div className="container mx-auto px-4 h-12 flex items-center justify-between">
        <MobileNav />
        <nav className="max-md:hidden flex items-center">
          <Link href="/" className="flex gap-3 items-center">
            <h1 className="text-lg font-medium tracking-tighter flex gap-1 items-center">
              {siteConfig.name}
            </h1>
            <Badge variant="outline" className="text-normal">
              Beta
            </Badge>
          </Link>
        </nav>
        <div className="flex gap-3 items-center justify-end ml-auto">
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Give a star on GitHub"
          >
            <Button
              variant="outline"
              size="sm"
              className="flex gap-3 items-center max-md:h-9 max-md:w-9 max-md:px-0"
              aria-label="Give a star on GitHub"
            >
              <span className="hidden md:block">Give a star</span>{" "}
              <GithubIcon />
            </Button>
          </Link>
          <Link
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Follow on Twitter"
          >
            <Button
              variant="outline"
              size="sm"
              className="flex gap-3 items-center max-md:h-9 max-md:w-9 max-md:px-0"
              aria-label="Follow on Twitter"
            >
              <span className="hidden md:block">Follow on</span>{" "}
              <TwitterIcon />
            </Button>
          </Link>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
