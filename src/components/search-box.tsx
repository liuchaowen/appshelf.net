'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/hooks/useSearch';

interface SearchBoxProps {
    variant?: 'inline' | 'drawer';
    onResultClick?: () => void;
}

export default function SearchBox({ variant = 'inline', onResultClick }: SearchBoxProps) {
    const router = useRouter();
    const { query, setQuery, results, isSearching, search } = useSearch();
    const [isFocused, setIsFocused] = useState(false);

    // 当查询变化时执行搜索
    useEffect(() => {
        search(query);
    }, [query, search]);

    const handleSearch = (item: any) => {
        const targetUrl = item.coverlink_href || item.url;
        if (targetUrl) {
            router.push(targetUrl);
            // 调用回调函数，关闭抽屉
            if (onResultClick) {
                onResultClick();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim()) {
            if (results.apps.length > 0) {
                handleSearch(results.apps[0]);
            } else if (results.games.length > 0) {
                handleSearch(results.games[0]);
            } else if (results.articles.length > 0) {
                handleSearch(results.articles[0]);
            }
        }
    };

    const handlePopularTag = (tag: string) => {
        setQuery(tag);
    };

    const popularTags = ['Games', 'Social Apps', 'Photo Editor', 'Music Player', 'Video Player'];

    const inputClass = variant === 'drawer'
        ? 'w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base'
        : 'w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm';

    const placeholder = variant === 'drawer' ? 'Search apps, games, articles...' : 'Search...';

    const showResults = variant === 'drawer' || (variant === 'inline' && isFocused);

    return (
        <div className={variant === 'drawer' ? 'w-full' : 'relative w-40 sm:w-64'}>
            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={handleKeyDown}
                    className={inputClass}
                    autoFocus={variant === 'drawer'}
                />
                <svg
                    className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${variant === 'drawer' ? 'right-4' : 'right-3'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {/* Popular tags for drawer variant */}
            {variant === 'drawer' && !query && (
                <div className="mt-6">
                    <p className="text-sm text-gray-500 mb-3">Popular Searches</p>
                    <div className="flex flex-wrap gap-2">
                        {popularTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => handlePopularTag(tag)}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {query && showResults && (
                <div className={`bg-white border border-gray-200 rounded-lg shadow-lg z-50 ${variant === 'drawer' ? 'mt-6' : 'absolute top-full mt-2 w-full'}`}>
                    {isSearching ? (
                        <div className="p-4 text-center text-gray-500">Searching...</div>
                    ) : (
                        <>
                            {/* Apps Results */}
                            {results.apps.length > 0 && (
                                <div className="border-b border-gray-100">
                                    <div className="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">Apps</div>
                                    <div className="p-2 max-h-64 overflow-y-auto">
                                        {results.apps.slice(0, 8).map((app, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleSearch(app)}
                                                className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors"
                                            >
                                                <img src={`/${app.hidden_img_src}`} alt={app.name} className="w-10 h-10 rounded" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-sm text-gray-900">{app.name}</div>
                                                    <div className="text-xs text-gray-500">{app.cate}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Games Results */}
                            {results.games.length > 0 && (
                                <div className="border-b border-gray-100">
                                    <div className="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">Games</div>
                                    <div className="p-2 max-h-64 overflow-y-auto">
                                        {results.games.slice(0, 8).map((game, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleSearch(game)}
                                                className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors"
                                            >
                                                <img src={`/${game.hidden_img_src}`} alt={game.name} className="w-10 h-10 rounded" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-sm text-gray-900">{game.name}</div>
                                                    <div className="text-xs text-gray-500">{game.cate}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Articles Results */}
                            {results.articles.length > 0 && (
                                <div>
                                    <div className="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">Articles</div>
                                    <div className="p-2 max-h-64 overflow-y-auto">
                                        {results.articles.slice(0, 8).map((article, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleSearch(article)}
                                                className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors"
                                            >
                                                <img src={`/${article.image}`} alt={article.title} className="w-10 h-10 object-cover rounded" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-sm text-gray-900 line-clamp-2">{article.title}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No Results */}
                            {results.apps.length === 0 && results.games.length === 0 && results.articles.length === 0 && (
                                <div className="p-8 text-center text-gray-500">
                                    <p className="text-sm">No results found for "{query}"</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}