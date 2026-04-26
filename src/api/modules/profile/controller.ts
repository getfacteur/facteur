import { and, eq } from "drizzle-orm"

import { db } from "#/db"
import { member, profile } from "#/db/schemas"

export class ProfileController {
  static async updateActiveOrg(userId: string, organizationId: string) {
    const membership = await db.query.member.findFirst({
      where: and(eq(member.userId, userId), eq(member.organizationId, organizationId)),
    })

    if (!membership) {
      throw new Error("User is not a member of this organization")
    }

    await db
      .insert(profile)
      .values({
        userId: userId,
        lastActiveOrganization: organizationId,
      })
      .onConflictDoUpdate({
        target: profile.userId,
        set: { lastActiveOrganization: organizationId },
      })
  }
}
