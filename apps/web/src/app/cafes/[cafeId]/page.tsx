import { getCafeDetail } from '@/features/cafe/services/cafes';
import { CafeDetailView } from '@/features/cafe/components/CafeDetailView';
import { getTranslations } from 'next-intl/server';

type Props = {
    params: Promise<{ cafeId: string }>;
};

export default async function CafeDetailPage({ params }: Props) {
    const { cafeId } = await params;
    const t = await getTranslations('cafeDetail');

    try {
        const cafe = await getCafeDetail(Number(cafeId));
        return <CafeDetailView cafe={cafe} />;
    } catch {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">{t('notFound')}</p>
            </div>
        );
    }
}
