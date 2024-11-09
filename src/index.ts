import { Hono } from "hono";
import { portRoute } from "./routes/port";

const app = new Hono();

app.route("/", portRoute);

Bun.serve({
    ...app,
    idleTimeout: 90,
})
