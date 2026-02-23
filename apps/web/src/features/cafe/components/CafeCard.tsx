'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { CafeResponse } from '../services/types';

type CafeCardProps = {
    cafe: CafeResponse;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function resolveImageSrc(src: string): string {
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
        return src;
    }
    return `${API_BASE_URL}/storage/${src}`;
}

export function CafeCard({ cafe }: CafeCardProps) {
    const t = useTranslations('home.cafe');
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = cafe.images?.length > 0
        ? cafe.images.map(img => resolveImageSrc(img.imageSrc))
        : ['/placeholder-cafe.jpg'];

    const hasMultipleImages = images.length > 1;
    const [paused, setPaused] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!hasMultipleImages || paused) return;

        intervalRef.current = setInterval(() => {
            setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
        }, 4000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [hasMultipleImages, paused, images.length]);

    const goToPrev = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    const goToNext = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    const prices = cafe.prices.map(p => p.amountTotal);
    const lowestPrice = prices.length > 0 ? Math.min(...prices) : null;
    const highestPrice = prices.length > 1 ? Math.max(...prices) : null;

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('ko-KR').format(amount);
    };

    return (
        <div
            className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* 이미지 캐러셀 */}
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
                {/* 슬라이드 트랙 */}
                <div
                    className="flex h-full transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {images.map((src, idx) => (
                        <div key={idx} className="w-full h-full flex-shrink-0">
                            <img
                                src={src}
                                alt={`${cafe.businessName} ${idx + 1}`}
                                className="w-full h-full object-cover"
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>

                {/* 좌우 화살표 */}
                {hasMultipleImages && (
                    <>
                        <button
                            onClick={goToPrev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            aria-label="이전 이미지"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            aria-label="다음 이미지"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                {/* 인디케이터 */}
                {hasMultipleImages && (
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                                    idx === currentIndex
                                        ? 'bg-white w-4'
                                        : 'bg-white/50 hover:bg-white/80'
                                }`}
                                aria-label={`이미지 ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* 카페 이름 + 주소 오버레이 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
                    <h3 className="text-white text-lg font-bold leading-tight">
                        {cafe.businessName}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                        <svg className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-300 text-sm truncate">
                            {cafe.address1} {cafe.address2}
                        </span>
                    </div>
                </div>
            </div>

            {/* 정보 영역 */}
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {lowestPrice !== null ? (
                            <span className="font-semibold text-green-700 dark:text-green-400">
                                {highestPrice && highestPrice !== lowestPrice
                                    ? t('priceRange', { min: formatPrice(lowestPrice), max: formatPrice(highestPrice) })
                                    : t('priceSingle', { price: formatPrice(lowestPrice) })
                                }
                            </span>
                        ) : (
                            <span className="text-gray-400">{t('noPrice')}</span>
                        )}
                    </div>
                    {cafe.prices.length > 0 && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                            {t('planCount', { count: cafe.prices.length })}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
