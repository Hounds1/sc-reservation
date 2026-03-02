'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { CafeSeat } from '../services/types';

type SeatGridProps = {
    seats: CafeSeat[];
    selectedSeatId: number | null;
    onSeatSelect: (seat: CafeSeat | null) => void;
};

const SEAT_TYPE_ICONS: Record<string, (color: string) => React.ReactNode> = {
    NORMAL: (color) => (
        <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
            <rect x="4" y="4" width="16" height="12" rx="2" />
            <path d="M8 20h8M12 16v4" />
        </svg>
    ),
    WINDOW_SIDE: (color) => (
        <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
    ),
    SILENT: (color) => (
        <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
            <path d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.5 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.5l4.5-4v14l-4.5-4z" />
        </svg>
    ),
    GROUP: (color) => (
        <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
            <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
    OTHER: (color) => (
        <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16h.01" />
        </svg>
    ),
};

export const SEAT_TYPE_I18N_KEY: Record<string, string> = {
    NORMAL: 'seatTypeNormal',
    WINDOW_SIDE: 'seatTypeWindowSide',
    SILENT: 'seatTypeSilent',
    GROUP: 'seatTypeGroup',
    OTHER: 'seatTypeOther',
};

function getSeatColor(state: string, isSelected: boolean): string {
    if (isSelected) return '#3D5A3E';
    switch (state) {
        case 'AVAILABLE': return '#6B7280';
        case 'OCCUPIED': return '#D1D5DB';
        case 'MAINTENANCE': return '#D1D5DB';
        default: return '#D1D5DB';
    }
}

function getSeatBgColor(state: string, isSelected: boolean): string {
    if (isSelected) return '#3D5A3E';
    switch (state) {
        case 'AVAILABLE': return '#FFFFFF';
        case 'OCCUPIED': return '#F3F4F6';
        case 'MAINTENANCE': return '#F3F4F6';
        default: return '#F3F4F6';
    }
}

export function SeatGrid({ seats, selectedSeatId, onSeatSelect }: SeatGridProps) {
    const t = useTranslations('cafeDetail');

    const { rows, columns, seatMap } = useMemo(() => {
        const locations = [...new Set(seats.map(s => s.location))].sort();
        const numbers = [...new Set(seats.map(s => s.seatNumber))].sort((a, b) => a - b);
        const map = new Map<string, CafeSeat>();
        seats.forEach(s => map.set(`${s.location}-${s.seatNumber}`, s));
        return { rows: locations, columns: numbers, seatMap: map };
    }, [seats]);

    const seatTypes = useMemo(() => {
        return [...new Set(seats.map(s => s.seatType))];
    }, [seats]);

    const handleSeatClick = (seat: CafeSeat) => {
        if (seat.state !== 'AVAILABLE') return;
        if (selectedSeatId === seat.seatId) {
            onSeatSelect(null);
        } else {
            onSeatSelect(seat);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-300 dark:border-gray-600 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {t('seatSelection')}
            </h2>

            {/* 범례 */}
            <div className="flex items-center justify-center gap-6 mb-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-[#F5D5BE] bg-[#FFF0E5]" />
                    <span>{t('legendAvailable')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-700" />
                    <span>{t('legendSelected')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-600" />
                    <span>{t('legendOccupied')}</span>
                </div>
            </div>

            {/* 좌석 그리드 */}
            <div className="overflow-x-auto flex justify-center">
                <div className="inline-block">
                    <div className="flex flex-col gap-3">
                        {rows.map(row => (
                            <div key={row} className="flex items-center gap-3">
                                <span className="w-6 text-center font-semibold text-gray-500 dark:text-gray-400 text-sm">
                                    {row}
                                </span>
                                <div className="flex gap-3">
                                    {columns.map(col => {
                                        const seat = seatMap.get(`${row}-${col}`);
                                        if (!seat) {
                                            return <div key={col} className="w-16 h-16" />;
                                        }
                                        const isSelected = selectedSeatId === seat.seatId;
                                        const isAvailable = seat.state === 'AVAILABLE';
                                        const iconColor = isSelected ? '#FFFFFF' : isAvailable ? '#6B7280' : '#9CA3AF';
                                        const iconFn = SEAT_TYPE_ICONS[seat.seatType] ?? SEAT_TYPE_ICONS.OTHER!;

                                        return (
                                            <button
                                                key={col}
                                                onClick={() => handleSeatClick(seat)}
                                                disabled={!isAvailable && !isSelected}
                                                className={`
                                                    w-16 h-16 rounded-xl flex flex-col items-center justify-center gap-1
                                                    border-2 transition-all duration-150
                                                    ${isSelected
                                                        ? 'bg-green-700 border-green-700 text-white shadow-md'
                                                        : isAvailable
                                                            ? 'bg-[#FFF0E5] dark:bg-[#4A3728] border-[#F5D5BE] dark:border-[#6B4F3A] hover:border-green-700 hover:shadow-sm cursor-pointer'
                                                            : 'bg-gray-100 dark:bg-gray-700 border-gray-100 dark:border-gray-600 opacity-60 cursor-not-allowed'
                                                    }
                                                `}
                                            >
                                                {iconFn(iconColor)}
                                                <span className={`text-xs font-medium ${
                                                    isSelected ? 'text-white' : isAvailable ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400'
                                                }`}>
                                                    {seat.seatName}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 열 번호 */}
                    <div className="flex items-center gap-3 mt-3">
                        <span className="w-6" />
                        <div className="flex gap-3">
                            {columns.map(col => (
                                <div key={col} className="w-16 text-center text-sm text-gray-400">
                                    {col}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 좌석 유형 범례 */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                {seatTypes.map(type => {
                    const iconFn = SEAT_TYPE_ICONS[type] ?? SEAT_TYPE_ICONS.OTHER!;
                    const key = SEAT_TYPE_I18N_KEY[type] || 'seatTypeOther';
                    return (
                        <div key={type} className="flex items-center gap-1.5">
                            {iconFn('#6B7280')}
                            <span>{t(key)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
