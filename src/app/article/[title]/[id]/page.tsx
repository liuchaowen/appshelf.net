import fs from 'fs';
import path from 'path';
import ArticleDetailClient from './ArticleDetailClient';

export async function generateStaticParams() {
    const detailDir = path.join(process.cwd(), 'public/assets/data/json/article');
    const files = fs.readdirSync(detailDir);
    const params = files
        .filter(file => file.endsWith('.json'))
        .map(file => {
            const name = file.replace(/\.json$/, '');
            const underscoreIndex = name.lastIndexOf('_');
            if (underscoreIndex === -1) {
                // 如果文件名不包含下划线，使用默认id 'unknown'
                return { title: name, id: 'unknown' };
            }
            const title = name.substring(0, underscoreIndex);
            let id = name.substring(underscoreIndex + 1);
            return { title, id };
        });

    return params;
}

export default async function DetailPage({ params }: { params: Promise<{ title: string; id: string }> }) {
    const { title, id } = await params;
    if (!title || !id) {
        return (
            <div>
                <h2>Error: Missing package parameter.</h2>
                <p>无法获取 title,id 参数。</p>
            </div>
        );
    }

    return <ArticleDetailClient title={title} id={id} />;
}