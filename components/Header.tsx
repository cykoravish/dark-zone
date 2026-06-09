'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">DZ</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline">Dark Zone</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-foreground hover:text-primary transition-colors">
              Shop
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:bg-secondary transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Cart</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-md transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-2 text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-2 text-foreground hover:text-primary transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-2 text-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
