'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import TopDownloads from '@/components/top-downloads';
import EditorsChoice from '@/components/editors-choice';

interface EditorsChoiceItem {
    id: string;
    coverlink: string;
    edt_small_tag: string;
    img_src: string;
    title: string;
}

interface Article {
    title: string;
    image?: string;
    author: string;
    publishDate: string;
    category: string;
    content: string;
    review_html?: string;
    editor_box_items?: EditorsChoiceItem[];
}

export default function ArticleDetailClient({ title, id }: { title: string, id: string }) {
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch(`/assets/data/json/article/${title}_${id}.json`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setArticle(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load detail data:', err);
                setLoading(false);
            });
    }, [title, id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div>文章未找到</div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 左侧内容区域 */}
                    <div className="lg:col-span-2">
                        {/* 面包屑导航 */}
                        <nav className="mb-6 text-sm">
                            <ol className="flex items-center space-x-2 text-gray-600">
                                <li>
                                    <a href="/" className="hover:text-blue-600 transition-colors">
                                        Home
                                    </a>
                                </li>
                                <li>›</li>
                                <li>
                                    <a href="/articles.html" className="hover:text-blue-600 transition-colors">
                                        Topic
                                    </a>
                                </li>
                                <li>›</li>
                                <li className="text-gray-900 font-medium truncate max-w-md">
                                    {article.title}
                                </li>
                            </ol>
                        </nav>

                        {/* 文章内容 */}
                        <article className="bg-white rounded-lg overflow-hidden">
                            {/* 文章头图 */}
                            {article.image && (
                                <div className="w-full h-64 md:h-96 relative">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* 文章信息 */}
                            <div className="p-6 md:p-8">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    {article.title}
                                </h1>

                                {/* 文章正文 */}
                                {article.review_html && (
                                    <div
                                        className="prose prose-lg max-w-none"
                                        dangerouslySetInnerHTML={{ __html: article.review_html }}
                                    />
                                )}
                            </div>
                        </article>

                        {/* Editor's Choice 组件 */}
                        <div className="mt-8">
                            <EditorsChoice items={article.editor_box_items || []} />
                        </div>
                    </div>

                    {/* 右侧 Top Downloads */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <TopDownloads />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}