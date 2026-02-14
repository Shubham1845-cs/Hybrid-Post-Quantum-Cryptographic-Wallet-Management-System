# Hybrid Post-Quantum Cryptographic Wallet Management System

A forward-looking digital wallet manager that combines classical ECDSA with post-quantum Dilithium cryptography to protect against both current and future quantum computing threats.

## Overview

This MERN-based application implements a novel hybrid key pair signature scheme where each wallet requires dual signatures (classical + post-quantum) for transaction authorization. This ensures security against both classical attacks and future quantum computer threats.

## Key Features

- **Hybrid Key Pair Generation**: Combines ECDSA (secp256k1) with Dilithium3 post-quantum cryptography
- **Dual Signature System**: Transactions require both classical and PQC signatures for authorization
- **Secure Key Storage**: AES-256-GCM encryption for private keys
- **Transaction Management**: Complete transaction lifecycle with verification
- **React Frontend**: User-friendly interface for wallet and transaction management
- **REST API Backend**: Express.js API with comprehensive error handling
- **MongoDB Persistence**: Secure storage for wallets and transaction history

## Technology Stack

### Backend
- Node.js with TypeScript
- Express.js for REST API
- MongoDB with Mongoose ODM
- ECDSA (elliptic library)
- Dilithium post-quantum cryptography
- AES-256-GCM encryption

### Frontend
- React with TypeScript
- Axios for API communication
- React Router for navigation
- Modern CSS framework (TBD)

### Testing
- Jest for unit testing
- fast-check for property-based testing
- Supertest for API testing
- React Testing Library

## Project Structure

```
ClassicalQuantum/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/    # API request handlers
│   │   ├── services/       # Business logic (Key Manager, Transaction Processor, etc.)
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   └── server.ts       # Entry point
│   ├── tests/              # Backend tests
│   │   ├── unit/
│   │   ├── property/
│   │   └── integration/
│   └── package.json
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API client
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Helper functions
│   └── package.json
│
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (see `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hybrid-pqc-wallet
NODE_ENV=development
```

4. Start development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (see `.env.example`):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm start
```

## Development

### Running Tests

Backend tests:
```bash
cd backend
npm test                    # Run all tests
npm run test:unit          # Run unit tests only
npm run test:property      # Run property-based tests only
npm run test:integration   # Run integration tests only
```

Frontend tests:
```bash
cd frontend
npm test
```

### Code Quality

Run linting:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

## API Documentation

### Wallet Endpoints

- `POST /api/wallet/generate` - Generate new hybrid key pair
- `GET /api/wallet/:address` - Retrieve wallet information
- `GET /api/wallet/:address/export` - Export wallet data

### Transaction Endpoints

- `POST /api/transaction/create` - Create and sign transaction
- `POST /api/transaction/verify` - Verify transaction signatures
- `GET /api/transaction/history/:address` - Get transaction history

## Security Considerations

- Private keys are encrypted with AES-256-GCM before storage
- Passwords are never stored or transmitted in plaintext
- All transactions require dual signatures (classical + PQC)
- Nonce-based replay attack prevention
- Input validation on all API endpoints
- Secure random number generation for cryptographic operations

## Architecture

The system implements a three-tier architecture:

1. **Frontend (React)**: User interface for wallet management
2. **Backend (Express)**: REST API and cryptographic operations
3. **Database (MongoDB)**: Persistent storage

Key components:
- **Key Manager**: Generates and manages hybrid key pairs
- **Transaction Processor**: Constructs and signs transactions
- **Signature Validator**: Verifies dual signatures

## Testing Strategy

- **Unit Tests**: Specific examples and edge cases
- **Property-Based Tests**: Universal correctness properties (100+ iterations)
- **Integration Tests**: End-to-end workflows
- **Security Tests**: Cryptographic validation and attack prevention

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Ensure all tests pass
5. Submit a pull request

## License

[Add your license here]

## Patent Notice

This project implements a novel hybrid cryptographic signature scheme. Patent pending: "System and Method for Hybrid Cryptographic Signature Generation and Management in a Digital Wallet."

## Contact

[Add your contact information]

## Acknowledgments

- NIST Post-Quantum Cryptography Standardization Project
- Dilithium cryptographic algorithm team
- Open-source cryptography community
