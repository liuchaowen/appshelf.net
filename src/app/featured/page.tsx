'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

interface AppInfo {
    icon: string;
    name: string;
    ratings: string;
    downloads: string;
    link: string;
}

interface TopicData {
    id: number;
    title: string;
    description: string;
    link: string;
    app_info: AppInfo[];
}

interface App {
    icon: string;
    name: string;
    rating: string;
    downloads: string;
    url: string;
}

interface FeaturedItem {
    title: string;
    content: string;
    count: string;
    url: string;
    apps: App[];
}

export default function FeaturedPage() {
    const router = useRouter();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [featuredData, setFeaturedData] = useState<FeaturedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState<Record<string, string>>({});
    const [activeCategory, setActiveCategory] = useState<string>('All');

    const menuItems = [
        { label: 'Home', href: '/' },
        { label: 'Apps', href: '/apps.html' },
        { label: 'Games', href: '/games.html' },
        { label: 'Articles', href: '/articles.html' },
        { label: 'Featured', href: '/featured.html' },
        { label: 'Top Rank', href: '/top-rank.html' }
    ];

    useEffect(() => {
        // 加载初始数据
        loadFeaturedData();

        // 加载分类数据
        fetch('/assets/data/json/topic/more/cate.json')
            .then(res => res.json())
            .then(data => {
                setCategories(data);
            })
            .catch(err => {
                console.error('Failed to load categories:', err);
            });
    }, []);

    // 加载特色数据
    const loadFeaturedData = (categoryValue?: string) => {
        setIsLoading(true);
        const url = categoryValue
            ? `/assets/data/json/topic/more/${categoryValue}.json`
            : '/assets/data/json/featured.json';

        fetch(url)
            .then(res => res.json())
            .then(data => {
                // 如果是分类数据，需要转换数据结构
                if (categoryValue) {
                    const transformedData: FeaturedItem[] = data.data.map((item: TopicData) => ({
                        title: item.title,
                        content: item.description,
                        count: `${item.app_info.length} applications`,
                        url: item.link,
                        apps: item.app_info.slice(0, 3).map((app: AppInfo) => ({
                            icon: app.icon,
                            name: app.name,
                            rating: app.ratings,
                            downloads: app.downloads,
                            url: app.link
                        }))
                    }));
                    setFeaturedData(transformedData);
                } else {
                    setFeaturedData(data);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to load featured data:', err);
                setIsLoading(false);
            });
    };

    // 处理分类点击
    const handleCategoryClick = (e: React.MouseEvent<HTMLButtonElement>, category: string) => {
        e.preventDefault();
        setActiveCategory(category);
        const categoryValue = categories[category];

        // 如果是 All，加载默认数据
        if (categoryValue === '-') {
            loadFeaturedData();
        } else {
            loadFeaturedData(categoryValue);
        }
    };

    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden">
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
            <main className="flex-1 max-w-7xl lg:mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Category Navigation */}
                <div className="mb-4 lg:mb-8 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth">
                    <div className="flex space-x-4 min-w-max pb-2 select-none">
                        {Object.keys(categories).map((category) => (
                            <button
                                key={category}
                                onClick={(e) => handleCategoryClick(e, category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeCategory === category
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured Items Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredData.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 hover:shadow-lg transition-shadow"
                            >
                                {/* Title and Content */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-3">
                                        {item.content}
                                    </p>
                                </div>

                                {/* Count and Check Button */}
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                                    <span className="text-xs sm:text-sm text-gray-500 font-medium">
                                        {item.count}
                                    </span>
                                    <a
                                        href={item.url}
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
                                    >
                                        Check
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                </div>

                                {/* Apps List */}
                                <div className="space-y-3">
                                    {item.apps.map((app, appIdx) => (
                                        <div
                                            key={appIdx}
                                            className="flex items-center justify-between space-x-2 sm:space-x-3"
                                        >
                                            {/* Left: Icon and Info */}
                                            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 relative rounded-lg overflow-hidden bg-gray-100">
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_OSS_URL}/${app.icon}`}
                                                        alt={app.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="40px, 48px"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                                        {app.name}
                                                    </h4>
                                                    <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-gray-500">
                                                        <div className="flex items-center">
                                                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 mr-0.5 sm:mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                            <span className="truncate">{app.rating}</span>
                                                        </div>
                                                        <span>|</span>
                                                        <span className="truncate">{app.downloads}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Get Button */}
                                            <a
                                                href={app.url}
                                                rel="noopener noreferrer"
                                                className="flex-shrink-0 px-3 sm:px-4 py-1 sm:py-1.5 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-green-700 transition-colors"
                                            >
                                                Get
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
