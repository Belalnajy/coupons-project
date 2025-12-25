import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaYoutube, FaLinkedin } from 'react-icons/fa';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Sign In', href: '/login' },
    { label: 'How it Works', href: '/how-it-works' },
    { label: 'Submit a Deal', href: '/submit-deal' },
    { label: 'Contact us', href: '/contact' },
  ];

  const categories = [
    { label: 'Electronics', href: '/deals?category=electronics' },
    { label: 'Fashion', href: '/deals?category=fashion' },
    { label: 'Gaming', href: '/deals?category=gaming' },
    { label: 'Home&Garden', href: '/deals?category=home-garden' },
  ];

  const legal = [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Guidelines', href: '/guidelines' },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube' },
    { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-darker-grey text-white border-t border-grey">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src="/waferlee-logo.png"
                alt="WiseLife Logo"
                className="h-15 w-auto"
              />
            </Link>
            <p className="text-light-grey text-sm mb-6 max-w-xs">
              Your #1 community for deals, coupons and discounts. Shop the best
              offers and save more every day!
            </p>
            {/* Social Media Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-grey rounded-full flex items-center justify-center hover:bg-green transition-colors"
                  aria-label={social.label}>
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-light-grey hover:text-green transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.label}>
                  <Link
                    to={category.href}
                    className="text-light-grey hover:text-green transition-colors text-sm">
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {legal.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-light-grey hover:text-green transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-grey pt-6">
          <p className="text-light-grey text-sm text-center">
            © {currentYear} WiseLife. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
