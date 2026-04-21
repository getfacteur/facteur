import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { organization, admin } from "better-auth/plugins"
import { eq } from "drizzle-orm"

import { db } from "#/db"
import { member, profile } from "#/db/schemas"

import { env } from "./env.server"

const getLastActiveOrganizationId = async (userId: string) => {
  const memberships = await db
    .select({ organizationId: member.organizationId })
    .from(member)
    .where(eq(member.userId, userId))

  if (memberships.length === 0) {
    return null
  }

  const membershipIds = new Set(memberships.map(({ organizationId }) => organizationId))
  const profileData = await db.query.profile.findFirst({
    where: eq(profile.userId, userId),
  })

  if (
    profileData?.lastActiveOrganization &&
    membershipIds.has(profileData.lastActiveOrganization)
  ) {
    return profileData.lastActiveOrganization
  }

  return memberships[0]?.organizationId
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          if (session.activeOrganizationId) {
            return
          }

          //FIXME this does not work after logout
          const activeOrganizationId = await getLastActiveOrganizationId(session.userId)

          if (!activeOrganizationId) {
            return
          }

          return {
            data: {
              ...session,
              activeOrganizationId,
            },
          }
        },
      },
    },
  },
  plugins: [organization(), admin()],
})
