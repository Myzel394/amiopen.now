import { createMiddleware } from "hono/factory";

export type PresentationType = "terminal" | "browser";

const TERMINAL_USER_AGENT = /^(curl|wget|python-urllib|pycurl|java)/i;

const presentation = createMiddleware<{
	Variables: {
		presentation: PresentationType;
	};
}>(async (context, next) => {
	const userAgent = context.req.header("User-Agent") || "";

	if (TERMINAL_USER_AGENT.test(userAgent)) {
		context.set("presentation", "terminal");
	} else {
		context.set("presentation", "browser");
	}

	await next();
});

export default presentation;
