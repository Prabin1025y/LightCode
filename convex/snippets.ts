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

export const deleteSnippet = mutation({
    args: { snippetId: v.id("snippets") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new ConvexError("User not authenticated!!");

        const snippet = await ctx.db.get(args.snippetId);
        // const snippet = await ctx.db.query("snippets").withIndex("by_id").filter(q=>q.eq(q.field('_id'), args.snippetId)).first();
        if (!snippet) throw new ConvexError("Snippet not found");

        if (snippet.userId !== identity.subject)
            throw new ConvexError("Failed. You are not the owner of this snippet.");

        const snippetComments = await ctx.db.query("snippetComments").withIndex("by_snippet_id").filter(q => q.eq(q.field("snippetId"), args.snippetId)).collect();

        for (const comment of snippetComments) {
            await ctx.db.delete(comment._id);
        }

        const stars = await ctx.db.query("stars").withIndex("by_snippet_id").filter(q => q.eq(q.field("snippetId"), args.snippetId)).collect();

        for (const star of stars) {
            await ctx.db.delete(star._id);
        }

        await ctx.db.delete(args.snippetId);

        return snippet;

    }
})

export const starSnippet = mutation({
    args: {
        snippetId: v.id("snippets")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new ConvexError("User not authenticated");

        const snippet = await ctx.db.get(args.snippetId);
        if (!snippet)
            throw new ConvexError("Snippet does not exists.");

        const isAlreadyStarred = await ctx.db.query("stars").withIndex("by_user_id_and_snippet_id").filter(q => (q.eq(q.field("snippetId"), args.snippetId) && q.eq(q.field("userId"), identity.subject))).first();

        if (isAlreadyStarred) {
            await ctx.db.delete(isAlreadyStarred._id);
        } else {
            await ctx.db.insert("stars", {
                userId: identity.subject,
                snippetId: snippet._id
            })
        }
    }
})