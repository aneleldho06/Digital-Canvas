# Digital Canvas 🎨

A decentralized infinite digital board for college students to permanently share notes and memories.
**Hackathon MVP (3-Day Build)**

## 🚀 Features
- **Infinite Canvas**: Zoomable, pannable board powered by `tldraw`.
- **Permanent Storage**: Images uploaded to IPFS (Pinata) and recorded on Ethereum Sepolia.
- **Ownership**: Only the uploader can delete their items (but history remains on-chain!).
- **Web3 First**: Connect with RainbowKit, sign with Wagmi.

## 🛠 Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Canvas**: tldraw
- **Web3**: RainbowKit, Wagmi, Viem
- **Smart Contract**: Solidity 0.8.20 (Hardhat / Remix)
- **Storage**: Pinata IPFS

## 📦 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env.local` file with the following:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id_from_cloud_walletconnect_com
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token
NEXT_PUBLIC_GATEWAY_URL=https://gateway.pinata.cloud
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
```

### 3. Deploy Smart Contract
You need to deploy the contract to Sepolia Testnet.

**Option A: Using Remix (Easiest)**
1. Open [Remix IDE](https://remix.ethereum.org).
2. Create a new file `DigitalCanvas.sol` and paste the content from `contracts/DigitalCanvas.sol`.
3. Compile (Ctrl+S).
4. Go to "Deploy & Run Transactions", select "Injected Provider - MetaMask".
5. Ensure you are on **Sepolia** network in MetaMask.
6. Click **Deploy**.
7. Copy the Deployed Contract Address and paste it into `.env.local`.

**Option B: Using Hardhat**
1. Add `PRIVATE_KEY` and `SEPOLIA_RPC` to `.env`.
2. Run:
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```
3. Copy the address to `.env.local`.

### 4. Run the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## 🎮 How to Demo (Hackathon Flow)
1. **Landing**: Show the "Connect Wallet" button. Connect a Sepolia wallet.
2. **Enter Canvas**: Click the button to go to `/canvas`.
3. **Upload**:
   - Click the floating **+** button.
   - Select an image (e.g., a meme or note).
   - Click "Upload".
   - Approve the transaction.
   - Wait for it to appear on the canvas.
4. **Interact**: Pan and zoom around to show it's "Infinite".
5. **Delete (Permanence Demo)**:
   - Click your item to select it.
   - Click the **Delete** button that appears.
   - Confirm transaction.
   - Item disappears locally.
   - **Refresh the page**: The item reappears with a "DELETED" stamp, proving "Blockchain is forever!" 😎.

## 📜 License
MIT
