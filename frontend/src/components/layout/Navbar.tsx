import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiSearch, FiMenu, FiX } from 'react-icons/fi';

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/deals?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-darker-grey border-b border-grey">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/waferlee-logo.png"
              alt="WiseLife Logo"
              className="h-15 w-auto"
            />
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-light-grey w-4 h-4" />
              <Input
                type="text"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-grey border-none text-white placeholder:text-light-grey focus-visible:ring-1 focus-visible:ring-green"
              />
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/deals"
              className="text-white hover:text-green transition-colors">
              Deals
            </Link>
            <Link
              to="/coupons"
              className="text-white hover:text-green transition-colors">
              Coupons
            </Link>
            <Link to="/dashboard/submit-deal">
              <Button className="bg-green hover:bg-green/90 text-white font-medium px-4 cursor-pointer">
                + Submit deal
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                variant="outline"
                className="border-light-grey text-white hover:bg-grey cursor-pointer">
                Dashboard
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu">
            {isMobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-light-grey w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-grey border-none text-white placeholder:text-light-grey"
                />
              </div>
            </form>

            {/* Mobile Links */}
            <div className="flex flex-col gap-3">
              <Link
                to="/deals"
                className="text-white hover:text-green transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}>
                Deals
              </Link>
              <Link
                to="/coupons"
                className="text-white hover:text-green transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}>
                Coupons
              </Link>
              <Link
                to="/dashboard/submit-deal"
                onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="bg-green hover:bg-green/90 text-white font-medium w-full cursor-pointer">
                  + Submit deal
                </Button>
              </Link>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="border-light-grey text-white hover:bg-grey w-full cursor-pointer">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
