'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

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

function CategoryItemsPagination({
    slug,
    items,
    totalPages,
    totalItems,
    title,
}: {
    slug: string;
    items: CategoryItem[];
    totalPages: number;
    totalItems: number;
    title: string;
}) {
    const sp = useSearchParams();
    const page = Number(sp.get('page') ?? 1);
    console.log('page:', page);
    const start = (page - 1) * 9 + 1;
    const end = items.length > (page - 1) * 9 + 9 ? (page - 1) * 9 + 9 : items.length;
    const isLastPage = page >= totalPages;

    return (
        <>
            {/* 区间显示 */}
            <p className="text-gray-600 mb-6 text-xs">
                Top {start} ~ {end}{' '}
                <span className="text-gray-400">/ Total {totalItems ?? items.length}</span>
            </p>

            {/* 3x3 apk列表 */}
            {items.length > 0 && <CategoryItemsGrid items={items} sliceStart={start - 1} sliceEnd={end} />}

            {/* 分页查看更多按钮 */}
            {!isLastPage && items.length > 0 && (
                <div className="mt-6">
                    <a
                        href={`/categories/${slug}.html?page=${page + 1}`}
                        className="block w-full text-center bg-blue-400 hover:bg-blue-200 text-white py-3 rounded-3xl"
                    >
                        Show More {title}
                    </a>
                </div>
            )}

            {/* 如果是最后一页且显示区间数量少于每页数量，且没数据，显示 no data */}
            {isLastPage && items.length === 0 && (
                <p className="text-gray-500 text-center py-20">no data</p>
            )}
        </>
    );
}

export default function CategoryDetailPage({
    slug,
    data,
}: {
    slug: string;
    data: CategoryData;
}) {
    const [items, setItems] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
    const [title, setTitle] = useState<string>('');
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        if (!slug || !data) {
            setError('Missing slug or data');
            setLoading(false);
            return;
        }

        setItems(data.items || []);
        setTitle(data.title || '');
        setTotalItems(data.total_items || 0);
        setTotalPages(data.total_pages || Math.ceil((data.total_items || 0) / 9));

        const breadcrumbsData =
            data.breadcrumb?.map((crumb) => ({
                label: crumb.text,
                href: crumb.link || '#',
            })) || [];
        setBreadcrumbs(breadcrumbsData);

        setLoading(false);
    }, [slug, data]);

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

                    <Suspense fallback={<div>Loading...</div>}>
                        <CategoryItemsPagination
                            slug={slug}
                            items={items}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            title={title}
                        />
                    </Suspense>

                    {/* 加载和错误提示 */}
                    {error && <p className="text-red-500">加载失败: {error}</p>}

                    {/* 数据为空且第一页，显示no data */}
                    {!loading && !error && items.length === 0 && (
                        <p className="text-gray-500 text-center py-20">no data</p>
                    )}
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