import fs from 'fs';
import path from 'path';
import CategoryDetailClient from './CategoryDetailClient';

export async function generateStaticParams() {
    const detailDir = path.join(process.cwd(), 'public/assets/data/json/category');
    const files = fs.readdirSync(detailDir);
    const params = files
        .filter(file => file.endsWith('.json'))
        .map(file => {
            const name = file.replace(/\.json$/, '');
            const underscoreIndex = name.lastIndexOf('_');
            if (underscoreIndex === -1) {
                // 如果文件名不包含下划线，使用默认id 'unknown'
                return { slug: name, id: 'unknown' };
            }
            const slug = name.substring(0, underscoreIndex);
            let id = name.substring(underscoreIndex + 1);
            return { slug, id };
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