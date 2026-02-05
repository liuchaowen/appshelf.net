import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface CategoryItem {
  icon: string;
  name: string;
  rating: number;
  link: string;
  coverlink_href?: string;
  hidden_img_src?: string;
}

export interface Breadcrumb {
  label: string;
  href: string;
}

export function BreadcrumbNav({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;
  return (
    <nav className="text-xs text-gray-500 mb-2" aria-label="Breadcrumb">
      <ol className="flex items-center">
        {
          breadcrumbs.map((crumb, idx) => (
            <li key={idx} className="flex items-center">
              {
                idx !== 0 && (
                  <svg
                    className="w-3 h-3 mx-1 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )
              }
              {
                idx < breadcrumbs.length - 1 ? (
                  <Link href={crumb.href} className="hover:text-blue-600" aria-current={idx === breadcrumbs.length - 1 ? 'page' : undefined}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-400"> {crumb.label}</span>
                )
              }
            </li>
          ))
        }
      </ol>
    </nav>
  );
}

export function CategoryItemCard({ item }: { item: CategoryItem }) {
  return (
    <Link
      key={item.name}
      href={item.link || item.coverlink_href || '#'}
      className="flex flex-col lg:flex-row category-item bg-white items-center"
    >
      <div className="hot-item-pic w-20 h-20 relative mb-3 rounded-lg ">
        <Image
          src={`${process.env.NEXT_PUBLIC_OSS_URL}${item.icon || `/${item.hidden_img_src}`}`}
          alt={item.name}
          fill
          className="object-contain rounded-2xl"
        />
      </div>
      <div className="flex flex-col lg:ml-4 items-center lg:items-start">
        <div className="hot-item-info-name mb-1 w-20 h-5 lg:w-40 truncate"> {item.name}</div>
        <div className="rating flex items-center text-sm text-gray-400">
          <span className="text-gray-600 "> {item.rating}</span>
          <svg
            className="w-3 h-3 fill-current ml-1"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

interface CategoryItemsGridProps {
  items: CategoryItem[];
  sliceStart?: number;
  sliceEnd?: number;
}

export function CategoryItemsGrid({ items, sliceStart = 0, sliceEnd = 9 }: CategoryItemsGridProps) {
  if (!items || items.length === 0) return null;
  const displayItems = items.slice(sliceStart, sliceEnd);
  return (
    <div className="grid grid-cols-3 gap-6">
      {
        displayItems.map(item => (
          <CategoryItemCard key={item.name} item={item} />
        ))
      }
    </div>
  );
}