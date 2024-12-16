import { createMiddleware } from "hono/factory";

export type PresentationType = "terminal" | "browser" | "cli-browser";

const TERMINAL_USER_AGENT =
	/^(curl|wget|python-urllib|pycurl|java|go-http-client|php)/i;

const CLI_BROWSER_USER_AGENT = /^(lynx|elinks|w3m)/i;

const presentation = createMiddleware<{
	Variables: {
		presentation: PresentationType;
	};
}>(async (context, next) => {
	const userAgent = context.req.header("User-Agent") || "";

	if (TERMINAL_USER_AGENT.test(userAgent)) {
		context.set("presentation", "terminal");
	} else if (CLI_BROWSER_USER_AGENT.test(userAgent)) {
		context.set("presentation", "cli-browser");
	} else {
		context.set("presentation", "browser");
	}

	await next();
});

export default presentation;
