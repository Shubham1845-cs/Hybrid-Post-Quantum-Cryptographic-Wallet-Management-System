# System Architecture - Hybrid Post-Quantum Cryptographic Wallet

## High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        ReactApp[React Application]
    end
    
    subgraph "Frontend Layer"
        UI[User Interface Components]
        StateManager[State Management]
        APIClient[API Client Service]
    end
    
    subgraph "Backend Layer"
        API[REST API Layer]
        Controllers[Controllers]
        Services[Business Logic Services]
        Middleware[Middleware]
    end
    
    subgraph "Service Layer"
        KeyManager[Key Manager Service]
        TxProcessor[Transaction Processor]
        SigValidator[Signature Validator]
        CryptoWrapper[Crypto Library Wrapper]
    end
    
    subgraph "Cryptographic Layer"
        ECDSA[ECDSA Library<br/>secp256k1]
        Dilithium[Dilithium Library<br/>Post-Quantum]
        AES[AES-256-GCM<br/>Encryption]
    end
    
    subgraph "Data Layer"
        MongoDB[(MongoDB Database)]
        WalletCollection[(Wallet Collection)]
        TxCollection[(Transaction Collection)]
    end
    
    Browser --> ReactApp
    ReactApp --> UI
    UI --> StateManager
    StateManager --> APIClient
    APIClient -->|HTTPS| API
    
    API --> Middleware
    Middleware --> Controllers
    Controllers --> Services
    
    Services --> KeyManager
    Services --> TxProcessor
    Services --> SigValidator
    
    KeyManager --> CryptoWrapper
    TxProcessor --> CryptoWrapper
    SigValidator --> CryptoWrapper
    
    CryptoWrapper --> ECDSA
    CryptoWrapper --> Dilithium
    CryptoWrapper --> AES
    
    KeyManager --> MongoDB
    TxProcessor --> MongoDB
    SigValidator --> MongoDB
    
    MongoDB --> WalletCollection
    MongoDB --> TxCollection
    
    style Browser fill:#e1f5ff
    style ReactApp fill:#bbdefb
    style API fill:#fff9c4
    style MongoDB fill:#c8e6c9
    style ECDSA fill:#ffccbc
    style Dilithium fill:#ffccbc
```

## Component Architecture

```mermaid
graph LR
    subgraph "Frontend Components"
        Dashboard[Wallet Dashboard]
        KeyGen[Key Generation UI]
        TxForm[Transaction Form]
        TxHistory[Transaction History]
        Loading[Loading Component]
        Error[Error Component]
    end
    
    subgraph "Backend Services"
        KM[Key Manager]
        TP[Transaction Processor]
        SV[Signature Validator]
    end
    
    subgraph "API Endpoints"
        E1[POST /wallet/generate]
        E2[GET /wallet/:address]
        E3[POST /transaction/create]
        E4[POST /transaction/verify]
        E5[GET /transaction/history/:address]
    end
    
    Dashboard --> E2
    KeyGen --> E1
    TxForm --> E3
    TxHistory --> E5
    
    E1 --> KM
    E2 --> KM
    E3 --> TP
    E4 --> SV
    E5 --> TP
    
    style Dashboard fill:#e3f2fd
    style KeyGen fill:#e3f2fd
    style TxForm fill:#e3f2fd
    style TxHistory fill:#e3f2fd
    style KM fill:#fff3e0
    style TP fill:#fff3e0
    style SV fill:#fff3e0
```

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant KeyManager
    participant ECDSA
    participant Dilithium
    participant Database
    
    User->>Frontend: Generate Wallet
    Frontend->>API: POST /wallet/generate
    API->>KeyManager: generateHybridKeyPair()
    
    KeyManager->>ECDSA: Generate ECDSA Key Pair
    ECDSA-->>KeyManager: Classical Keys
    
    KeyManager->>Dilithium: Generate Dilithium Key Pair
    Dilithium-->>KeyManager: PQC Keys
    
    KeyManager->>KeyManager: Combine Keys + Derive Address
    KeyManager->>KeyManager: Encrypt Private Keys
    KeyManager->>Database: Store Wallet
    Database-->>KeyManager: Success
    
    KeyManager-->>API: Wallet Data
    API-->>Frontend: Wallet Address + Public Keys
    Frontend-->>User: Display Wallet Info
```

## Transaction Flow Architecture

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant TxProcessor
    participant ECDSA
    participant Dilithium
    participant Database
    
    User->>Frontend: Create Transaction
    Frontend->>API: POST /transaction/create
    API->>TxProcessor: constructTransaction()
    
    TxProcessor->>TxProcessor: Validate Inputs
    TxProcessor->>TxProcessor: Create Payload
    TxProcessor->>TxProcessor: Hash Payload
    
    TxProcessor->>ECDSA: Sign with Classical Key
    ECDSA-->>TxProcessor: Classical Signature
    
    TxProcessor->>Dilithium: Sign with PQC Key
    Dilithium-->>TxProcessor: PQC Signature
    
    TxProcessor->>TxProcessor: Combine Dual Signature
    TxProcessor->>Database: Store Transaction
    Database-->>TxProcessor: Success
    
    TxProcessor-->>API: Signed Transaction
    API-->>Frontend: Transaction ID + Status
    Frontend-->>User: Display Success
```

## Signature Verification Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant SigValidator
    participant ECDSA
    participant Dilithium
    participant Database
    
    Client->>API: POST /transaction/verify
    API->>SigValidator: verifyTransaction()
    
    SigValidator->>Database: Get Sender Public Keys
    Database-->>SigValidator: Public Keys
    
    SigValidator->>SigValidator: Extract Dual Signature
    SigValidator->>SigValidator: Reconstruct Payload
    
    par Parallel Verification
        SigValidator->>ECDSA: Verify Classical Signature
        ECDSA-->>SigValidator: Valid/Invalid
    and
        SigValidator->>Dilithium: Verify PQC Signature
        Dilithium-->>SigValidator: Valid/Invalid
    end
    
    SigValidator->>SigValidator: Combine Results
    
    alt Both Valid
        SigValidator->>Database: Mark as Verified
        SigValidator-->>API: Verification Success
    else Either Invalid
        SigValidator-->>API: Verification Failed
    end
    
    API-->>Client: Verification Result
```

## Database Schema Architecture

```mermaid
erDiagram
    WALLET ||--o{ TRANSACTION : creates
    WALLET ||--o{ TRANSACTION : receives
    
    WALLET {
        ObjectId _id PK
        string address UK
        Buffer classical_public_key
        Buffer pqc_public_key
        Buffer encrypted_classical_private
        Buffer encrypted_pqc_private
        Buffer encryption_iv
        Buffer encryption_auth_tag
        number balance
        number nonce
        Date createdAt
        Date updatedAt
    }
    
    TRANSACTION {
        ObjectId _id PK
        string txId UK
        string sender FK
        string recipient FK
        number amount
        number timestamp
        number nonce
        Buffer classical_signature
        Buffer pqc_signature
        boolean verified
        boolean classical_valid
        boolean pqc_valid
        Date verified_at
        Date createdAt
    }
```

## Security Architecture

```mermaid
graph TB
    subgraph "Security Layers"
        L1[Layer 1: Transport Security]
        L2[Layer 2: Authentication]
        L3[Layer 3: Encryption]
        L4[Layer 4: Dual Signature]
        L5[Layer 5: Replay Protection]
    end
    
    subgraph "Layer 1 Details"
        HTTPS[HTTPS/TLS]
        CORS[CORS Policy]
        Helmet[Security Headers]
    end
    
    subgraph "Layer 2 Details"
        Password[Password Verification]
        RateLimit[Rate Limiting]
    end
    
    subgraph "Layer 3 Details"
        AES256[AES-256-GCM]
        PBKDF2[PBKDF2 Key Derivation]
    end
    
    subgraph "Layer 4 Details"
        ECDSASig[ECDSA Signature]
        DilithiumSig[Dilithium Signature]
        BothRequired[Both Required for Validity]
    end
    
    subgraph "Layer 5 Details"
        Nonce[Nonce Validation]
        Timestamp[Timestamp Checking]
    end
    
    L1 --> L2
    L2 --> L3
    L3 --> L4
    L4 --> L5
    
    L1 -.-> HTTPS
    L1 -.-> CORS
    L1 -.-> Helmet
    
    L2 -.-> Password
    L2 -.-> RateLimit
    
    L3 -.-> AES256
    L3 -.-> PBKDF2
    
    L4 -.-> ECDSASig
    L4 -.-> DilithiumSig
    L4 -.-> BothRequired
    
    L5 -.-> Nonce
    L5 -.-> Timestamp
    
    style L1 fill:#ffebee
    style L2 fill:#fce4ec
    style L3 fill:#f3e5f5
    style L4 fill:#ede7f6
    style L5 fill:#e8eaf6
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        LB[Load Balancer]
        
        subgraph "Application Servers"
            App1[Node.js Instance 1]
            App2[Node.js Instance 2]
            App3[Node.js Instance 3]
        end
        
        subgraph "Static Assets"
            CDN[CDN / Static Hosting]
            React[React Build]
        end
        
        subgraph "Database Cluster"
            Primary[(MongoDB Primary)]
            Secondary1[(MongoDB Secondary 1)]
            Secondary2[(MongoDB Secondary 2)]
        end
        
        subgraph "Monitoring"
            Logs[Log Aggregation]
            Metrics[Metrics Collection]
            Alerts[Alert System]
        end
    end
    
    Users[Users] --> CDN
    Users --> LB
    
    CDN --> React
    
    LB --> App1
    LB --> App2
    LB --> App3
    
    App1 --> Primary
    App2 --> Primary
    App3 --> Primary
    
    Primary --> Secondary1
    Primary --> Secondary2
    
    App1 --> Logs
    App2 --> Logs
    App3 --> Logs
    
    Logs --> Metrics
    Metrics --> Alerts
    
    style Users fill:#e1f5ff
    style CDN fill:#fff9c4
    style LB fill:#c8e6c9
    style Primary fill:#ffccbc
```

## Technology Stack Diagram

```mermaid
graph LR
    subgraph "Frontend Stack"
        React[React 18]
        TS1[TypeScript]
        Axios[Axios]
        Router[React Router]
        CSS[CSS Framework]
    end
    
    subgraph "Backend Stack"
        Node[Node.js]
        Express[Express.js]
        TS2[TypeScript]
        Mongoose[Mongoose ODM]
    end
    
    subgraph "Cryptography Stack"
        Elliptic[Elliptic<br/>ECDSA]
        Dil[Dilithium<br/>PQC]
        Crypto[Node Crypto<br/>AES-256]
    end
    
    subgraph "Testing Stack"
        Jest[Jest]
        FastCheck[fast-check<br/>Property Tests]
        Supertest[Supertest<br/>API Tests]
        RTL[React Testing<br/>Library]
    end
    
    subgraph "Database"
        Mongo[(MongoDB)]
    end
    
    React --> Axios
    Axios --> Express
    Express --> Mongoose
    Mongoose --> Mongo
    
    Express --> Elliptic
    Express --> Dil
    Express --> Crypto
    
    Jest --> FastCheck
    Jest --> Supertest
    Jest --> RTL
    
    style React fill:#61dafb
    style Express fill:#90c53f
    style Mongo fill:#4db33d
    style Elliptic fill:#ff6b6b
    style Dil fill:#ff6b6b
```

## Key Generation Process

```mermaid
flowchart TD
    Start([User Requests Wallet]) --> Input[Enter Password]
    Input --> GenECDSA[Generate ECDSA Key Pair<br/>secp256k1 curve]
    GenECDSA --> GenDil[Generate Dilithium Key Pair<br/>Dilithium3 parameters]
    GenDil --> Combine[Combine Public Keys]
    Combine --> Hash[Hash Combined Keys<br/>SHA-256]
    Hash --> Address[Derive Wallet Address<br/>Hex encoding]
    Address --> Encrypt[Encrypt Private Keys<br/>AES-256-GCM + PBKDF2]
    Encrypt --> Store[Store in MongoDB]
    Store --> Return[Return Wallet Info]
    Return --> End([Display to User])
    
    style Start fill:#e8f5e9
    style GenECDSA fill:#fff3e0
    style GenDil fill:#fff3e0
    style Encrypt fill:#ffebee
    style Store fill:#e3f2fd
    style End fill:#e8f5e9
```

## Transaction Signing Process

```mermaid
flowchart TD
    Start([Create Transaction]) --> Validate{Validate Inputs}
    Validate -->|Invalid| Error1[Return Error]
    Validate -->|Valid| Construct[Construct Payload<br/>sender, recipient, amount, nonce]
    Construct --> Serialize[Serialize to Bytes]
    Serialize --> Hash[Hash with SHA-256]
    Hash --> SignClassical[Sign with ECDSA<br/>Classical Private Key]
    SignClassical --> SignPQC[Sign with Dilithium<br/>PQC Private Key]
    SignPQC --> Combine[Combine into Dual Signature]
    Combine --> Attach[Attach to Transaction]
    Attach --> Store[Store in Database]
    Store --> Return[Return Signed Transaction]
    Return --> End([Transaction Complete])
    
    Error1 --> End
    
    style Start fill:#e8f5e9
    style Validate fill:#fff9c4
    style SignClassical fill:#ffebee
    style SignPQC fill:#ffebee
    style Store fill:#e3f2fd
    style End fill:#e8f5e9
```

---

## Architecture Principles

### 1. **Separation of Concerns**
- Frontend handles UI/UX only
- Backend handles business logic and cryptography
- Database handles persistence

### 2. **Security by Design**
- Multiple layers of security
- Dual signature requirement
- Encrypted storage
- No private key transmission

### 3. **Scalability**
- Stateless API design
- Horizontal scaling capability
- Database indexing for performance

### 4. **Maintainability**
- Clear component boundaries
- TypeScript for type safety
- Comprehensive testing strategy

### 5. **Future-Proof**
- Post-quantum cryptography ready
- Modular design for algorithm updates
- Extensible architecture

