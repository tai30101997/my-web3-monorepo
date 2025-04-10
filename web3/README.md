# 🧠 MY-WEB3-MONOREPO

Monorepo Web3 project using **Nx**, including:

- ✅ Smart Contracts (Hardhat) in `libs/SC`
- ✅ Frontend dApp in `apps/fundme` (e.g. Next.js or other)

---

## 📁 Structure

```
web3/
├── apps/
│   └── fundme/           # Frontend dApp
├── libs/
│   └── SC/               # Smart Contracts
│       ├── src/          # Solidity source
│       ├── scripts/      # Deployment scripts
│       ├── test/         # Unit tests
│       ├── utils/        # Shared config/helpers
│       └── hardhat.config.js
```

---

## 📦 Install dependencies

```bash
pnpm install
# or
npm install
```

---

## 🔨 Build Smart Contracts

```bash
nx build SC
```

This runs:

```bash
npx hardhat compile
```

---

## 🧪 Run Contract Tests

```bash
nx test SC
```

This runs:

```bash
npx hardhat test
```

Tests are located in `libs/SC/test/unit`.

---

## 🚀 Deploy Smart Contracts

```bash
nx run SC:deploy
```

This will execute Hardhat deploy scripts using specific tags like `raffle` or `all`.

Make sure you define tags in your script files, for example:

```js
module.exports.tags = ["all", "raffle"];
```

---

## 🌐 Run Frontend dApp

```bash
nx serve fundme
# or
nx dev fundme
```

Depending on the frontend setup (e.g. Next.js), this starts the frontend app in `apps/fundme`.

---

## 🔗 Useful Commands

| Task                   | Command                        |
|------------------------|--------------------------------|
| Build contracts        | `nx run SC:build`              |
| Run contract tests     | `nx run SC:test`               |
| Deploy contracts       | `nx run SC:deploy`             |
| Run contract tests     | `nx run SC:test`               |
| Clean contracts        | `nx run SC:clean`              |
| coverage  contracts    | `nx run SC:coverage `          |
| Run frontend app       | `nx serve fundme`              |
| Run multiple projects  | `nx run-many --target=build`   |

---

## 🛠️ Requirements

- [Node.js](https://nodejs.org/)
- [PNPM](https://pnpm.io/) (or npm/yarn)
- [Nx CLI](https://nx.dev): `npm install -g nx`
- [Hardhat](https://hardhat.org)

---

## ✅ Notes

- Contracts are written in Solidity and managed with **Hardhat**.
- Nx helps manage modular structure for scalability.
- Frontend and contracts are fully decoupled but can share types/configs if needed.

---

## 📂 Todos

- [ ] Add Etherscan verification step
- [ ] Set up integration tests for contracts
- [ ] CI/CD pipeline for deploy (GitHub Actions / Vercel)

