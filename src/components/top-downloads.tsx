'use client';

import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface AppItem {
    link: string;
    icon: string;
    name: string;
    categoryLink: string;
    category: string;
    rating: string;
}

interface AppItem {
    link: string;
    icon: string;
    name: string;
    categoryLink: string;
    category: string;
    rating: string;
}

interface TopDownloadsProps {
    limit?: number;
}

export default function TopDownloads({ limit = 10 }: TopDownloadsProps) {
    const [items, setItems] = useState<AppItem[]>([]);

    useEffect(() => {
        fetch('/assets/data/json/top-new.json')
            .then((res) => res.json())
            .then((data) => {
                setItems(data.top || []);
            })
            .catch((err) => {
                console.error('Failed to load top downloads:', err);
            });
    }, []);

    return (
        <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl text-gray-900 mb-6 flex items-center">
                Top Downloads
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-3">
                {items.slice(0, limit).map((item, index) => (
                    <a
                        key={index}
                        href={item.link}
                        rel="noopener noreferrer"
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                        <div className="flex-shrink-0 w-12 h-12 mr-3 relative bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_OSS_URL}/${item.icon}`}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                                {item.name}
                            </h3>
                            <div className="flex flex-col lg:flex-row mt-1">
                                <span className="text-xs text-gray-500">{item.category}</span>
                                <div className="flex lg:ml-2  items-center">
                                    <span className="text-xs text-gray-600">{item.rating}</span>
                                    <Star className="ml-1 w-3 h-3 text-gray-400 fill-gray-400" />
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}