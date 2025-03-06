import { createMiddleware } from "hono/factory";

export type PresentationType = "terminal" | "browser" | "cli-browser" | "json";

const TERMINAL_USER_AGENT =
	/^(curl|wget|python-urllib|pycurl|java|go-http-client|php)/i;

const CLI_BROWSER_USER_AGENT = /^(lynx|elinks|w3m)/i;

const presentation = createMiddleware<{
	Variables: {
		presentation: PresentationType;
	};
}>(async (context, next) => {
	let presentation: PresentationType = "browser";
	const suggestedFormat =
		context.req.query("format") || context.req.query("f");

	switch (suggestedFormat) {
		case "terminal":
		case "cli":
		case "script":
		case "shell":
		case "sh":
		case "bash":
			presentation = "terminal";
			break;

		case "browser":
		case "default":
		case "html":
		case "web":
			presentation = "browser";
			break;

		case "cli-browser":
		case "lynx":
		case "elinks":
		case "w3m":
			presentation = "cli-browser";
			break;

		case "json":
			presentation = "json";
			break;

		default:
			// Detect using User-Agent
			const userAgent = context.req.header("User-Agent") || "";

			if (TERMINAL_USER_AGENT.test(userAgent)) {
				presentation = "terminal";
			} else if (CLI_BROWSER_USER_AGENT.test(userAgent)) {
				presentation = "cli-browser";
			} else {
				presentation = "browser";
			}
	}

	context.set("presentation", presentation);

	await next();
});

export default presentation;
