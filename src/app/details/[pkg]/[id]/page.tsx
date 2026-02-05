import fs from 'fs';
import path from 'path';
import ApkDetailClient from './ApkDetailClient';

export async function generateStaticParams() {
    const detailDir = path.join(process.cwd(), 'public/assets/data/json/detail');
    const files = fs.readdirSync(detailDir);
    const params = files
        .filter(file => file.endsWith('.json'))
        .map(file => {
            const name = file.replace(/\.json$/, '');
            const underscoreIndex = name.lastIndexOf('_');
            if (underscoreIndex === -1) {
                // 如果文件名不包含下划线，使用默认id 'unknown'
                return { pkg: name, id: 'unknown' };
            }
            const pkg = name.substring(0, underscoreIndex);
            let id = name.substring(underscoreIndex + 1);
            return { pkg, id };
        });

    return params;
}

export default async function DetailPage({ params }: { params: Promise<{ pkg: string; id: string }> }) {
    const { pkg, id } = await params;
    if (!pkg || !id) {
        return (
            <div>
                <h2>Error: Missing package parameter.</h2>
                <p>无法获取 pkg,id 参数。</p>
            </div>
        );
    }

    return <ApkDetailClient pkg={pkg} id={id} />;
}