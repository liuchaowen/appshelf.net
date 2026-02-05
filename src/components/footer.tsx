import Link from 'next/link';

const footerLinks = ['Home', 'Disclaimer', 'About Us', 'Privacy Policy', 'Terms of Service'];

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col items-center space-y-6">
                    {/* Logo and Description */}
                    <div className="flex flex-col items-center space-y-3">
                        <Link className="logo-footer" href="/" title="Best App News &amp; Free APK Download"></Link>
                        <p className="text-gray-600 text-center max-w-2xl">
                            Appshelf - Discover new apps and games, download instantly, and install with confidence.
                        </p>
                    </div>

                    {/* Footer Links - Hidden on small screens */}
                    <nav className="hidden sm:flex items-center space-x-6">
                        {footerLinks.map((link) => (
                            <a
                                key={link}
                                href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                {link}
                            </a>
                        ))}
                    </nav>

                    {/* Copyright */}
                    <div className="text-sm text-gray-500 text-center pt-4 border-t border-gray-200 w-full">
                        © {new Date().getFullYear()} Appshelf. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}