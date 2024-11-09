import { Hono } from "hono";
import { portRoute } from "./routes/port";
import realIP from "./middlewares/real-ip";

const app = new Hono();

app.route("/", portRoute);

Bun.serve({
	...app,
	idleTimeout: 90,
});
