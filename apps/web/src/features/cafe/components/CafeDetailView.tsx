'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { CafeDetailResponse, CafeSeat } from '../services/types';
import { SeatGrid, SEAT_TYPE_I18N_KEY } from './SeatGrid';

type CafeDetailViewProps = {
    cafe: CafeDetailResponse;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function resolveImageSrc(src: string): string {
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
        return src;
    }
    return `${API_BASE_URL}/storage/${src}`;
}

export function CafeDetailView({ cafe }: CafeDetailViewProps) {
    const t = useTranslations('cafeDetail');
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedSeat, setSelectedSeat] = useState<CafeSeat | null>(null);

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

    const goToPrev = useCallback(() => {
        setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    const prices = cafe.prices.map(p => p.amountTotal);
    const lowestPrice = prices.length > 0 ? Math.min(...prices) : null;
    const highestPrice = prices.length > 1 ? Math.max(...prices) : null;

    const formatPrice = (amount: number) =>
        new Intl.NumberFormat('ko-KR').format(amount);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            {/* 뒤로가기 */}
            <button
                onClick={() => router.push('/')}
                className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('backToCafes')}
            </button>

            {/* 상단: 이미지 + 카페 정보 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 이미지 캐러셀 */}
                <div className="lg:col-span-2">
                    <div
                        className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-700 group"
                        onMouseEnter={() => setPaused(true)}
                        onMouseLeave={() => setPaused(false)}
                    >
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

                        {hasMultipleImages && (
                            <>
                                <button
                                    onClick={goToPrev}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={goToNext}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}

                        {hasMultipleImages && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            idx === currentIndex ? 'bg-white w-5' : 'bg-white/50 hover:bg-white/80'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 카페 이름 + 주소 */}
                    <div className="mt-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {cafe.businessName}
                        </h1>
                        <div className="flex items-center gap-1.5 mt-1.5 text-gray-500 dark:text-gray-400">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{cafe.address1} {cafe.address2}</span>
                        </div>
                    </div>
                </div>

                {/* 우측 정보 카드 */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-300 dark:border-gray-600 p-6 space-y-4 sticky top-24">
                        {selectedSeat ? (
                            <>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {t('selectedSeat')}
                                </h2>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">{t('seatNumber')}</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{selectedSeat.seatName}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">{t('seatType')}</span>
                                    <span className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                        {t(SEAT_TYPE_I18N_KEY[selectedSeat.seatType] || 'seatTypeOther')}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {t('cafeInfo')}
                                </h2>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        <span>{t('price')}</span>
                                    </div>
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        {lowestPrice !== null
                                            ? highestPrice && highestPrice !== lowestPrice
                                                ? t('priceRangeDetail', { min: formatPrice(lowestPrice), max: formatPrice(highestPrice) })
                                                : t('pricePerHour', { price: formatPrice(lowestPrice) })
                                            : '-'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        <span>{t('available')}</span>
                                    </div>
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        {t('availableSeats', {
                                            available: cafe.seatSummary.availableSeats,
                                            total: cafe.seatSummary.totalSeats,
                                        })}
                                    </span>
                                </div>

                                {cafe.badges?.length > 0 && (
                                    <div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {t('amenities')}
                                        </span>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {cafe.badges.map(badge => (
                                                <span
                                                    key={badge.badgeId}
                                                    className="px-3 py-1 text-xs font-medium rounded-full"
                                                    style={{
                                                        backgroundColor: badge.bgColor,
                                                        color: badge.txtColor,
                                                    }}
                                                >
                                                    {badge.title}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <button
                            onClick={() => {
                                if (selectedSeat) {
                                    // TODO: 예약 진행
                                } else {
                                    document.getElementById('seat-section')?.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            disabled={!selectedSeat}
                            className={`w-full mt-2 py-3 font-semibold rounded-xl transition-colors ${
                                selectedSeat
                                    ? 'bg-green-700 hover:bg-green-800 text-white cursor-pointer'
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {selectedSeat ? t('proceedReservation') : t('selectSeatPrompt')}
                        </button>
                    </div>
                </div>
            </div>

            {/* 좌석 선택 영역 */}
            <div id="seat-section" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SeatGrid
                        seats={cafe.seats}
                        selectedSeatId={selectedSeat?.seatId ?? null}
                        onSeatSelect={setSelectedSeat}
                    />
                </div>
            </div>
        </div>
    );
}
