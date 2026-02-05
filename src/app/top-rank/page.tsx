'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar, { menuItems } from '@/components/navbar';
import Footer from '@/components/footer';
import { Star } from 'lucide-react';


interface RankItem {
    type: 'app' | 'game';
    rank: number;
    name: string;
    category: string;
    url: string;
    img: string;
}

interface TopRankData {
    apps: RankItem[];
    games: RankItem[];
    stats: {
        total_apps: number;
        total_games: number;
        total: number;
    };
}

export default function TopRankPage() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [topRankData, setTopRankData] = useState<TopRankData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 加载top-rank.json数据
    useEffect(() => {
        fetch('/assets/data/json/top-rank.json')
            .then(res => res.json())
            .then(data => {
                setTopRankData(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to load top rank data:', err);
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
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Top Rank</h1>
                    <p className="text-gray-600">Discover the most popular apps and games</p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                    </div>
                ) : topRankData ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Apps List */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                    <svg className="w-6 h-6 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                    </svg>
                                    Top Apps
                                </h2>
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                    {topRankData.stats.total_apps} apps
                                </span>
                            </div>

                            <div className="space-y-3">
                                {topRankData.apps.map((app) => (
                                    <a
                                        key={app.rank}
                                        href={app.url}
                                        rel="noopener noreferrer"
                                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                            <span className="text-lg font-bold text-gray-400 group-hover:text-blue-600">
                                                {app.rank}
                                            </span>
                                        </div>
                                        <div className="flex-shrink-0 w-12 h-12 mx-3 relative bg-gray-100 rounded-lg overflow-hidden">
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_OSS_URL}/${app.img}`}
                                                alt={app.name}
                                                fill
                                                className="object-cover"
                                                sizes="48px"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                                                {app.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 truncate">{app.category}</p>
                                        </div>
                                        <span className="flex-shrink-0 px-3 sm:px-4 py-1 sm:py-1.5 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-green-700 transition-colors">
                                            Get
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Games List */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                    <svg className="w-6 h-6 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                                    </svg>
                                    Top Games
                                </h2>
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                    {topRankData.stats.total_games} games
                                </span>
                            </div>

                            <div className="space-y-3">
                                {topRankData.games.map((game) => (
                                    <a
                                        key={game.rank}
                                        href={game.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                            <span className="text-lg font-bold text-gray-400 group-hover:text-purple-600">
                                                {game.rank}
                                            </span>
                                        </div>
                                        <div className="flex-shrink-0 w-12 h-12 mx-3 relative bg-gray-100 rounded-lg overflow-hidden">
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_OSS_URL}/${game.img}`}
                                                alt={game.name}
                                                fill
                                                className="object-cover"
                                                sizes="48px"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-purple-600">
                                                {game.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 truncate">{game.category}</p>
                                        </div>
                                        <Star className="ml-1 w-3 h-3 text-gray-400 fill-gray-400" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-gray-500">Failed to load data</div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}