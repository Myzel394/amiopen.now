import { Context } from "hono";
import { PresentationType } from "../middlewares/presentation";

export default async function render(
	request: Context,
	templateName: "index",
	ctx: Record<string, any>,
) {
	const presentation = request.get("presentation");
	let content = await getTemplate(templateName, presentation);

	for (const [key, value] of Object.entries(ctx)) {
		content = content.replaceAll(`{{${key}}}`, value);
	}

	switch (presentation) {
		case "browser": {
			return request.html(content);
		}
		case "terminal": {
			return request.text(content);
		}
	}
}

const _templateCache: Record<string, string> = {};

async function getTemplate(
	templateName: "index",
	presentation: PresentationType,
): Promise<string> {
	const extension = {
		browser: ".html",
		terminal: ".txt",
	}[presentation];
	const key = templateName + extension;

	if (_templateCache[key]) {
		return _templateCache[key];
	}

	const currentPath = await Bun.resolve(`./templates/${key}`, process.cwd());
	_templateCache[key] = await Bun.file(currentPath).text();

	return _templateCache[key];
}
