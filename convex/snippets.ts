import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const saveSnippet = mutation({
    args: {
        code: v.string(),
        language: v.string(),
        title: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity)
            throw new ConvexError("User not authenticated");

        const user = await ctx.db.query("users").withIndex("by_user_id").filter(q => q.eq(q.field("userId"), identity.subject)).first();
        if (!user) throw new ConvexError("User not found");
        if (!user?.isPro && args.language !== "javascript") {
            //user is not a pro but trying to access pro features
            throw new ConvexError("User is not in pro subscription");
        }

        const snippetId = await ctx.db.insert("snippets", {
            userId: identity.subject,
            language: args.language,
            code: args.code,
            title: args.title,
            userName: user.name
        })

        return snippetId;
    }
})