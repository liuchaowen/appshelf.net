'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar, { menuItems } from '../components/navbar';
import Footer from '../components/footer';
import { ChevronRight, Star } from 'lucide-react';

interface ApkItem {
  coverlink_href: string;
  hidden_img_src: string;
  name: string;
  cate_href: string;
  cate: string;
  rating: string;
}

interface Section {
  section_title: string;
  section_link: string;
  items: ApkItem[];
}

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [homeData, setHomeData] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 加载home.json数据
  useEffect(() => {
    fetch('/assets/data/json/home.json')
      .then(res => res.json())
      .then(data => {
        setHomeData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load home data:', err);
        setIsLoading(false);
      });
  }, []);








  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-lg md:hidden transform transition-transform">
            <div className="p-4">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="mb-6 p-2 rounded-md hover:bg-gray-100"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <nav className="flex flex-col space-y-4">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 font-medium text-sm py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Container - APK Categories */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
          </div>
        ) : (
          <div className="space-y-12">
            {homeData.map((section, idx) => (
              <section key={idx} className="space-y-4">
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">{section.section_title}</h2>
                  <a
                    href={`${section.section_link}.html`}
                    className="text-gray-600 hover:text-gray-300 text-sm font-medium hover:underline"
                  >
                    <ChevronRight />
                  </a>
                </div>

                {/* APK Items Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {section.items.map((item, itemIdx) => (
                    <a
                      key={itemIdx}
                      href={item.coverlink_href}
                      className="group bg-white rounded-lg border border-[#f0f1f3] p-3 hover:shadow-lg  flex flex-col"
                    >
                      <div className="aspect-square mb-2 relative overflow-hidden rounded-md bg-gray-100">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_OSS_URL}/${item.hidden_img_src}`}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                        />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between text-xs mt-auto">
                        <span className="text-gray-500">{item.cate}</span>
                        <div className="flex items-center">
                          <Star className="mr-1 w-3 h-3 text-gray-400 fill-gray-400" />
                          <span className="text-gray-700 font-medium">{item.rating}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
