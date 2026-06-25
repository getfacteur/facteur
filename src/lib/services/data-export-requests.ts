import { sql } from "drizzle-orm";
import { db } from "#/db";
import { dataExportRequest } from "#/db/schema";

export const getPendingDataExportRequest = async (userId: string) => {
	return db.query.dataExportRequest.findFirst({
		where: {
			userId,
			status: "pending",
		},
	});
};

export const requestDataExport = async (userId: string) => {
	const [createdRequest] = await db
		.insert(dataExportRequest)
		.values({
			userId,
			status: "pending",
		})
		.onConflictDoNothing({
			target: dataExportRequest.userId,
			where: sql.raw("\"status\" = 'pending'"),
		})
		.returning();

	if (createdRequest) {
		return createdRequest;
	}

	const pendingRequest = await getPendingDataExportRequest(userId);
	if (!pendingRequest) {
		throw new Error("data_export_request_not_found");
	}

	return pendingRequest;
};
