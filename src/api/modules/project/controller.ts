import { and, eq } from "drizzle-orm"

import { db } from "#/db"
import { member, project } from "#/db/schemas"

import type { ProjectCreateSchema, ProjectUpdateSchema } from "./schemas"

export class ProjectControllerError extends Error {
  constructor(
    message: string,
    readonly code: "forbidden" | "not_found",
  ) {
    super(message)
  }
}

export class ProjectController {
  static async get(userId: string, organizationId: string, id: string) {
    const membership = await db.query.member.findFirst({
      where: and(eq(member.organizationId, organizationId), eq(member.userId, userId)),
    })
    if (!membership) {
      throw new ProjectControllerError("forbidden", "forbidden")
    }
    const existingProject = await db.query.project.findFirst({
      where: and(eq(project.id, id), eq(project.organizationId, organizationId)),
    })
    if (!existingProject) {
      throw new ProjectControllerError("project not found", "not_found")
    }
    return existingProject
  }
  static async isAvailable(userId: string, name: string, organizationId: string) {
    const membership = await db.query.member.findFirst({
      where: and(eq(member.organizationId, organizationId), eq(member.userId, userId)),
    })
    if (!membership) {
      throw new ProjectControllerError("forbidden", "forbidden")
    }
    const existingProject = await db.query.project.findFirst({
      where: and(eq(project.name, name), eq(project.organizationId, organizationId)),
    })
    return existingProject === undefined
  }

  static async getAll(userId: string, organizationId: string) {
    const membership = await db.query.member.findFirst({
      where: and(eq(member.organizationId, organizationId), eq(member.userId, userId)),
    })
    if (!membership) {
      throw new ProjectControllerError("forbidden", "forbidden")
    }
    const projects = await db.query.project.findMany({
      where: eq(project.organizationId, organizationId),
    })
    return projects
  }

  static async create(userId: string, data: ProjectCreateSchema) {
    const membership = await db.query.member.findFirst({
      where: and(eq(member.organizationId, data.organizationId), eq(member.userId, userId)),
    })
    if (!membership) {
      throw new ProjectControllerError("forbidden", "forbidden")
    }
    const projectData = await db.insert(project).values(data).returning()
    return projectData[0]
  }

  static async update(
    userId: string,
    organizationId: string,
    projectId: string,
    data: ProjectUpdateSchema,
  ) {
    const membership = await db.query.member.findFirst({
      where: and(eq(member.organizationId, organizationId), eq(member.userId, userId)),
    })
    if (!membership) {
      throw new ProjectControllerError("forbidden", "forbidden")
    }
    const projectData = await db
      .update(project)
      .set(data)
      .where(and(eq(project.id, projectId), eq(project.organizationId, organizationId)))
      .returning()
    if (!projectData[0]) {
      throw new ProjectControllerError("project not found", "not_found")
    }
    return projectData[0]
  }

  static async delete(userId: string, organizationId: string, projectId: string) {
    const membership = await db.query.member.findFirst({
      where: and(eq(member.organizationId, organizationId), eq(member.userId, userId)),
    })
    if (!membership) {
      throw new ProjectControllerError("forbidden", "forbidden")
    }
    const projectData = await db
      .delete(project)
      .where(and(eq(project.id, projectId), eq(project.organizationId, organizationId)))
      .returning()
    if (!projectData[0]) {
      throw new ProjectControllerError("project not found", "not_found")
    }
    return projectData[0]
  }
}
