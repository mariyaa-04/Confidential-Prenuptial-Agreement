# 💍 Confidential Prenup Smart Contract
# Midnight Starter Template

- A starter template for building on Midnight Network with React frontend and smart contract integration.
- **[Live Demo → counter.nebula.builders](https://counter.nebula.builders)**

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) (v23+) & [npm](https://www.npmjs.com/) (v11+)
- [Docker](https://docs.docker.com/get-docker/)
- [Git LFS](https://git-lfs.com/) (for large files)
- [Compact](https://docs.midnight.network/relnotes/compact-tools) (Midnight developer tools)
- [Lace](https://chromewebstore.google.com/detail/hgeekaiplokcnmakghbdfbgnlfheichg?utm_source=item-share-cb) (Browser wallet extension)
- [Faucet](https://faucet.preview.midnight.network/) (Preview Network Faucet)

## Known Issues

- There’s a not-yet-fixed bug in the arm64 Docker image of the proof server.
- Workaround: Use Bricktower proof server. **bricktowers/proof-server:6.1.0-alpha.6**

## 🛠️ Setup

### 1️⃣ Install Git LFS

```bash
# Install and initialize Git LFS
sudo dnf install git-lfs  # For Fedora/RHEL
git lfs install
```

### 2️⃣ Install Compact Tools

```bash
# Install the latest Compact tools
curl --proto '=https' --tlsv1.2 -LsSf \
  https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
```

```bash
# Install the latest compiler
# Compact compiler version 0.27 should be downloaded manually. Compact tools does not support it currently.
compact update +0.27.0
```

### 3️⃣ Install Node.js and docker

- [Node.js](https://nodejs.org/) & [npm](https://www.npmjs.com/)
- [Docker](https://docs.docker.com/get-docker/)

### 4️⃣ Verify Installation

```bash
# Check versions
node -v
npm -v
docker -v
git lfs version
compact check  # Should show latest version
```

## 📁 Project Structure

```
├── counter-cli/         # CLI tools
├── counter-contract/    # Smart contracts
└── frontend-vite-react/ # React application
```

## 🔗 Setup Instructions

### Install Project Dependencies and compile contracts

```bash
 # In one terminal (from project root)
 npm install
 npm run build
```

### Setup Env variables

1. **Create .env file from template under counter-cli folder**
   - [`counter-cli/.env_template`](./counter-cli/.env_template)

2. **Create .env file from template under frontend-vite-react folder**
   - [`frontend-vite-react/.env_template`](./frontend-vite-react/.env_template)

### Start Development In Preview Network or

```bash
# In one terminal (from project root)
npm run dev:frontend
```

### Start Development In Undeployed Network

```bash
# In one terminal (from project root)
npm run setup-standalone

# In another terminal (from project root)
npm run dev:frontend
```

---

<div align="center"><p>Built with ❤️ by <a href="https://eddalabs.io">Edda Labs</a></p></div>

# 💍 Confidential Prenup Smart Contract

A privacy-preserving smart contract built on the **Midnight blockchain** for managing confidential prenuptial agreements between parties.

## 📋 Project Description

This project demonstrates how to build secure, confidential smart contracts using Midnight's privacy-first architecture. It showcases the deployment of a prenup agreement contract that keeps sensitive financial and personal information private while maintaining verifiable execution on-chain.

**Perfect for:** Understanding Midnight development, privacy-preserving contracts, and multi-party agreement systems.

## 🎯 What It Does

- **Confidential Prenup Agreements**: Deploy and manage prenuptial contracts with privacy guarantees
- **Multi-Party Support**: Handle agreements between two parties (partyA, partyB) with optional arbitrator
- **Privacy-First**: All sensitive data remains confidential using Midnight's zero-knowledge proofs
- **Deployment Automation**: Easy setup and deployment scripts for local, testnet, and mainnet environments

## ✨ Features

- ✅ **Privacy-Preserving**: Data encrypted and verified without exposure
- ✅ **Multi-Environment Support**: Deploy to local, testnet, or mainnet
- ✅ **Configurable Parties**: Easily set participant addresses
- ✅ **Automated Logging**: Track deployments with timestamped logs
- ✅ **Commitment Verification**: Support for commitment hashes
- ✅ **Modern Stack**: Built with TypeScript, Vite React frontend, and Midnight SDK

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Access to Midnight network

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd midnight-starter-template-windows

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your settings
```

### Environment Configuration

Create a `.env` file in the `counter-contract` directory:

```env
NETWORK=local
MIDNIGHT_NODE_URL=http://localhost:8080
PARTY_A_ADDRESS=0x0000000000000000000000000000000000000001
PARTY_B_ADDRESS=0x0000000000000000000000000000000000000002
ARBITRATOR_ADDRESS=0x0000000000000000000000000000000000000003
COMMITMENT_HASH=0x1111111111111111111111111111111111111111111111111111111111111111
MARRIAGE_DATE=2026-02-14
```

### Build & Deploy

```bash
# Build the contract
npm run build

# Setup standalone environment
npm run setup-standalone

# Start frontend (development)
npm run dev:frontend

# Lint code
npm run lint
```

## 📦 Project Structure

```
midnight-starter-template-windows/
├── counter-contract/          # Smart contract source code
│   ├── src/
│   │   ├── config.ts         # Configuration management
│   │   └── managed/          # Contract files
│   └── build/                # Compiled contracts
├── frontend-vite-react/       # React frontend
├── counter-cli/               # CLI tools
└── README.md                  # This file
```

## 🔗 Deployed Smart Contract

**Contract Address:** ``

**Network:** Midnight Testnet  
**Status:** Active  
**Verified:** ✅

## 📚 Available Scripts

```bash
npm run compact              # Compile contracts
npm run build               # Build all packages
npm run setup-standalone     # Initialize standalone environment
npm run dev:frontend         # Start frontend development server
npm run lint                 # Run linter on codebase
```

## 🛠️ Tech Stack

- **Smart Contract**: Midnight Compact Language
- **Backend**: Node.js, TypeScript
- **Frontend**: React + Vite
- **Build Tool**: Turbo
- **Network**: Midnight Blockchain

## 📖 Learn More

- [Midnight Documentation](https://midnight.org/docs)
- [Starter Template Guide](https://midnight.org/starter-template)
- [Smart Contract Best Practices](https://midnight.org/guides/best-practices)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for Midnight** | February 2026
