import { Hono } from "hono";
import { portRoute } from "./routes/port";
import { rootRoute } from "./routes/root";
import { serveStatic } from "hono/bun";

const app = new Hono()
	.use("/static/*", serveStatic({ root: "./" }))
	.route("/", rootRoute)
	.route("/", portRoute);

Bun.serve({
	...app,
	idleTimeout: 90,
});
