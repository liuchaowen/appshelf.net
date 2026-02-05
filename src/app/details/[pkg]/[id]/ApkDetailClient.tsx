'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import Image from 'next/image';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import TopDownloads from '@/components/top-downloads';
import { Download, Star, ChevronLeft, ChevronRight, Info, User, List, DollarSign, Shield, GitBranch, Hash } from 'lucide-react';

interface CurrentInfo {
    icon: string;
    title: string;
    ratings: string;
    downloads: string;
    age: string;
    download_link: string;
}

interface AppInfoItem {
    name: string;
    value: string;
}

interface RelatedApp {
    link: string;
    icon: string;
    name: string;
    categoryLink: string;
    category: string;
    rating: string;
}

interface TopDownloadItem {
    link: string;
    icon: string;
    name: string;
    categoryLink: string;
    category: string;
    rating: string;
}

interface DetailData {
    current_info: CurrentInfo;
    appinfo_list: AppInfoItem[];
    app_screen: string[];
    app_descript: string;
    related_apps: RelatedApp[];
}


export default function ApkDetailClient({ pkg, id }: { pkg: string, id: string }) {
    const [detailData, setDetailData] = useState<DetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        fetch(`/assets/data/json/detail/${pkg}_${id}.json`)
            .then((res) => res.json())
            .then((data) => {
                setDetailData(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load detail data:', err);
                setIsLoading(false);
            });
    }, [pkg, id]);

    // 检查URL是否有效的函数
    const checkUrlExists = async (url: string): Promise<boolean> => {
        try {
            const response = await fetch(url, {
                method: 'HEAD',
                mode: 'no-cors' // 避免CORS问题
            });
            return true; // 如果没有抛出错误，说明URL可访问
        } catch (error) {
            // 由于no-cors模式，我们无法获取真实的响应状态
            // 但如果URL完全无效，fetch会抛出错误
            console.warn('URL检查失败:', error);
            return false;
        }
    };

    // 下载APK函数
    const downloadApk = async () => {
        if (!detailData?.current_info?.download_link) {
            alert('下载链接不可用');
            return;
        }

        setIsDownloading(true);

        try {
            const downloadUrl = detailData.current_info.download_link;

            // 检查链接是否存在
            const urlExists = await checkUrlExists(downloadUrl);

            if (urlExists) {
                // 在新窗口中打开下载链接
                window.open(downloadUrl, '_blank');
            } else {
                alert('下载链接暂时不可用，请稍后再试');
            }
        } catch (error) {
            console.error('下载过程中出现错误:', error);
            alert('下载失败，请稍后再试');
        } finally {
            setIsDownloading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                </div>
                <Footer />
            </div>
        );
    }

    if (!detailData) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-gray-500">App not found</div>
                </div>
                <Footer />
            </div>
        );
    }

    const getIconByName = (name: string) => {
        switch (name) {
            case 'Name':
                return <User className="text-black w-5 h-5" />;
            case 'Category':
                return <List className="text-black w-5 h-5" />;
            case 'Price':
                return <DollarSign className="text-black w-5 h-5" />;
            case 'Safety':
                return <Shield className="text-black w-5 h-5" />;
            case 'Developer':
                return <GitBranch className="text-black w-5 h-5" />;
            case 'Version':
                return <Hash className="text-black w-5 h-5" />;
            default:
                return <Info className="text-black w-5 h-5" />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col xl:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1 space-y-8">
                        {/* 区块一: APK信息详情 */}
                        <section className="p-6">
                            <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-6">
                                <div className="flex flex-row gap-6">
                                    <div className="flex-shrink-0">
                                        <div className="w-24 h-24 bg-gray-200 rounded-lg">
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_OSS_URL}/${detailData.current_info.icon}`}
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-cover rounded-lg"
                                                loading="lazy"
                                                alt="apk-info"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-gray-900 mb-4">{detailData.current_info.title}</h1>
                                        <div className="grid grid-cols-3 gap-4 mb-6">
                                            <div className="text-center">
                                                <div className="text-gray-900 mb-1">{detailData.current_info.ratings}</div>
                                                <div className="text-sm text-gray-500">Ratings</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-gray-900 mb-1">{detailData.current_info.downloads}</div>
                                                <div className="text-sm text-gray-500">Downloads</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-gray-900 mb-1">{detailData.current_info.age}</div>
                                                <div className="text-sm text-gray-500">Age</div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className='flex items-center justify-center'>
                                    <button
                                        onClick={() => downloadApk()}
                                        disabled={isDownloading}
                                        className={`w-full sm:w-auto px-8 py-3 ${isDownloading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                            } text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${!isDownloading ? 'animate-pulse-scale hover:animate-none' : ''
                                            }`}
                                    >
                                        <Download className="w-5 h-5" />
                                        {isDownloading ? 'Checking Download...' : 'Download Latest APK'}
                                    </button>
                                </div>
                            </div>

                        </section>

                        {/* 区块二: About this app */}
                        <section className="p-6">
                            <h4 className='font-bold mb-4'>About this app</h4>
                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                {detailData.appinfo_list.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-1 p-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                                            {getIconByName(item.name)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-500 mb-1">{item.name}</div>
                                            <div className="text-gray-900 truncate">{item.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 区块三: 应用截图 */}
                        <section className="p-6">
                            <div className="relative max-w-full overflow-hidden">
                                {/* 左右按钮 */}
                                <Button variant="outline" size="icon" className="rounded-full absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-white  rounded-full p-2" onClick={() =>
                                    setCurrentImageIndex((prev) =>
                                        prev === 0 ? detailData.app_screen.length - 1 : prev - 1
                                    )
                                }>
                                    <ChevronLeft />
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-full absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-white  rounded-full p-2" onClick={() =>
                                    setCurrentImageIndex((prev) =>
                                        prev === detailData.app_screen.length - 1 ? 0 : prev + 1
                                    )
                                }>
                                    <ChevronRight />
                                </Button>

                                <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                                    {detailData.app_screen.map((screenshot, idx) => (
                                        <div
                                            key={idx}
                                            className="flex-shrink-0 h-96 bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all mr-2"
                                            onClick={() => setCurrentImageIndex(idx)}
                                        >
                                            <Image
                                                src={screenshot}
                                                alt={`Screenshot ${idx + 1}`}
                                                width={192}
                                                height={384}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* 区块四: 应用详情 */}
                        <section className="p-6">
                            <div
                                className="prose max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{ __html: detailData.app_descript }}
                            />
                        </section>

                        {/* Related Apps */}
                        <section className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Related Apps</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {detailData.related_apps.map((app, idx) => (
                                    <a
                                        key={idx}
                                        href={app.link}
                                        className="flex items-center gap-4 p-4 rounded-lg  hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_OSS_URL}/${app.icon}`}
                                                alt={app.name}
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-800 text-sm truncate mb-1">{app.name}</h3>
                                            <div className="text-sm text-gray-500 mb-1">{app.category}</div>
                                            <div className="flex items-center">
                                                <span className="text-sm font-medium text-gray-700">{app.rating}</span>
                                                <Star className="ml-1 w-3 h-3 text-gray-400 fill-gray-400" />
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar: Top Downloads */}
                    <aside className='xl:w-80 md:w-full'>
                        <div className="p-6 sticky top-4">
                            <TopDownloads limit={10} />
                        </div>
                    </aside>
                </div>
            </main >

            <Footer />
        </div >
    );
}