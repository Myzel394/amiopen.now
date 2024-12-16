import { Context } from "hono";
import { PresentationType } from "../middlewares/presentation";
import * as nunjucks from "nunjucks";

export default async function render(
	context: Context,
	templateName: "index" | "port",
	ctx: Record<string, any>,
) {
	const presentation = context.get("presentation") as PresentationType;
	const extension = {
		browser: ".html",
		terminal: ".txt",
		"cli-browser": ".cli.html",
	}[presentation];
	const key = templateName + ".njk" + extension;

	const content = nunjucks.render(key, ctx);

	switch (presentation) {
		case "browser":
			return context.html(content);
		case "cli-browser":
			return context.html(content);
		case "terminal":
			return context.text(content.trimEnd());
	}
}
