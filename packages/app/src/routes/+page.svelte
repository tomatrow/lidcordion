<script lang="ts">
	import { Garmon } from "$lib/accordion"

	let lidAngle = $state<number>()
	let lastLidAngle = $state<number>()
	const interval = 1000 / 60
	let velocity = $state(0) // degrees/microsecond

	$effect(() => {
		const id = setInterval(() => {
			const newVelocity = ((lidAngle ?? 0) - (lastLidAngle ?? lidAngle ?? 0)) / interval
			velocity = Math.min(Math.max(-1, newVelocity), 1)
			lastLidAngle = lidAngle
		}, interval)

		return () => {
			clearInterval(id)
		}
	})

	$effect(() => {
		const eventSource = new EventSource("/api/lidangle")

		eventSource.onmessage = (event) => {
			const newLidAngle = parseFloat(event.data)
			if (Number.isFinite(newLidAngle) && 0 < newLidAngle && newLidAngle < 150)
				lidAngle = newLidAngle
		}

		return () => {
			eventSource.close()
		}
	})
</script>

<p>{lidAngle}</p>
<p>{velocity}</p>

<Garmon />
