import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
export const saveAssessment = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("ต้องเข้าสู่ระบบก่อนบันทึกข้อมูล");
    }
    const assessmentId = await ctx.db.insert("assessments", {
      userId,
      ...args,
      createdAt: Date.now(),
    });
    return assessmentId;
  },
});
export const listAssessments = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("assessments")
      .withIndex("by_userId_createdAt", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});
export const deleteAssessment = mutation({
  args: { id: v.id("assessments") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== userId) {
      throw new Error("Assessment not found or permission denied");
    }
    await ctx.db.delete(args.id);
  },
});