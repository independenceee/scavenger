<div align="center">

<img src="https://www.cardano2vn.io/images/common/loading.png" width="120" alt="Scavenger Logo" />

# **Scavenger**

**A decentralized wallet and donation aggregation platform for Cardano's blockchain ecosystem**

[![Bun](https://img.shields.io/badge/Bun-Runtime-orange?logo=bun)](https://bun.sh/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Cardano](https://img.shields.io/badge/Cardano-Blockchain-green?logo=cardano)](https://cardano.org/)
[![Mesh SDK](https://img.shields.io/badge/Mesh%20SDK-Latest-blue?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzAwNjZDQyIgZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6Ii8+PC9zdmc+)](https://meshjs.dev/)
[![Blockfrost](https://img.shields.io/badge/Blockfrost-API-blue?logo=bitcoin)](https://blockfrost.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

</div>

## About Scavenger

Scavenger is an open-source toolkit designed for Cardano wallet management, token allocation tracking, and decentralized donation coordination. Built with TypeScript and powered by the Mesh SDK, Scavenger provides developers and users with a robust set of utilities to interact with the Cardano blockchain efficiently.

The platform enables seamless operations including wallet generation from mnemonics, registration of wallets with challenge-based authentication, real-time token allocation tracking (specifically for NIGHT tokens), and automated donation aggregation to centralized wallets. By leveraging **Blockfrost API** for blockchain queries and **Mesh SDK** for wallet operations, Scavenger ensures secure, transparent, and decentralized token management without intermediaries.

Scavenger is ideal for:

- **Token Distribution Programs**: Automate wallet registration and token allocation tracking
- **Fundraising Campaigns**: Aggregate donations from multiple sources into a single wallet
- **Community Projects**: Manage multi-wallet funding with transparent, on-chain records
- **Developer Tools**: Build automation scripts for batch wallet operations

### Key Features

- **Multi-Wallet Generation**: Create and manage multiple Cardano wallets from a single mnemonic seed phrase
- **Cryptographic Authentication**: Sign challenges with wallet signatures for secure registration
- **Real-Time Allocation Tracking**: Query NIGHT token allocations across wallets via Blockfrost API
- **Automated Donation Aggregation**: Batch transfer accumulated tokens to designated destinations
- **Bip32/Bip39 Compliance**: Industry-standard key derivation following Cardano specifications
- **Batch Processing**: Handle hundreds of wallets efficiently with configurable account indices
- **TypeScript Support**: Fully typed codebase for better IDE support and type safety

### Use Cases

- **Crypto Projects**: Distribute tokens to community members with automated registration workflows
- **Gaming Economies**: Manage in-game currency allocation across player wallets
- **DAOs & Communities**: Facilitate transparent multi-wallet governance and treasury management
- **Hackathons & Grants**: Track and aggregate funding from multiple contributors

---

## 🌐 Features

Scavenger provides three core CLI tools for different phases of wallet and token management:

### **Challenge Management** (`npm run challenge`)

- Register wallets with server-side challenge-based authentication
- Generate signatures using wallet private keys for secure proof-of-ownership
- Retrieve registration receipts with immutable preimage and timestamp data
- Create challenge queues for wallet verification workflows
- Batch process hundreds of wallets with configurable starting indices

**Use Case**: Initial wallet registration and KYC-style verification without storing private keys server-side.

### **Wallet Statistics** (`npm run wallet`)

- Query real-time NIGHT token allocations for multiple wallets
- Aggregate total token amounts across entire wallet sets
- Generate wallet snapshots with account indices and current balances
- Export statistics to JSON for reporting and analysis
- Compatible with Cardano preview/testnet and mainnet

**Use Case**: Transparent token allocation reporting for stakeholders and community dashboards.

### **Donation Aggregation** (`npm run donate`)

- Batch transfer accumulated tokens from multiple wallets to a single destination
- Sign transactions with wallet credentials for proof of authorization
- Generate cryptographic receipts for audit trails
- Support for multi-wallet delegation scenarios
- Non-custodial: wallets retain full control of their keys

**Use Case**: Consolidate community donations or project funds from distributed sources into a treasury wallet.

---

## 🛠️ Technology Stack

| Component        | Technologies                      | Purpose                                                          |
| ---------------- | --------------------------------- | ---------------------------------------------------------------- |
| **Runtime**      | Bun, Node.js 18+, TypeScript      | High-performance script execution with type safety               |
| **Blockchain**   | Mesh SDK, Blockfrost API, Cardano | Wallet operations, blockchain queries, and transaction building  |
| **Cryptography** | bip39, blakejs, cbor, csl-nodejs  | Key derivation, hashing, and serialization per Cardano standards |
| **HTTP Client**  | Axios                             | API communication with Blockfrost and custom servers             |

---

## ⚡ Getting Started

Follow these steps to set up Scavenger locally. Prerequisites: Bun or Node.js 18+, and Blockfrost API credentials.

### 1. Clone the Repository

```bash
git clone https://github.com/independenceee/scavenger.git
cd scavenger
```

### 2. Install Dependencies

```bash
# Using Bun (recommended for faster execution)
bun install

# Or using npm
npm install

# Or using yarn
yarn install
```

### 3. Configure Environment

Create a `.env` file in the project root:

```env
# Blockfrost API Configuration
BLOCKFROST_API_KEY=your_blockfrost_api_key_here
BASE_URL=https://scavenger.prod.gd.midnighttge.io

# Wallet Generation Settings
MNEMONIC=your twelve or twenty four word seed phrase here
ACCOUNT_INDEX_START=0
AMOUNT_ACCOUNT=10

# Donation Settings (for donate script)
DESTINATION_WALLET_ADDRESS=addr1q8r...your_destination_wallet...
```

**Obtain API Keys:**

- **Blockfrost**: Sign up at [Blockfrost](https://blockfrost.io/) and create a new project
- **Mnemonic**: Generate securely from your Cardano wallet (e.g., Nami, Eternl)
- **Destination Address**: Your Cardano wallet address (preview/testnet or mainnet)

### 4. Run the Scripts

**Register Wallets & Generate Challenges:**

```bash
bun run challenge
```

Output: `challenges.json` containing registration receipts and challenge queues

**Check Wallet Balances:**

```bash
bun run wallet
```

Output: `wallet.json` with account indices, addresses, and NIGHT token allocations

**Aggregate & Send Donations:**

```bash
bun run donate
```

Output: Console logs showing transaction signatures and API responses

### 5. Build for Distribution

```bash
bun build ./src/challenge/index.ts --outfile dist/challenge.js
bun build ./src/wallet/index.ts --outfile dist/wallet.js
bun build ./src/donate/index.ts --outfile dist/donate.js
```

---

## 📁 Project Structure

```
scavenger/
├── src/
│   ├── challenge/
│   │   └── index.ts          # Wallet registration & signature challenge logic
│   ├── donate/
│   │   └── index.ts          # Batch donation aggregation script
│   └── wallet/
│       └── index.ts          # Token allocation queries & statistics
├── examples/
│   └── challenges.json       # Example output format
├── .env.example              # Environment template
├── package.json              # Dependencies and scripts
├── README.md                 # This file
└── LICENSE                   # MIT License
```

### File Descriptions

- **`src/challenge/index.ts`**: Derives wallet addresses from mnemonic, signs T&C messages, registers with backend, and stores registration data
- **`src/wallet/index.ts`**: Queries Blockfrost for NIGHT allocations per wallet and exports aggregated totals
- **`src/donate/index.ts`**: Signs donation authorization messages, submits batch transfers to destination wallet
- **`examples/challenges.json`**: Sample output showing registration receipt structure

---

## 🔐 Security Considerations

- **Private Keys**: Never commit `.env` files or mnemonics to version control. Use `.env.local` or `.gitignore`
- **Signatures**: All wallet operations are signed client-side; servers never receive raw private keys
- **Blockfrost API**: Treat API keys as secrets; rotate periodically
- **Network**: Use HTTPS/WSS for all external API calls in production
- **Batch Limits**: For large wallet sets (>1000), throttle API calls to avoid rate limiting
- **Backup**: Store seed phrases in secure, offline locations (hardware wallets, vaults)

---

## 🧑‍💻 Developer Notes

- **Bun vs Node.js**: Bun runs 2-3x faster; both are supported
- **Account Indices**: Follows BIP-44 Cardano standard (1852'/1815'/{index}')
- **Lovelace**: 1 ADA = 1,000,000 lovelace; amounts in code use lovelace
- **API Rate Limits**: Blockfrost free tier: 50 req/sec; adjust `AMOUNT_ACCOUNT` accordingly
- **Error Handling**: Scripts log detailed errors; check console for troubleshooting
- **Extending**: Add new scripts in `src/` following the same structure; update `package.json` scripts

**Testing Locally:**

```bash
# Test with smaller account set first
export AMOUNT_ACCOUNT=2
bun run wallet

# Monitor API usage
curl https://api.blockfrost.io/api/v0/account/usage -H "project_id: $BLOCKFROST_API_KEY"
```

---

## 🤝 Contributing

We welcome contributions! Whether you're adding features, fixing bugs, improving documentation, or optimizing performance, your help is valued.

### How to Contribute

1. Fork the repository and create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes with clear, descriptive commits:

   ```bash
   git commit -m "Add: feature description"
   git commit -m "Fix: bug description"
   ```

3. Push to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

4. Open a Pull Request with a detailed description of changes

### Guidelines

- Follow ESLint and Prettier configurations
- Include error handling for API failures
- Test with multiple wallet counts before submitting
- Update README if adding new scripts or environment variables
- Keep commits atomic and focused

### Ideas for Contribution

- Multi-token support (not just NIGHT)
- Database integration for persistent wallet records
- Webhook support for real-time notifications
- CLI argument parsing (instead of just `.env`)
- Unit tests with Jest
- Docker containerization for batch processing
- Web dashboard for wallet management

---

## 📚 Documentation & Resources

- [Cardano Developer Portal](https://developers.cardano.org/)
- [Mesh SDK Documentation](https://meshjs.dev/)
- [Blockfrost API Docs](https://docs.blockfrost.io/)
- [CIP-30 Wallet Standard](https://github.com/cardano-foundation/CIPs/tree/master/CIP-0030)
- [BIP-44 Specification](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)
- [Cardano CLI Reference](https://github.com/input-output-hk/cardano-cli)

---

## 📝 License

This project is licensed under the [MIT License](LICENSE). Copyright © 2025 independenceee. Free to use, modify, and distribute in accordance with the license terms.

---

## 📞 Support

For questions, bug reports, or feature requests:

- Open an issue on [GitHub Issues](https://github.com/independenceee/scavenger/issues)
- Check existing documentation and examples first
- Include environment details (OS, Node/Bun version, error logs) in reports

---

**Made with ❤️ by the Scavenger community**
