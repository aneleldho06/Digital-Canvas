'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FAQ } from '@/components/FAQ';

export default function Home() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <main className="min-h-screen text-white bg-cover bg-center bg-fixed overflow-x-hidden" style={{ backgroundImage: "url('/bg.png')" }}>
      {/* 1. Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative">
        <div className="absolute inset-0 bg-black/30 pointer-events-none" /> {/* Overlay for readability */}

        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-6xl font-bold mb-4 tracking-tight drop-shadow-lg">
            Digital Canvas 🎨
          </h1>
          <p className="text-2xl mb-12 max-w-2xl text-gray-100 drop-shadow-md font-light">
            Your college notes & memories, <span className="font-semibold text-blue-300">forever on chain</span> 🚀
          </p>

          <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
            <ConnectButton showBalance={false} />

            {mounted && isConnected && (
              <Link
                href="/canvas"
                className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform"
              >
                Enter the Canvas →
              </Link>
            )}

            <div className="mt-8 text-sm text-gray-200">
              <p className="mb-6 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm inline-block border border-white/10">
                Sepolia testnet only. Get test ETH here: <a href="https://faucets.chain.link/sepolia" target="_blank" className="text-blue-300 underline font-semibold hover:text-blue-200">Chainlink Faucet</a>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full mt-4">
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 hover:bg-white/20 transition-all">
                  <strong className="text-xl block mb-2 text-blue-200">Permanent</strong>Stored on IPFS & Ethereum.
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 hover:bg-white/20 transition-all">
                  <strong className="text-xl block mb-2 text-green-200">Owned</strong>Only you can delete your uploads.
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 hover:bg-white/20 transition-all">
                  <strong className="text-xl block mb-2 text-purple-200">Public</strong>Open for everyone to see.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 animate-bounce opacity-70">
          <span className="text-4xl">⌄</span>
        </div>
      </section>

      {/* 2. FAQ Section */}
      <section className="py-24 px-4 bg-black/40 backdrop-blur-sm min-h-[80vh] flex items-center">
        <FAQ />
      </section>

      {/* 3. Footer & Contact Section */}
      <footer className="py-12 px-8 bg-black/80 text-center text-gray-400 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
          <h3 className="text-2xl font-bold text-white">Get in Touch</h3>
          <p className="max-w-xl text-lg">
            Have questions or want to contribute? Reaching out is easy.
          </p>

          <div className="flex gap-6 mt-2">
            <a href="#" className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-all flex items-center gap-2">
              GitHub 🐙
            </a>
            <a href="#" className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-all flex items-center gap-2">
              Twitter 🐦
            </a>
            <a href="mailto:hello@digitalcanvas.test" className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-all flex items-center gap-2">
              Email ✉️
            </a>
          </div>

          <div className="mt-12 text-sm opacity-50">
            <p>© {new Date().getFullYear()} Digital Canvas. Built for Hackathon.</p>
            <p className="mt-2 text-xs">Decentralized & Permanent.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
