'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar, { menuItems } from '@/components/navbar';
import Footer from '@/components/footer';

interface Article {
    id: number;
    type: number;
    link: string;
    title: string;
    cover: string;
    updated_at: string;
    seo_keyword: string;
    keyword: string[];
    icon: string | null;
    writer_name: string;
    info: string;
}

interface CategoryData {
    [key: string]: string;
}

export default function ArticlesPage() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<CategoryData>({});
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>('All');

    useEffect(() => {
        // 加载文章数据
        loadArticles();

        // 加载分类数据
        fetch('/assets/data/json/article/more/cate.json')
            .then(res => res.json())
            .then(data => {
                setCategories(data);
            })
            .catch(err => {
                console.error('Failed to load categories:', err);
            });
    }, []);

    // 加载文章数据
    const loadArticles = (categoryId?: string) => {
        setIsLoading(true);
        const url = categoryId
            ? `/assets/data/json/article/more/${categoryId}.json`
            : '/assets/data/json/article.json';

        fetch(url)
            .then(res => res.json())
            .then(data => {
                // 如果是分类数据，需要从 data.data 中获取
                const articlesData = categoryId ? data.data : data;

                // 转换数据格式：url -> link, image -> cover
                const transformedArticles = articlesData.map((item: any) => ({
                    ...item,
                    link: item.link || item.url,
                    cover: item.cover || item.image
                }));

                setArticles(transformedArticles);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to load articles:', err);
                setIsLoading(false);
            });
    };

    // 处理分类点击
    const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>, key: string, value: string) => {
        e.preventDefault();
        setActiveCategory(key);
        if (key === 'All') {
            loadArticles();
        } else {
            loadArticles(value);
        }
    };


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
            <main className="flex-1 max-w-7xl lg:mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

                {/* Category Navigation */}
                <div className="mb-4 sm:mb-6 lg:mb-8 overflow-x-auto overflow-y-hidden -mx-3 sm:mx-0" >
                    <div className="flex space-x-1.5 sm:space-x-2 px-3 sm:px-0 pb-2 min-w-max">
                        {Object.entries(categories).map(([key, value]) => (
                            <a
                                key={key}
                                href=""
                                onClick={(e) => handleCategoryClick(e, key, value)}
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer select-none ${activeCategory === key
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {key}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Articles Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                        {articles.map((article, index) => (
                            <a
                                key={article.id || index}
                                href={article.link}
                                rel="noopener noreferrer"
                                className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:border-blue-500"
                            >
                                {/* Article Image */}
                                <div className="flex aspect-[3/2] sm:aspect-[16/9] relative overflow-hidden bg-gray-100">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_OSS_URL}/${article.cover}`}
                                        alt={article.title}
                                        fill
                                        className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                        sizes=" 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        priority={index < 4}
                                        loading={index < 4 ? 'eager' : 'lazy'}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/assets/img/not_found_img.png';
                                        }}
                                    />
                                </div>

                                {/* Article Title */}
                                <div className="p-3 sm:p-4">
                                    <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {article.title}
                                    </h3>
                                </div>
                            </a>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && articles.length === 0 && (
                    <div className="text-center py-8 sm:py-12">
                        <svg
                            className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">No articles found</h3>
                        <p className="mt-1 text-xs sm:text-sm text-gray-500">Try selecting a different category.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

