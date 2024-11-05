import { Hono } from 'hono'
import {getConnInfo} from "hono/bun"
import connectToAddress from './utils/connect-to-address'

const app = new Hono()

app.get('/:port', async context => {
  const port = Number(context.req.param("port"))
  const info = getConnInfo(context)
  const ipAddress = info.remote.address!

  const result = await connectToAddress(ipAddress, port)

  return context.json({
    isOpen: result.isOpen
  })
})

export default app
