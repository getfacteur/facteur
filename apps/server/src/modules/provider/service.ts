import { db } from "@/db";
import { provider } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { ProviderCreateSchema, ProviderUpdateSchema } from "./schemas";
import slugify from "slugify";

export class ProviderService {
  static async store(userId: string, data: ProviderCreateSchema) {
    const slug = slugify(data.name);
    return db
      .insert(provider)
      .values({ ...data, userId, slug })
      .returning();
  }

  static async update(id: string, data: ProviderUpdateSchema) {
    return db.update(provider).set(data).where(eq(provider.id, id)).returning();
  }

  static async getAll(userId: string) {
    return db.query.provider.findMany({
      where: eq(provider.userId, userId),
    });
  }

  static async get(providerId: string) {
    return db.query.provider.findFirst({ where: eq(provider.id, providerId) });
  }

  static async delete(providerId: string) {
    return db.delete(provider).where(eq(provider.id, providerId));
  }
}
