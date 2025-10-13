import { spawn } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const process = spawn(path.join(path.dirname(fileURLToPath(import.meta.url)), "bin/lidcordion"))

process.stdout.setEncoding("utf8")
process.stderr.setEncoding("utf8")

export function createLidAngleStream() {
	let cleanup: undefined | (() => void)

	return new ReadableStream<string>({
		start(controller) {
			function relayData(data: string) {
				controller.enqueue(`data: ${data.trim()}\n\n`)
			}

			process.stdout.addListener("data", relayData)

			cleanup = () => {
				process.stdout.removeListener("data", relayData)
			}
		},
		cancel() {
			cleanup?.()
			cleanup = undefined
		}
	})
}
