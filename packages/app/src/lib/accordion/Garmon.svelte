<script lang="ts">
	import { tone } from "./data"
	import { layout, buttonIdMap, rows, bassRows, keyMapGarmon } from "./garmon-data"
	import { createOscillator } from "./synth"

	// Audio
	const audio = new AudioContext()
	const gainNode = audio.createGain()
	gainNode.gain.value = 0.1
	gainNode.connect(audio.destination)

	// State
	let { gain }: { gain: number } = $props()

	let key = $state(0)

	let activeButtonIdMap = $state({})

	let map = $state(buttonIdMap)
	let orientation = $state<"horizontal" | "vertical">("horizontal")
	let oscillatorType = $state<"square" | "sawtooth" | "triangle" | "sine">("sawtooth")

	// Handlers
	function playTone(id: string) {
		let { frequency } = map[id]

		let frequencyArray: number[]
		if (typeof frequency === "number") {
			frequencyArray = [frequency, frequency * 2]
		} else {
			frequencyArray = frequency as unknown as number[]
		}

		let oscillator = frequencyArray.map((hz) => {
			const transposedFrequency = hz * 2 ** (key / 12)

			return createOscillator({
				context: audio,
				frequency: transposedFrequency,
				destination: gainNode
			})
		})

		return { oscillator }
	}

	function stopTone(id: string) {
		const { oscillator } = activeButtonIdMap[id]

		if (Array.isArray(oscillator)) {
			oscillator.forEach((osc) => osc?.stop())
		} else {
			oscillator?.stop()
		}
	}

	function updateActiveButtonMap(id: string) {
		if (!activeButtonIdMap[id]) {
			const { oscillator } = playTone(id)

			activeButtonIdMap[id] = { oscillator, ...map[id] }
		}
	}

	function handleKeyPressNote(event: KeyboardEvent) {
		if (event.key === "/" || event.key === "'") {
			event.preventDefault()
		}
		const key = `${event.key}`.toLowerCase() || event.key
		const buttonMapData = keyMapGarmon[key]

		if (buttonMapData) {
			const { row, column } = buttonMapData
			const id = `${row}-${column}`

			return updateActiveButtonMap(id)
		}
	}

	function handleKeyUpNote(event: KeyboardEvent) {
		const key = `${event.key}`.toLowerCase() || event.key
		const buttonMapData = keyMapGarmon[key]

		if (buttonMapData) {
			const { row, column } = buttonMapData
			const id = `${row}-${column}`

			if (activeButtonIdMap[id]) {
				stopTone(id)
				// Must be reassigned in Svelte
				const newActiveButtonIdMap = { ...activeButtonIdMap }
				delete newActiveButtonIdMap[id]
				activeButtonIdMap = newActiveButtonIdMap
			}
		}
	}

	const handleClearAllNotes = () => {
		for (const [keyId, keyValues] of Object.entries(activeButtonIdMap)) {
			// Remove existing value
			if (Array.isArray(keyValues.oscillator)) {
				keyValues.oscillator.forEach((hz) => hz?.stop())
			} else {
				keyValues.oscillator?.stop()
			}
		}
		activeButtonIdMap = {}
	}

	function transposeUp() {
		key++
	}
	function transposeDown() {
		key--
	}

	// effects
	$effect(() => {
		Object.values(activeButtonIdMap).forEach(({ oscillator }) =>
			oscillator.forEach((o) => o.update(gain))
		)
	})
</script>

<svelte:body
	onkeypress={handleKeyPressNote}
	onkeyup={handleKeyUpNote}
	onmouseup={handleClearAllNotes}
/>

<section class="controls">
	<div class="scale">
		<h4>{key >= 0 ? "+" : ""}{key} ({Object.keys(tone)[((key % 12) + 12) % 12]})</h4>
		<button onclick={transposeDown}>-</button>
		<button onclick={transposeUp}>+</button>
	</div>

	<select class="wave" bind:value={oscillatorType}>
		<option value="square">Square</option>
		<option value="sawtooth">Sawtooth</option>
		<option value="triangle">Triangle</option>
		<option value="sine">Sine</option>
	</select>

	<select class="horizontal" bind:value={orientation}>
		<option value="horizontal">horizontal</option>
		<option value="vertical">vertical</option>
	</select>
</section>

<div class="keyboard">
	{#each bassRows.flat().reverse() as row (row)}
		<div class="row row--base row--{row} row--{orientation}">
			<p>base {row}</p>
			{#each layout[row] as { id, name } (id)}
				<div
					{id}
					class="circle"
					class:active={activeButtonIdMap[id]}
					class:accidental={name.includes("♭")}
				>
					{name}
				</div>
			{/each}
		</div>
	{/each}
	{#each rows.flat().reverse() as row (row)}
		<div class="row row--treble row--{row} row--{orientation}">
			<p>treble {row}</p>
			{#each layout[row] as { id, name } (id)}
				<div
					{id}
					class="circle"
					class:active={activeButtonIdMap[id]}
					class:accidental={name.includes("♭")}
				>
					{name}
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	.controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.scale {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.keyboard {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		.row {
			display: flex;
			gap: 0.5rem;

			p {
				width: 5rem;
			}

			.circle {
				border-radius: 50%;
				width: 4rem;
				height: 4rem;
				display: flex;
				justify-content: center;
				align-items: center;
				background: gray;
				transition: all 200ms ease-in-out;

				&.active {
					background: red;
				}
			}

			&.row--two {
				margin-top: 1.5rem;
			}

			&:where(.row--four, .row--two) p {
				margin-right: 2.25rem;
			}

			&.row--vertical .circle {
				transform: rotate(-90deg);
			}
		}
	}
</style>
