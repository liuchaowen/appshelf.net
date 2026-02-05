import fs from 'fs';
import path from 'path';
import TopicDetailClient from './TopicDetailClient';

export async function generateStaticParams() {
    const detailDir = path.join(process.cwd(), 'public/assets/data/json/topic');
    const files = fs.readdirSync(detailDir);
    const params = files
        .filter(file => file.endsWith('.json'))
        .map(file => {
            const name = file.replace(/\.json$/, '');
            const underscoreIndex = name.lastIndexOf('_');
            if (underscoreIndex === -1) {
                return { title: name, id: 'unknown' };
            }
            const title = name.substring(0, underscoreIndex);
            let id = name.substring(underscoreIndex + 1);
            return { title, id };
        });

    return params;
}

export default async function TopicDetailPage({ params }: { params: Promise<{ title: string; id: string }> }) {
    const { title, id } = await params;
    if (!title || !id) {
        return (
            <div>
                <h2>Error: Missing parameters.</h2>
                <p>无法获取 title,id 参数。</p>
            </div>
        );
    }

    return <TopicDetailClient title={title} id={id} />;
}