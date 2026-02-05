import fs from 'fs/promises';
import path from 'path';
import CategoryDetailPage from './CategoryDetailPage';

export async function generateStaticParams() {
    const detailDir = path.join(process.cwd(), 'public/assets/data/json/category');
    const files = await fs.readdir(detailDir);
    const slugsSet = new Set<string>();
    files.forEach(file => {
        if (file.endsWith('.json')) {
            const name = file.replace(/\.json$/, '');
            const underscoreIndex = name.lastIndexOf('_');
            if (underscoreIndex !== -1) {
                const slug = name.substring(0, underscoreIndex);
                slugsSet.add(slug);
            } else {
                slugsSet.add(name);
            }
        }
    });
    return Array.from(slugsSet).map(slug => ({ slug }));
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

    const detailDir = path.join(process.cwd(), 'public/assets/data/json/category');

    // 找到所有匹配的 slug_x.json
    const files = await fs.readdir(detailDir);
    const matchedFiles = files.filter(file => {
        return file.startsWith(slug + '_') && file.endsWith('.json');
    });

    // 读取第一个匹配文件内容
    let data = null;
    if (matchedFiles.length > 0) {
        const filePath = path.join(detailDir, matchedFiles[0]);
        const content = await fs.readFile(filePath, { encoding: 'utf-8' });
        try {
            data = JSON.parse(content);
        } catch {
            // 忽略json解析错误
        }
    }

    return <CategoryDetailPage slug={slug} data={data} />;
}
