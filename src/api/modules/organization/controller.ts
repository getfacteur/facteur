import { and, eq } from "drizzle-orm"

import { db } from "#/db"
import { member, organization } from "#/db/schemas"

export class OrganizationController {
  static async isUserMember(userId: string, organizationId: string) {
    const org = await db.query.organization.findFirst({
      where: eq(organization.id, organizationId),
    })

    if (!org) {
      return { exists: false, isMember: false }
    }

    const membership = await db.query.member.findFirst({
      where: and(eq(member.userId, userId), eq(member.organizationId, organizationId)),
    })

    return { exists: true, isMember: !!membership }
  }
}
