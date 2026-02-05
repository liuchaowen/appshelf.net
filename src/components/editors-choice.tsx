import React from 'react';
import Image from 'next/image';

interface EditorsChoiceItem {
    id?: string;
    coverlink?: string;
    url?: string;
    edt_small_tag: string;
    img_src: string;
    title?: string;
}

interface EditorsChoiceProps {
    items: EditorsChoiceItem[];
}

export default function EditorsChoice({ items }: EditorsChoiceProps) {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <section className="editors-choice p-4 rounded-lg">
            <h2 className="text-lg font-bold text-black mb-6 tracking-wide">
                Editor&#39;s Choice
            </h2>
            <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
                {items.map((item) => (
                    <a
                        key={item.id || item.coverlink}
                        href={item.coverlink || item.url}
                        className="relative flex-shrink-0 w-64 h-40 rounded-md border border-white border-opacity-50 overflow-hidden hover:opacity-90 transition-opacity"
                        rel="noopener noreferrer"
                    >
                        <Image
                            width={234}
                            height={140}
                            src={`${process.env.NEXT_PUBLIC_OSS_URL}/${item.img_src}`}
                            alt={item.edt_small_tag}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-0 left-0 w-full h-full bg-black/50 p-4">
                            <div className='absolute top-1/6 left-1/6 w-2/3 h-2/3 border border-white rounded-md flex justify-center items-center text-sm text-white text-center'>
                                {item.edt_small_tag}
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}