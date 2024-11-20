import * as net from "net";

export interface ConnectionParams {
	timeout: number;
}

export interface ConnectionResult {
	isOpen: boolean;
}

export default function connectToAddress(
	address: string,
	port: number,
	{ timeout }: ConnectionParams = { timeout: 5_000 },
): Promise<ConnectionResult> {
	return new Promise<ConnectionResult>(async resolve => {
		let $timeout: Timer;

		const socket = new net.Socket();
		const close = () => {
			if ($timeout) {
				clearTimeout($timeout);
			}

			if (!socket.destroyed) {
				socket.end();
				socket.destroy();
			}
		};
		const onIsOpen = () => {
			close();
			resolve({
				isOpen: true,
			});
		};
		const onIsClosed = () => {
			close();
			resolve({
				isOpen: false,
			});
		};

		// The `setTimeout` function from a socket does not work when connecting,
		// so we need to use a custom timeout function ourselves.
		$timeout = setTimeout(() => {
			close();
			resolve({
				isOpen: false,
			});
		}, timeout);

		socket.on("ready", onIsOpen);
		socket.on("close", onIsClosed);
		socket.on("error", onIsClosed);
		socket.on("timeout", onIsClosed);

		socket.connect(port, address);
	});
}
