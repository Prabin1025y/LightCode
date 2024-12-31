import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

export const getSnippet = query({
    handler: async (ctx) => {
        const snippets = await ctx.db.query("snippets").order("desc").collect();
        return snippets;
    }
})

export const isSnipperStarred = query({
    args: {
        snippetId: v.id("snippets")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return false;

        const star = await ctx.db.query("stars").withIndex("by_user_id_and_snippet_id").filter((q) => q.eq(q.field("userId"), identity.subject) && q.eq(q.field("snippetId"), args.snippetId)).first();
        return !!star;
    }
})

export const getStarredSnippetsCount = query({
    args: {
        snippedId: v.id("snippets")
    },
    handler: async (ctx, args) => {
        const stars = await ctx.db.query("stars").withIndex("by_snippet_id").filter((q) => q.eq(q.field("snippetId"), args.snippedId)).collect();

        return stars.length;
    }
})