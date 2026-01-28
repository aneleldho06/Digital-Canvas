'use client';

import { useState } from 'react';

const faqs = [
    {
        question: "What is Digital Canvas?",
        answer: "Digital Canvas is a decentralized, infinite digital board where BTech students can permanently upload and share notes, PYQs, diagrams, photos, and college memories. Everything lives forever on the blockchain — no more losing important stuff in old WhatsApp groups or expired Google Drive links!"
    },
    {
        question: "Why use blockchain instead of Google Drive or Telegram?",
        answer: "Traditional platforms can delete, lose, or restrict access to your files. With Digital Canvas:\n\n• Content is stored on IPFS (decentralized) and recorded on Ethereum Sepolia testnet\n• Once uploaded, it’s permanent and tamper-proof\n• Only you (the uploader) can delete it — and even deletions are logged forever\n\nThis creates a true community-owned knowledge archive that belongs to students, not a company."
    },
    {
        question: "Is this on real Ethereum? Do I need to spend money?",
        answer: "No real money is involved!\nThe project runs on Sepolia testnet (Ethereum’s free testing network). Gas fees are paid with free test ETH from faucets. All uploads and actions are 100% free during the hackathon and testing."
    },
    {
        question: "How do I upload something?",
        answer: "1. Connect your MetaMask wallet (switch to Sepolia network)\n2. Go to the canvas page\n3. Click the “+” button\n4. Upload an image (notes, PYQ screenshot, meme, etc.)\n5. Confirm the transaction (free on testnet)\n\nYour content appears on the infinite canvas forever!"
    },
    {
        question: "Can anyone see my uploads?",
        answer: "Yes — all content is public and visible to everyone.\nThis is intentional: it’s a shared campus knowledge board. Think of it like an open library wall where everyone benefits from good notes and memories."
    },
    {
        question: "Can I delete my uploads?",
        answer: "Yes — only the wallet that uploaded an item can delete it.\nWhen you delete, it disappears from the canvas… but here’s the cool part: because it’s on the blockchain, you can refresh and it’ll reappear (with a fun toast: “Can’t delete the blockchain! 😎”). This shows true permanence."
    },
    {
        question: "What kind of files can I upload?",
        answer: "Right now (MVP version): images only (JPG, PNG, screenshots of notes/PYQs).\nMax size: ~5 MB per file. Future versions could add PDFs, text notes, etc."
    },
    {
        question: "Is my personal information safe?",
        answer: "You only connect a wallet — no email, name, or phone required.\nYour wallet address is public (like a username), but it’s pseudonymous. No real identity is linked unless you choose to share it."
    },
    {
        question: "Why is the canvas infinite?",
        answer: "So there’s unlimited space! Zoom out to see the whole “campus wall”, zoom in to find specific notes or memories. It’s inspired by fun Web3 pixel worlds but repurposed for education."
    },
    {
        question: "Can juniors or future batches still see my uploads years later?",
        answer: "Yes — that’s the whole point!\nAs long as IPFS gateways exist and the Sepolia testnet is accessible (or you migrate later), your contributions will be there forever. It’s a living archive for every batch that comes after you."
    },
    {
        question: "Is this open-source?",
        answer: "Yes! (Add your GitHub link here once you push it.)\nBuilt for the FOSS mini-hackathon — feel free to fork, improve, or use it for your college."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="w-full max-w-3xl mx-auto mt-20 mb-10 text-left">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden transition-all duration-300 hover:bg-white/15"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                        >
                            <span className="text-lg font-semibold text-white">{faq.question}</span>
                            <span className={`transform transition-transform duration-300 text-blue-300 text-xl font-bold ${openIndex === index ? 'rotate-180' : ''}`}>
                                ⌄
                            </span>
                        </button>
                        <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="px-6 pb-6 text-gray-200 whitespace-pre-line leading-relaxed">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
