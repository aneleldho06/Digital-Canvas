'use client';

import dynamic from 'next/dynamic';

const CanvasWrapper = dynamic(() => import('@/components/CanvasWrapper'), {
    ssr: false,
    loading: () => (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
            <div className="text-xl font-bold animate-pulse">Loading Digital Canvas... 🎨</div>
        </div>
    )
});

export default function CanvasPage() {
    return (
        <div className="w-screen h-screen fixed inset-0 overflow-hidden bg-gray-50">
            <CanvasWrapper />
        </div>
    );
}
