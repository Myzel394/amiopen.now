import { Hono } from "hono";
import { portRoute } from "./routes/port";
import { rootRoute } from "./routes/root";
import { serveStatic } from "hono/bun";
import * as nunjucks from "nunjucks";

nunjucks.configure("templates", {
	dev: process.env.NODE_ENV === "development",
});

const app = new Hono()
	.use("/static/*", serveStatic({ root: "./" }))
	.route("/", rootRoute)
	.route("/", portRoute);

Bun.serve({
	...app,
	idleTimeout: 90,
});
