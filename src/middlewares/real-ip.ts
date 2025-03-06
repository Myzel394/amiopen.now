import { getConnInfo } from "hono/bun";
import { createMiddleware } from "hono/factory";

const realIP = createMiddleware<{
	Variables: {
		ip: string;
	};
}>(async (context, next) => {
	const ip =
		context.req.header("x-forwarded-for") ||
		context.req.header("x-real-ip") ||
		getConnInfo(context).remote.address;

	if (!ip) {
		return context.json({ error: "Your IP could not be found" }, 401);
	}

	context.set("ip", ip);

	await next();
});

export default realIP;
