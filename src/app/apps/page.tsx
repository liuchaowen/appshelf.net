'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar, { menuItems } from '@/components/navbar';
import Footer from '@/components/footer';
import TopDownloads from '@/components/top-downloads';
import { Star } from 'lucide-react';

interface Category {
    id: number;
    slug: string;
    title: string;
    icon: string;
    url: string;
}

interface AppItem {
    link: string;
    icon: string;
    name: string;
    categoryLink: string;
    category: string;
    rating: string;
}

interface TopNewData {
    top: AppItem[];
    new: AppItem[];
}

export default function AppsPage() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [topDownloads, setTopDownloads] = useState<AppItem[]>([]);
    const [newApps, setNewApps] = useState<AppItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/assets/data/json/category.json').then(res => res.json()),
            fetch('/assets/data/json/top-new.json').then(res => res.json())
        ])
            .then(([categoryData, topNewData]: [{ app: Category[], game: Category[] }, TopNewData]) => {
                setCategories(categoryData.app);
                setTopDownloads(topNewData.top);
                setNewApps(topNewData.new);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to load data:', err);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            {/* Mobile Drawer */}
            {isDrawerOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
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
                            <nav className="flex flex-col space-y-4">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="text-gray-700 hover:text-blue-600 font-medium text-sm py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                                        onClick={() => setIsDrawerOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </>
            )}

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* App Categories - Takes 2 columns on large screens */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg">
                                <h2 className="text-2xl text-gray-900 mb-6 flex items-center">
                                    App Categories
                                </h2>

                                <div className="grid grid-cols-2 gap-2">
                                    {categories.map((category) => (
                                        <a
                                            key={category.id}
                                            href={`${category.url}.html`}
                                            rel="noopener noreferrer"
                                            className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                                        >
                                            <div className="flex-shrink-0 w-6 h-6 mr-3 relative">
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_OSS_URL}/${category.icon}`}
                                                    alt={category.title}
                                                    fill
                                                    className="object-contain"
                                                    sizes="24px"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate">
                                                    {category.title}
                                                </h3>
                                            </div>
                                            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Top Downloads - Takes 1 column on large screens */}
                        <div className="lg:col-span-1">
                            <TopDownloads />
                        </div>

                        {/* New Apps - Full width */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg">
                                <h2 className="text-2xl text-gray-900 mb-6 flex items-center">
                                    New Apps
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {newApps.map((app, index) => (
                                        <a
                                            key={index}
                                            href={`${app.link}.html`}
                                            rel="noopener noreferrer"
                                            className="flex flex-col p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all group"
                                        >
                                            <div className="w-16 h-16 mx-auto mb-3 relative bg-gray-100 rounded-lg overflow-hidden">
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_OSS_URL}/${app.icon}`}
                                                    alt={app.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="64px"
                                                />
                                            </div>
                                            <h3 className="text-sm font-medium text-gray-900 text-center truncate group-hover:text-purple-600 mb-2">
                                                {app.name}
                                            </h3>
                                            <div className="flex items-center justify-center text-xs text-gray-500 mb-1">
                                                {app.category}
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <span className="text-xs text-gray-600">{app.rating}</span>
                                                <Star className="ml-1 w-3 h-3 text-gray-400 fill-gray-400" />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}