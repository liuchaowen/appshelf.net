'use client';

import React, { useEffect, useState } from 'react';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import TopDownloads from '@/components/top-downloads';

import {
    BreadcrumbNav,
    CategoryItemsGrid,
    Breadcrumb,
    CategoryItem,
} from '@/components/category-share';

interface CategoryData {
    category_slug: string;
    category_num: string;
    url: string;
    breadcrumb: { text: string; link: string }[];
    title: string;
    total_items: number;
    total_pages: number;
    items: CategoryItem[];
}

export default function CategoryDetailClient({
    slug,
    id,
}: {
    slug: string;
    id: string;
}) {
    const [items, setItems] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
    const [title, setTitle] = useState<string>('');
    const [totalItems, setTotalItems] = useState<number>(0);

    useEffect(() => {
        if (!slug || !id) {
            setError('Missing slug or id');
            setLoading(false);
            return;
        }

        async function fetchCategoryItems() {
            setLoading(true);
            setError(null);
            try {
                const homeRes = await fetch('/assets/data/json/home.json');
                if (!homeRes.ok) {
                    throw new Error(`Failed to fetch home.json: ${homeRes.status}`);
                }
                const homeData = await homeRes.json();

                // 查找section_link匹配当前slug和id的section
                const sectionLink = `/hot/${slug}/${id}`;
                const section = homeData.find((s: any) => s.section_link === sectionLink);

                if (!section) {
                    throw new Error(`Section not found for link: ${sectionLink}`);
                }
                setItems(section.items || []);
                setTitle(section.section_title || '');
                setTotalItems(section.items?.length || 0);

                setBreadcrumbs([
                    {
                        "label": "Home",
                        "href": "/"
                    },
                    {
                        "label": section.section_title,
                        "href": sectionLink
                    }
                ]);
            } catch (err: any) {
                setError(err.message || 'Unknown error');
                setItems([]);
            } finally {
                setLoading(false);
            }
        }

        fetchCategoryItems();
    }, [slug, id]);

    const start = 1;
    const end = items.length > 9 ? 9 : items.length;

    return (
        <>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* 左侧主内容区 */}
                <section className="flex-1">
                    {/* 面包屑导航 */}
                    <BreadcrumbNav breadcrumbs={breadcrumbs} />

                    {/* 分类标题 */}
                    <h1 className="text-xl font-bold mb-2">{title}</h1>

                    {/* 区间显示 */}
                    <p className="text-gray-600 mb-6 text-xs">
                        Top {start} ~ {end}{' '}
                        <span className="text-gray-400">/ Total {totalItems ?? items.length}</span>
                    </p>

                    {/* 加载和错误提示 */}
                    {error && <p className="text-red-500">加载失败: {error}</p>}

                    {/* 3x3 apk列表 */}
                    {!loading && !error && (
                        <CategoryItemsGrid items={items} sliceStart={0} sliceEnd={9} />
                    )}

                    {/* 分页查看更多按钮 */}
                    <div className="mt-6">
                        <a
                            href={`/hot/${slug}.html?page=2`}
                            className="block w-full text-center bg-blue-400 hover:bg-blue-200 text-white py-3 rounded-3xl"
                        >
                            Show More {title}
                        </a>
                    </div>
                </section>

                {/* 右侧 aside */}
                <aside className="w-full lg:w-72 mt-6 lg:mt-0">
                    <TopDownloads limit={10} />
                </aside>
            </main>
            <Footer />
        </>
    );
}