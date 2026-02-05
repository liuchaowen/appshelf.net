import fs from 'fs';
import path from 'path';
import CategoryDetailClient from './CategoryDetailClient';

export async function generateStaticParams() {
    const homeFile = path.join(process.cwd(), 'public/assets/data/json/home.json');
    const data = JSON.parse(fs.readFileSync(homeFile, 'utf-8'));
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

export default async function DetailPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
    const { slug, id } = await params;
    if (!slug || !id) {
        return (
            <div>
                <h2>Error: Missing package parameter.</h2>
                <p>无法获取 slug,id 参数。</p>
            </div>
        );
    }

    return <CategoryDetailClient slug={slug} id={id} />;
}