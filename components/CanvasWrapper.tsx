'use client';

import { Tldraw, Editor, createShapeId, TLUiComponents } from 'tldraw';
import 'tldraw/tldraw.css';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useReadContract, useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ABI } from '@/lib/abi';
import { DigitalItemShapeUtil } from './DigitalCanvasShape';
import { UploadModal } from './UploadModal';
import { toast } from 'sonner';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

const uiOverrides: TLUiComponents = {
    Toolbar: null,
    PageMenu: null,
    MainMenu: null,
    HelpMenu: null,
    NavigationPanel: null,
    DebugPanel: null,
    StylePanel: null,
};

export default function CanvasWrapper() {
    const [editor, setEditor] = useState<Editor | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalPos, setModalPos] = useState({ x: 0, y: 0 });
    const { address } = useAccount();

    // Contract Interactions
    const { data: items, refetch, isRefetching } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getAllItems',
        // Poll every 10 seconds for updates
        query: {
            refetchInterval: 10000
        }
    });

    const { writeContract, data: deleteHash } = useWriteContract();
    const { isSuccess: isDeleteSuccess, isLoading: isDeleting } = useWaitForTransactionReceipt({
        hash: deleteHash
    });

    useEffect(() => {
        if (isDeleteSuccess) {
            toast.success("Item deleted from chain! It requires a refresh to update the view properly.");
            refetch();
        }
    }, [isDeleteSuccess, refetch]);

    // Sync Items to Canvas
    useEffect(() => {
        if (!editor || !items) return;

        editor.run(() => {
            const shapesToCreate: any[] = [];
            const existingShapeIds = new Set(editor.getCurrentPageShapeIds());

            items.forEach((item, index) => {
                // Construct a stable ID based on chain ID or index
                // We use 'digital-item' + index (assuming index is id). 
                // Note: index in getAllItems corresponds to ID if array is ordered.
                // But better to use index as Loop index if ID is just position.
                // Contract ID is index.
                const shapeId = createShapeId(`item-${index}`);

                // If shape exists, check if we need to update? 
                // For hackathon, assume immutable mostly, except deleted status.
                // But if we want to "Fake undelete", we need to ensure deleted items are shown.

                const props = {
                    w: 300,
                    h: 200,
                    ipfsHash: item.ipfsHash,
                    title: item.title,
                    owner: item.owner,
                    timestamp: Number(item.timestamp),
                    idOnChain: index,
                    isDeleted: item.deleted
                };

                if (editor.getShape(shapeId)) {
                    // Update props if changed (e.g. deleted status)
                    editor.updateShape({ id: shapeId, type: 'digital-item', props });
                } else {
                    shapesToCreate.push({
                        id: shapeId,
                        type: 'digital-item',
                        x: Number(item.x),
                        y: Number(item.y),
                        props
                    });
                }
            });

            if (shapesToCreate.length > 0) {
                editor.createShapes(shapesToCreate);
            }
        });

    }, [editor, items]);

    // Handle Selection for Delete Button
    const selectedShapeId = editor ? editor.getSelectedShapeIds()[0] : null;
    const selectedShape = selectedShapeId ? editor?.getShape(selectedShapeId) : null;

    const canDelete = useMemo(() => {
        if (!selectedShape || selectedShape.type !== 'digital-item') return false;
        // Check ownership
        const props = selectedShape.props as any;
        // Simple case-insensitive check
        return address && props.owner.toLowerCase() === address.toLowerCase() && !props.isDeleted;
    }, [selectedShape, address]);

    const handleDelete = () => {
        if (!selectedShape) return;
        const props = selectedShape.props as any;
        const id = props.idOnChain;

        // Optimistic Update (Visual)
        toast.loading("Deleting item...");

        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'deleteItem',
            args: [BigInt(id)]
        }, {
            onSuccess: () => {
                toast.dismiss();
                toast.loading("Waiting for confirmation...");
                // Hide locally for the demo effect
                editor?.updateShape({
                    id: selectedShape.id,
                    type: 'digital-item',
                    props: { ...props, isDeleted: true }
                });
                editor?.deselect(selectedShape.id);
            },
            onError: (err) => {
                toast.dismiss();
                toast.error("Delete failed: " + err.message);
            }
        });
    };

    const openUploadModal = () => {
        if (!editor) return;
        const center = editor.getViewportPageBounds().center;
        setModalPos(center);
        setIsModalOpen(true);
    };

    return (
        <div className="relative w-full h-full">
            <Tldraw
                onMount={(e) => {
                    setEditor(e);
                    // Set simple read only mode if not owner? No, everyone can pan/zoom.
                    // But maybe lock shapes so others can't move them? 
                    // Prompt says "Render all items as draggable/resizable".
                    // But changes aren't saved to chain (x,y is immutable in this simple contract version)
                    // So local movement is ephemeral. That's fine for MVP.
                }}
                shapeUtils={[DigitalItemShapeUtil]}
                components={uiOverrides}
                hideUi={false}
            />

            {/* Floating UI Elements */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-4">
                {/* Refresh Button */}
                <button
                    onClick={() => refetch()}
                    className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-all border border-gray-200 dark:border-gray-700"
                    title="Refresh Canvas"
                >
                    <span className={`block text-xl ${isRefetching ? 'animate-spin' : ''}`}>🔄</span>
                </button>

                {/* Add Button */}
                {address ? (
                    <button
                        onClick={openUploadModal}
                        className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 hover:scale-105 transition-all font-bold text-2xl flex items-center justify-center w-16 h-16"
                    >
                        +
                    </button>
                ) : (
                    <div className="bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur text-sm">
                        Connect Wallet to Post
                    </div>
                )}
            </div>

            {/* Delete Button (Contextual) */}
            {canDelete && (
                <div className="absolute bottom-24 right-6 animate-in slide-in-from-bottom-2 fade-in">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-red-700 font-semibold flex items-center gap-2"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Selected'} 🗑️
                    </button>
                </div>
            )}

            {/* Loading Overlay */}
            {!items && isRefetching && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-50 pointer-events-none">
                    <div className="animate-spin text-4xl">⏳</div>
                </div>
            )}

            <UploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                x={modalPos.x}
                y={modalPos.y}
                onSuccess={() => {
                    refetch();
                    // Find the shape and fly to it?
                    // We can do that if we know the ID, but hard to know newly created ID immediately without event logs.
                    // `refetch` will eventually catch it.
                }}
            />
        </div>
    );
}
