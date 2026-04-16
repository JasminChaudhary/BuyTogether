"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown, Home, Building2, Users, Info, User } from "lucide-react";
function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container mx-auto flex h-16 items-center justify-between px-4">
      {
        /* Logo */
      }
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Users className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">BuyTogether</span>
      </Link>

      {
        /* Desktop Navigation */
      }
      <nav className="hidden items-center gap-1 md:flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-1">
              Browse <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem asChild>
              <Link href="/properties" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Properties
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dealerships" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Car Dealerships
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" asChild>
          <Link href="/how-it-works">How It Works</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/groups">Buying Groups</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/about">About</Link>
        </Button>
      </nav>

      {
        /* Desktop Actions */
      }
      <div className="hidden items-center gap-2 md:flex">
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <User className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
        <Button asChild>
          <Link href="/groups/create">Start a Group</Link>
        </Button>
      </div>

      {
        /* Mobile Menu Button */
      }
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
    </div>

    {
      /* Mobile Menu */
    }
    {mobileMenuOpen && <div className="border-t border-border bg-background md:hidden">
      <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
        <Link
          href="/properties"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-foreground hover:bg-muted"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Home className="h-4 w-4" />
          Properties
        </Link>
        <Link
          href="/dealerships"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-foreground hover:bg-muted"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Building2 className="h-4 w-4" />
          Car Dealerships
        </Link>
        <Link
          href="/how-it-works"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-foreground hover:bg-muted"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Info className="h-4 w-4" />
          How It Works
        </Link>
        <Link
          href="/groups"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-foreground hover:bg-muted"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Users className="h-4 w-4" />
          Buying Groups
        </Link>
        <Link
          href="/about"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-foreground hover:bg-muted"
          onClick={() => setMobileMenuOpen(false)}
        >
          About
        </Link>
        <hr className="my-2 border-border" />
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-foreground hover:bg-muted"
          onClick={() => setMobileMenuOpen(false)}
        >
          <User className="h-4 w-4" />
          Dashboard
        </Link>
        <Button asChild className="mt-2">
          <Link href="/groups/create" onClick={() => setMobileMenuOpen(false)}>
            Start a Group
          </Link>
        </Button>
      </nav>
    </div>}
  </header>;
}
export {
  Header
};
