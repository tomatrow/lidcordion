<script lang="ts">
	import { Garmon } from "$lib/accordion"
	import { Tween } from "svelte/motion"

	let lidAngle = $state<number>()
	let lastLidAngle = $state<number>()
	const interval = 1000 / 60
	let velocity = new Tween(0, {
		duration: 60
	}) // degrees/microsecond(?)

	$effect(() => {
		const id = setInterval(() => {
			const newVelocity = ((lidAngle ?? 0) - (lastLidAngle ?? lidAngle ?? 0)) / interval
			velocity.target = clamp(newVelocity, -1, 1)
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

	let gain = $derived(round(1.5 * Math.abs(velocity.current), 3))

	function clamp(value: number, min: number, max: number) {
		return Math.min(Math.max(value, min), max)
	}

	function round(value: number, place: number) {
		return Math.floor(value * 10 ** place) / 10 ** place
	}
</script>

<p>{lidAngle}</p>
<p>{velocity.target}</p>
<p>{gain}</p>

<Garmon {gain} />
