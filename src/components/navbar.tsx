'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBox from './search-box';
import { Search, X } from 'lucide-react';

export const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Top Rank', href: '/top-rank.html' },
    { label: 'Apps', href: '/apps.html', hasSubmenu: true },
    { label: 'Games', href: '/games.html', hasSubmenu: true },
    { label: 'Featured', href: '/featured.html' },
    { label: 'Articles', href: '/articles.html' }
];

interface Category {
    id: number;
    slug: string;
    title: string;
    icon: string;
    url: string;
}

interface CategoryData {
    app: Category[];
    game: Category[];
}

export default function Navbar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [mobileOpenSubmenu, setMobileOpenSubmenu] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryData>({ app: [], game: [] });

    useEffect(() => {
        fetch('/assets/data/json/category.json')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error('Failed to load categories:', err));
    }, []);

    const toggleMobileSubmenu = (label: string) => {
        setMobileOpenSubmenu(mobileOpenSubmenu === label ? null : label);
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and hamburger menu */}
                    <div className="flex items-center ">
                        <button
                            className="md:hidden mr-3 p-2 rounded-md hover:bg-gray-100"
                            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <Link className="logo-navbar" href="/" title="Best App News &amp; Free APK Download"></Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {menuItems.map((item) => (
                            <div key={item.label} className="relative submenu-container">
                                <Link
                                    href={item.href}
                                    className="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors"
                                >
                                    {item.label}
                                </Link>
                            </div>
                        ))}
                    </nav>

                    {/* Search Box - 使用 SearchBox 组件 */}
                    <div className="flex items-center">
                        {/* Search icon button for all screens */}
                        <button
                            className="items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Open search"
                        >
                            <Search className='w-6 h-6' />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            {isDrawerOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-transparent z-40 md:hidden"
                        onClick={() => setIsDrawerOpen(false)}
                    />
                    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-lg md:hidden transform transition-transform">
                        <div className="p-4">
                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className="mb-6 p-2 rounded-md hover:bg-gray-100"
                                aria-label="Close menu"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <nav className="flex flex-col space-y-2">
                                {menuItems.map((item) => (
                                    <div key={item.label}>
                                        {item.hasSubmenu ? (
                                            <>
                                                <button
                                                    onClick={() => toggleMobileSubmenu(item.label)}
                                                    className="w-full flex items-center justify-between text-gray-700 hover:text-blue-600 font-medium text-sm py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                                                >
                                                    {item.label}
                                                    <svg
                                                        className={`w-4 h-4 transition-transform ${mobileOpenSubmenu === item.label ? 'rotate-180' : ''}`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                                {mobileOpenSubmenu === item.label && (
                                                    <div className="ml-4 mt-2 space-y-1">
                                                        {(item.label === 'Apps' ? categories.app : categories.game).map((category) => (
                                                            <Link
                                                                key={category.id}
                                                                href={`/categories/${category.slug}/${category.id}.html`}
                                                                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
                                                                onClick={() => {
                                                                    setIsDrawerOpen(false);
                                                                    setMobileOpenSubmenu(null);
                                                                }}
                                                            >
                                                                <img src={`${process.env.NEXT_PUBLIC_OSS_URL}/${category.icon}`} alt={category.title} className="w-5 h-5" />
                                                                <span className="text-sm text-gray-600">{category.title}</span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                className="block text-gray-700 hover:text-blue-600 font-medium text-sm py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                                                onClick={() => setIsDrawerOpen(false)}
                                            >
                                                {item.label}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </div>
                </>
            )}

            {/* Search Drawer - slides from right */}
            {isSearchOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-transparent z-40"
                        onClick={() => setIsSearchOpen(false)}
                    />
                    <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-lg transform transition-transform">
                        <div className="p-6">
                            {/* Header with close button */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-800">Search</h2>
                            </div>

                            {/* SearchBox component for drawer */}
                            <div className="w-full mt-2">
                                <SearchBox variant="drawer" onResultClick={() => setIsSearchOpen(false)} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
}
