import fs from 'fs/promises';
import path from 'path';
import CategoryDetailPage from './CategoryDetailPage';
import { CategoryItem } from '@/components/category-share';

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

export async function generateStaticParams() {
    const homeFile = path.join(process.cwd(), 'public/assets/data/json/home.json');
    const fileContent = await fs.readFile(homeFile, 'utf-8');
    const data = JSON.parse(fileContent);
    const params = data.map((section: { section_link: string }) => {
        // section_link 形如: /hot/slug/id
        const match = section.section_link.match(/^\/hot\/([^\/]+)\/([^\/]+)$/);
        if (match) {
            const slug = match[1];
            const id = match[2];
            return { slug, id };
        }
        // 如果格式不匹配，返回默认参数
        return { slug: 'unknown', id: 'unknown' };
    });
    return params;
}

export default async function DetailPage({ params }: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;

    if (!slug) {
        return (
            <div>
                <h2>Error: Missing slug parameter.</h2>
                <p>无法获取 slug 参数。</p>
            </div>
        );
    }

    const homeFile = path.join(process.cwd(), 'public/assets/data/json/home.json');
    const homeFileContent = await fs.readFile(homeFile, 'utf-8');
    const homeData = JSON.parse(homeFileContent);

    // 查找section_link包含当前slug的section
    const section = homeData.find((s: any) => {
        const match = s.section_link?.match(/^\/hot\/([^\/]+)/);
        return match && match[1] === slug;
    });

    if (!section) {
        throw new Error(`Section not found for slug: ${slug}`);
    }

    // 从 section_link 提取 id
    const linkMatch = section.section_link?.match(/^\/hot\/([^\/]+)\/([^\/]+)$/);
    const categoryNum = linkMatch ? linkMatch[2] : '1';

    // 构造完整的 CategoryData 对象
    const data: CategoryData = {
        category_slug: slug,
        category_num: categoryNum,
        url: section.section_link ? `${section.section_link}.html` : `/hot/${slug}/${categoryNum}.html`,
        breadcrumb: [
            { text: 'Home', link: '/' },
            { text: section.section_title || slug, link: section.section_link ? `${section.section_link}.html` : `/hot/${slug}/${categoryNum}.html` }
        ],
        title: section.section_title || slug,
        total_items: section.items?.length || 0,
        total_pages: Math.ceil((section.items?.length || 0) / 9),
        items: section.items || []
    };

    return <CategoryDetailPage slug={slug} data={data} />;
}
