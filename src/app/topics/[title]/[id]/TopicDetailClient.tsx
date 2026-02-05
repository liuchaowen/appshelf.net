'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import Image from 'next/image';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import TopDownloads from '@/components/top-downloads';
import EditorsChoice from '@/components/editors-choice';

interface Breadcrumb {
    text: string;
    url: string;
}

interface AppDetails {
    rating: string;
    version: string;
    developer: string;
}

interface App {
    url: string;
    icon: string;
    data_info: string;
    title: string;
    category: string;
    details: AppDetails;
    screenshot: string;
}

interface EditorItem {
    coverlink: string;
    img_src: string;
    edt_small_tag: string;
}

interface Topic {
    breadcrumb: Breadcrumb[];
    page_title: string;
    tags: string[];
    cover_image: string;
    article_html: string;
    article_text: string;
    apps: App[];
    editor_items: EditorItem[];
}

export default function TopicDetailClient({ title, id }: { title: string, id: string }) {
    const [topic, setTopic] = useState<Topic | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const getApp = (app: App) => {
        if (app.url) {
            window.open(app.url, '_self');
        }
    };

    useEffect(() => {
        fetch(`/assets/data/json/topic/${title}_${id}.json`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setTopic(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load topic data:', err);
                setError(true);
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

    if (error || !topic) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div>话题未找到</div>
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
                            <ol className="flex items-center gap-2 text-gray-600 overflow-x-auto overflow-y-hidden scrollbar-hide">
                                {topic.breadcrumb.map((item, index) => (
                                    <li key={index} className="flex items-center flex-shrink-0 whitespace-nowrap">
                                        {index > 0 && <span className="mx-1">›</span>}
                                        {item.url ? (
                                            <a href={item.url} className="hover:text-blue-600 transition-colors truncate max-w-[200px] md:max-w-xs">
                                                {item.text}
                                            </a>
                                        ) : (
                                            <span className="text-gray-900 font-medium truncate max-w-[200px] md:max-w-md">
                                                {item.text}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </nav>

                        {/* 标题 */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {topic.page_title}
                        </h1>

                        {/* 标签 */}
                        {topic.tags && topic.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {topic.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* 封面图 */}
                        {topic.cover_image && (
                            <div className="w-full h-64 md:h-96 relative mb-6">
                                <Image
                                    src={`${topic.cover_image}`}
                                    alt={topic.page_title}
                                    className="object-cover rounded-lg"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                                />
                            </div>
                        )}

                        {/* 话题内容 */}
                        <article className="bg-white rounded-lg overflow-hidden mb-8">
                            <div className="prose prose-lg max-w-none">
                                <span>{topic.article_text}</span>
                            </div>
                        </article>

                        {/* Apps列表 */}
                        {topic.apps && topic.apps.length > 0 && (
                            <div className="space-y-6 mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Apps</h2>
                                {topic.apps.map((app, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col md:flex-row gap-6 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300"
                                    >
                                        {/* 左列：App信息 - 50%宽度 */}
                                        <div className="flex flex-col md:w-1/2">
                                            {/* App头部信息 */}
                                            <div className="flex items-center gap-4 mb-6">
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_OSS_URL}/${app.icon}`}
                                                    alt={app.title}
                                                    className="rounded-2xl shadow-sm border border-gray-100"
                                                    width={80}
                                                    height={80}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
                                                        {app.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 font-medium">{app.category}</p>
                                                </div>
                                            </div>

                                            {/* App详细信息 */}
                                            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
                                                <div className="flex flex-col items-center">
                                                    <div className="flex items-center gap-1 text-lg font-bold text-gray-900 mb-1">
                                                        <span>{app.details.rating}</span>
                                                        <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-medium">Rating</div>
                                                </div>
                                                <div className="w-px h-10 bg-gray-200"></div>
                                                <div className="flex flex-col items-center">
                                                    <div className="text-base font-bold text-gray-900 mb-1">
                                                        {app.details.version}
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-medium">Version</div>
                                                </div>
                                                <div className="w-px h-10 bg-gray-200"></div>
                                                <div className="flex flex-col items-center flex-1 min-w-0">
                                                    <div className="text-sm font-bold text-gray-900 mb-1 truncate max-w-full">
                                                        {app.details.developer}
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-medium">Developer</div>
                                                </div>
                                            </div>

                                            {/* GET按钮 */}
                                            <div className="mt-auto">
                                                <Button variant="outline" className="w-full md:w-auto" onClick={() => getApp(app)} >
                                                    GET
                                                </Button>
                                            </div>
                                        </div>

                                        {/* 右列：App截图 - 50%宽度，Image占满 */}
                                        <div className="flex items-center justify-center md:w-1/2">
                                            <div className="relative w-full h-auto">
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_OSS_URL}/${app.screenshot}`}
                                                    alt={`${app.title} screenshot`}
                                                    className="w-full h-auto rounded-2xl shadow-lg border border-gray-100"
                                                    width={500}
                                                    height={800}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Editor's Choice 组件 */}
                        <div className="mt-8">
                            <EditorsChoice items={topic.editor_items || []} />
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
