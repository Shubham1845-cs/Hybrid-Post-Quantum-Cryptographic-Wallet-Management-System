import mongoose from 'mongoose';

interface ConnectionOptions {
  maxRetries?: number;
  retryDelay?: number;
}

class Database {
  private static instance: Database;
  private connectionString: string;
  private maxRetries: number;
  private retryDelay: number;
  private retryCount: number = 0;

  private constructor() {
    this.connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/hybrid-pqc-wallet';
    this.maxRetries = 5;
    this.retryDelay = 5000; // 5 seconds
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(options?: ConnectionOptions): Promise<void> {
    if (options?.maxRetries) this.maxRetries = options.maxRetries;
    if (options?.retryDelay) this.retryDelay = options.retryDelay;

    await this.attemptConnection();
  }

  private async attemptConnection(): Promise<void> {
    try {
      await mongoose.connect(this.connectionString);
      
      console.log('✅ MongoDB connected successfully');
      console.log(`📊 Database: ${mongoose.connection.name}`);
      console.log(`🔗 Host: ${mongoose.connection.host}`);
      
      this.retryCount = 0;
      this.setupEventHandlers();
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`🔄 Retrying connection (${this.retryCount}/${this.maxRetries}) in ${this.retryDelay / 1000}s...`);
        
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        await this.attemptConnection();
      } else {
        console.error('💥 Max retry attempts reached. Could not connect to MongoDB.');
        throw new Error('Failed to connect to MongoDB after maximum retries');
      }
    }
  }

  private setupEventHandlers(): void {
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB error:', error);
    });
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('👋 MongoDB disconnected gracefully');
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  public getConnection() {
    return mongoose.connection;
  }

  public isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }
}

export default Database;
