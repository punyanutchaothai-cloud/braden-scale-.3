import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
const applicationTables = {
  files: defineTable({
    userId: v.id("users"),
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    size: v.number(),
    description: v.optional(v.string()),
    uploadedAt: v.number(),
  })
    .index("by_userId_uploadedAt", ["userId", "uploadedAt"])
    .index("by_userId_storageId", ["userId", "storageId"]),
  assessments: defineTable({
    userId: v.id("users"),
    patientName: v.string(),
    patientHN: v.string(),
    patientAge: v.number(),
    assessmentDate: v.string(),
    assessmentTime: v.string(),
    scores: v.object({
      sensory: v.number(),
      moisture: v.number(),
      activity: v.number(),
      mobility: v.number(),
      nutrition: v.number(),
      friction: v.number(),
    }),
    totalScore: v.number(),
    riskLevel: v.string(),
    diagnosis: v.string(),
    carePlan: v.array(v.string()),
    nextAssessment: v.string(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_createdAt", ["userId", "createdAt"]),
};
export default defineSchema({
  ...authTables,
  ...applicationTables,
});