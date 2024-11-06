import { Hono } from "hono";
import { getConnInfo } from "hono/bun";
import connectToAddress from "../utils/connect-to-address";
import { z } from "zod";
import * as IP from "ip"

export const portRoute = new Hono();

const schema = z.object({
  ip: z.string().refine(ip => IP.isPublic(ip), "This IP address is not valid"),
  port: z.string().transform(Number).pipe(z.number().min(1).max(2**16 - 1)),
});

portRoute.get("/:port", async context => {
  const info = getConnInfo(context)
  const rawData = {
    ip: info.remote.address || "",
    port: context.req.param("port"),
  };
  const parsedData = schema.safeParse(rawData);

  if (!parsedData.success) {
    return context.json({ error: parsedData.error }, 401);
  }

  const { ip, port } = parsedData.data;

  const result = await connectToAddress(ip, port)

  return context.json({
    isOpen: result.isOpen
  })
});

portRoute.get("/:ip/:port", async context => {
  const rawData = {
    ip: context.req.param("ip"),
    port: context.req.param("port"),
  };
  const parsedData = schema.safeParse(rawData);

  if (!parsedData.success) {
    return context.json({ error: parsedData.error }, 401);
  }

  const { ip, port } = parsedData.data;

  const result = await connectToAddress(ip, port)

  return context.json({
    isOpen: result.isOpen
  })
})
