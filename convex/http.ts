import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server"
import { api } from "./_generated/api"
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";

const http = httpRouter();

http.route({
    
    path: "/clerk-webhook", //should be same as endpoint defined in clerk dashboard/webhooks
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const webHookSecret = process.env.CLERK_WEBHOOK_SECRET;

        if (!webHookSecret) {
            throw new Error("missing webhook secret environment variable");
        }

        const svix_id = request.headers.get("svix-id");
        const svix_signature = request.headers.get("svix-signature");
        const svix_timestamp = request.headers.get("svix-timestamp");

        if (!svix_id || !svix_signature || !svix_timestamp) {
            return new Response("Error Occured - svix headers missing", { status: 400 });
        }

        const payload = await request.json();
        const body = JSON.stringify(payload);

        const wh = new Webhook(webHookSecret);
        let evt: WebhookEvent;

        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-signature": svix_signature,
                "svix-timestamp": svix_timestamp
            }) as WebhookEvent;
        } catch (error) {
            console.log("Error while verifying event", error);
            return new Response("Error Occured", { status: 400 });
        }

        const eventType = evt.type;

        if (eventType === "user.created") {
            const { id, email_addresses, first_name, last_name } = evt.data;

            const email = email_addresses[0].email_address;
            const name = `${first_name} ${last_name}`.trim();

            try {
                //save user to the database
                await ctx.runMutation(api.users.syncUser, {
                    userId: id,
                    email,
                    name
                });
            } catch (error) {
                console.log("Error while saving user to database", error);
                return new Response("Error while saving the user", { status: 500 });
            }

        }
        return new Response("Successfully processed webhook", { status: 200 });
    })
})

export default http;