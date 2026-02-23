import { CafeResponse } from '../services/types';
import { getAllCafes } from '../services/cafes';
import { CafeSearchableList } from './CafeSearchableList';

export async function CafeList() {
    let cafes: CafeResponse[] = [];
    let error: string | null = null;

    try {
        cafes = await getAllCafes();
    } catch (e) {
        error = e instanceof Error ? e.message : '카페 목록을 불러오는데 실패했습니다.';
    }

    if (error) {
        return (
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </div>
        );
    }

    if (cafes.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400">등록된 카페가 없습니다.</p>
            </div>
        );
    }

    return <CafeSearchableList cafes={cafes} />;
}
