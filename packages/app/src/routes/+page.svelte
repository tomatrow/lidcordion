<script lang="ts">
	import { Tween } from "svelte/motion"
	import { Garmon } from "$lib/accordion"

	let lidAngle = $state<number>()
	let lastLidAngle = $state<number>()
	const interval = 1000 / 60
	let velocity = new Tween(0) // degrees/microsecond(?)

	$effect(() => {
		const id = setInterval(() => {
			const newVelocity = ((lidAngle ?? 0) - (lastLidAngle ?? lidAngle ?? 0)) / interval
			const newClampedVelocity = clamp(newVelocity, -1, 1)
			velocity.set(newClampedVelocity, { duration: 60 })
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

	let gainScale = $state(1.5)
	let gainConstant = $state(0)
	let gain = $derived(round(gainScale * Math.abs(velocity.current) + gainConstant, 3))

	function clamp(value: number, min: number, max: number) {
		return Math.min(Math.max(value, min), max)
	}

	function round(value: number, place: number) {
		return Math.floor(value * 10 ** place) / 10 ** place
	}
</script>

<header>
	<p>{lidAngle ?? "#"}°</p>
	<p><b>v<sub>t</sub></b> {velocity.target}</p>
	<p><b>v<sub>c</sub></b> {round(velocity.current, 3)}</p>
	<p><b>gain</b> {gain}</p>
	<p>
		<b>g<sub>*</sub></b> <input type="number" bind:value={gainScale} min={0} max={3} step={0.5} />
	</p>
	<p>
		<b>g<sub>+</sub></b>
		<input type="number" bind:value={gainConstant} min={0} max={1} step={0.1} />
	</p>
</header>

<Garmon {gain} />

<style>
	header {
		display: flex;
		gap: 0.5rem;
		align-items: center;

		p {
			min-width: 5.5rem;
		}

		input {
			width: auto;
		}
	}
</style>
