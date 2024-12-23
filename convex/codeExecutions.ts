import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const saveExecution = mutation({
    args: {
        language: v.string(),
        code: v.string(),
        output: v.optional(v.string()),
        error: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity)
            throw new ConvexError("User not authenticated");

        const user = await ctx.db.query("users").withIndex("by_user_id").filter(q=>q.eq(q.field("userId"), identity.subject)).first();
        if(!user?.isPro && args.language !== "javascript"){
            //user is not a pro but trying to access pro features
            throw new ConvexError("User is not in pro subscription");
        }

        await ctx.db.insert("codeExecution",{
            ...args,
            userId: identity.subject
        })
    }
})