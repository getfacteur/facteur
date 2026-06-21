import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "#/db";
import { type DomainStatus, domain, user } from "#/db/schema";
import { getPlanLimits } from "../facteur/billing";
import { inngest, startDomainVerify } from "../inngest";

export const countDomains = async (userId: string) => {
	const domains = await db
		.select({ id: domain.id })
		.from(domain)
		.where(eq(domain.userId, userId));
	return domains.length;
};

export const createDomain = async (userId: string, domainName: string) => {
	const limits = await getPlanLimits(userId);

	if (limits.current_domains >= limits.max_domains) {
		throw new Error("domain_limit");
	}

	const verificationToken = randomBytes(20).toString("base64").slice(0, 40);
	const date = new Date();
	const [result] = await db
		.insert(domain)
		.values({
			verificationToken,
			domain: domainName,
			userId,
			createdAt: date,
			updatedAt: date,
			status: "pending",
		})
		.returning();
	await inngest.send(
		startDomainVerify.create({ id: result.id, source: "initial" }),
	);
};

export const getDomains = async (userId: string) => {
	return db.select().from(domain).where(eq(domain.userId, userId));
};

export const getDomain = async (domainId: string) => {
	return db.query.domain.findFirst({ where: { id: domainId } });
};

export const getAllDomainIds = async () => {
	return db.select({ id: domain.id }).from(domain);
};

export const getDomainWithOwner = async (domainId: string) => {
	const [result] = await db
		.select({
			id: domain.id,
			domain: domain.domain,
			status: domain.status,
			userEmail: user.email,
		})
		.from(domain)
		.innerJoin(user, eq(domain.userId, user.id))
		.where(eq(domain.id, domainId))
		.limit(1);
	return result;
};

export const deleteDomain = async (userId: string, domainId: string) => {
	const domainRow = await db.query.domain.findFirst({
		where: {
			id: domainId,
			userId: userId,
		},
	});
	if (!domainRow) {
		throw new Error("unauthorized");
	}
	await db.delete(domain).where(eq(domain.id, domainId));
};

export const updateDomainStatus = async (
	domainId: string,
	status: DomainStatus,
) => {
	await db
		.update(domain)
		.set({
			status,
			lastCheckedAt: new Date(),
			...(status === "verified" ? { verifiedAt: new Date() } : {}),
		})
		.where(eq(domain.id, domainId));
};

export const getDomainVerifaction = (value: string) => {
	const match = value.match(/^"facteur-relay-verification=([^"]+)"$/);
	const token = match?.[1];
	return token;
};
