'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

// We need the ABI. I'll define a minimal ABI inline or import it.
// For hackathon speed, inline ABI is common if generated file isn't ready.
// But I should try to import from json if possible.
// I'll assume artifacts are not generated yet, so I'll use a const ABI.

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

const ABI = [
    {
        "inputs": [
            { "internalType": "int256", "name": "x", "type": "int256" },
            { "internalType": "int256", "name": "y", "type": "int256" },
            { "internalType": "string", "name": "ipfsHash", "type": "string" },
            { "internalType": "string", "name": "title", "type": "string" }
        ],
        "name": "placeItem",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export function UploadModal({
    isOpen,
    onClose,
    x,
    y,
    onSuccess
}: {
    isOpen: boolean;
    onClose: () => void;
    x: number;
    y: number;
    onSuccess: () => void;
}) {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [uploading, setUploading] = useState(false);

    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });



    // Watch for success
    useEffect(() => {
        if (isSuccess && uploading) {
            setUploading(false);
            onSuccess();
            onClose();
            toast.success("Item placed on chain! 🚀");
        }
    }, [isSuccess, uploading, onSuccess, onClose]);

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        toast.loading("Uploading to IPFS...");

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`
                },
                body: formData
            });

            const data = await res.json();
            if (!data.IpfsHash) throw new Error("Upload failed");

            const ipfsHash = data.IpfsHash;
            toast.dismiss();
            toast.loading("Confirming on wallet...");

            writeContract({
                address: CONTRACT_ADDRESS,
                abi: ABI,
                functionName: 'placeItem',
                args: [BigInt(Math.floor(x)), BigInt(Math.floor(y)), ipfsHash, title || "Untitled"],
            });

        } catch (e) {
            console.error(e);
            toast.error("Upload failed");
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold mb-4">Add to Canvas</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Title (Optional)</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. S3 DSA Notes"
                            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={!file || uploading || isPending || isConfirming}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {uploading || isPending || isConfirming ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : null}
                            {isConfirming ? "Confirming..." : uploading ? "Uploading..." : "Upload Item"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
