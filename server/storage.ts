import { users, webhookRequests, type User, type InsertUser, type WebhookRequest, type InsertWebhookRequest } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createWebhookRequest(request: InsertWebhookRequest): Promise<WebhookRequest>;
  getWebhookRequests(): Promise<WebhookRequest[]>;
  updateWebhookRequestStatus(id: number, status: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private webhookRequests: Map<number, WebhookRequest>;
  private currentUserId: number;
  private currentWebhookId: number;

  constructor() {
    this.users = new Map();
    this.webhookRequests = new Map();
    this.currentUserId = 1;
    this.currentWebhookId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createWebhookRequest(insertRequest: InsertWebhookRequest): Promise<WebhookRequest> {
    const id = this.currentWebhookId++;
    const request: WebhookRequest = {
      ...insertRequest,
      id,
      timestamp: new Date(),
      status: "pending"
    };
    this.webhookRequests.set(id, request);
    return request;
  }

  async getWebhookRequests(): Promise<WebhookRequest[]> {
    return Array.from(this.webhookRequests.values());
  }

  async updateWebhookRequestStatus(id: number, status: string): Promise<void> {
    const request = this.webhookRequests.get(id);
    if (request) {
      request.status = status;
      this.webhookRequests.set(id, request);
    }
  }
}

export const storage = new MemStorage();
