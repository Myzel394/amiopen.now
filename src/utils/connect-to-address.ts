export interface ConnectionResult {
  isOpen: boolean
}

const TIMEOUT = 5

export default function connectToAddress(address: string, port: number): Promise<ConnectionResult> {
  return new Promise<ConnectionResult>(async (resolve) => {
    const socket = await Bun.connect({
      hostname: address,
      port: port,

      socket: {
        open(socket) {
          socket.end()
          resolve({
            isOpen: true
          })
        },
        data() {
        },
        connectError() {
          resolve({
            isOpen: false
          })
        },
        error(socket) {
          socket.end()
          resolve({
            isOpen: false
          })
        },
        timeout() {
          resolve({
            isOpen: false
          })
        },
      }
    })

    socket.timeout(TIMEOUT)
  })
}
