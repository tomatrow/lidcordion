import type { RequestHandler } from "./$types"
import { createLidAngleStream } from "$lib/server/createLidAngleStream"

export const GET = async function () {
	const lidAngleStream = createLidAngleStream()

	return new Response(lidAngleStream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive"
		}
	})
} satisfies RequestHandler
