import * as net from "net"

export interface ConnectionResult {
  isOpen: boolean
}

const TIMEOUT = 5_000

export default function connectToAddress(address: string, port: number): Promise<ConnectionResult> {
  return new Promise<ConnectionResult>(async (resolve) => {
    const onIsOpen = () => {
      if (!socket.destroyed) {
        socket.end()
        socket.destroy()
      }

      resolve({
        isOpen: true
      })
    }
    const onIsClosed = () => {
      if (!socket.destroyed) {
        socket.end()
        socket.destroy()
      }

      resolve({
        isOpen: false
      })
    }

    const socket = new net.Socket()

    // The `setTimeout` function from a socket does not work when connecting,
    // so we need to use a custom timeout function ourselves.
    setTimeout(() => {
      if (!socket.destroyed) {
        socket.end()
        socket.destroy()
      }

      resolve({
        isOpen: false
      })
    }, TIMEOUT)

    socket.on("ready", onIsOpen)
    socket.on("close", onIsClosed)
    socket.on("error", onIsClosed)
    socket.on("timeout", onIsClosed)

    socket.connect(port, address)
  })
}
