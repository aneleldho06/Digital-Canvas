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
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center text-white bg-cover bg-center" style={{ backgroundImage: "url('/bg.png')" }}>
      <h1 className="text-5xl font-bold mb-4 tracking-tight">
        Digital Canvas 🎨
      </h1>
      <p className="text-xl mb-8 max-w-2xl text-gray-200">
        Your college notes & memories, <span className="font-semibold text-blue-300">forever on chain</span> 🚀
      </p>

      <div className="flex flex-col items-center gap-6">
        <ConnectButton showBalance={false} />

        {mounted && isConnected && (
          <Link
            href="/canvas"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Enter the Canvas →
          </Link>
        )}

        <div className="mt-8 text-sm text-gray-300 max-w-md">
          <p className="mb-2">Sepolia testnet only. Get test ETH here: <a href="https://faucets.chain.link/sepolia" target="_blank" className="text-blue-300 underline">Chainlink Faucet</a></p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-left">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-sm border border-white/20 text-white">
              <strong>Permanent</strong><br />Stored on IPFS & Ethereum.
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-sm border border-white/20 text-white">
              <strong>Owned</strong><br />Only you can delete your uploads.
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-sm border border-white/20 text-white">
              <strong>Public</strong><br />Open for everyone to see.
            </div>
          </div>
        </div>

        <FAQ />
      </div>
    </main>
  );
}
