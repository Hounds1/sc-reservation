'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { CafeResponse } from '../services/types';
import { CafeCard } from './CafeCard';

type CafeSearchableListProps = {
    cafes: CafeResponse[];
};

function useDebouncedValue<T>(value: T, delayMs: number): T {
    const [debounced, setDebounced] = useState(value);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        timerRef.current = setTimeout(() => setDebounced(value), delayMs);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [value, delayMs]);

    return debounced;
}

export function CafeSearchableList({ cafes }: CafeSearchableListProps) {
    const t = useTranslations('home');
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebouncedValue(query, 500);

    const filtered = useMemo(() => {
        const keyword = debouncedQuery.trim().toLowerCase();
        if (!keyword) return cafes;

        return cafes.filter(cafe => {
            const name = cafe.businessName.toLowerCase();
            const addr = `${cafe.address1} ${cafe.address2}`.toLowerCase();
            return name.includes(keyword) || addr.includes(keyword);
        });
    }, [cafes, debouncedQuery]);

    return (
        <>
            {/* 검색 바 */}
            <div className="mb-10 relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full pl-12 pr-4 py-4 text-base bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-shadow placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:text-white"
                />
            </div>

            {/* 필터 결과 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                    {filtered.length === 0 ? (
                        <motion.div
                            key="no-results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="col-span-full text-center py-16"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">{t('noResults')}</p>
                        </motion.div>
                    ) : (
                        filtered.map((cafe) => (
                            <motion.div
                                key={cafe.cafeId}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{
                                    opacity: { duration: 0.2 },
                                    scale: { duration: 0.2 },
                                    layout: { type: 'spring', stiffness: 350, damping: 30 },
                                }}
                            >
                                <CafeCard cafe={cafe} />
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
