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

	let oscillatorType = $state<"square" | "sawtooth" | "triangle" | "sine">("sawtooth")

	// Handlers
	function playTone(id: string) {
		let { frequency } = map[id]

		let frequencyPair = Array.isArray(frequency) ? frequency : [frequency, frequency * 2]
		let oscillator = frequencyPair.map((hz) => {
			const oscillator = createOscillator({
				context: audio,
				frequency: hz,
				destination: gainNode
			})

			return oscillator
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

	function updateActiveButtonMap(id) {
		if (!activeButtonIdMap[id]) {
			const { oscillator } = playTone(id)

			activeButtonIdMap[id] = { oscillator, ...map[id] }
		}
	}

	function handleKeyPressNote(e) {
		if (e.key === "/" || e.key === "'") {
			event.preventDefault()
		}
		const key = `${e.key}`.toLowerCase() || e.key
		const buttonMapData = keyMapGarmon[key]

		if (buttonMapData) {
			const { row, column } = buttonMapData
			const id = `${row}-${column}`

			return updateActiveButtonMap(id)
		}
	}

	function handleKeyUpNote(e) {
		const key = `${e.key}`.toLowerCase() || e.key
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

	const handleChangeSound = (event) => {
		oscillatorType = event.target.value
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

<div>
	<h3>Key</h3>
	<div class="scale">
		<h4>{key >= 0 ? "+" : ""}{key} ({Object.keys(tone)[((key % 12) + 12) % 12]})</h4>
		<!-- regular modulo doesn't work with negative?? -->
		<div>
			<button onclick={transposeDown}>-</button>
			<button onclick={transposeUp}>+</button>
		</div>
	</div>
</div>

<div>
	<h3>Sound</h3>
	<select value={oscillatorType} onchange={handleChangeSound}>
		<option value="square">Square</option>
		<option value="sawtooth">Sawtooth</option>
		<option value="triangle">Triangle</option>
		<option value="sine">Sine</option>
	</select>
</div>

<div class="keyboard-side">
	{#each rows as row (row)}
		<div class="row {row}">
			{#each layout[row] as { id, name } (id)}
				<div
					{id}
					class:active={activeButtonIdMap[id]}
					class:accidental={name.includes("♭")}
					class="circle"
				>
					{name}
				</div>
			{/each}
		</div>
	{/each}
</div>

<div class="currently-playing">
	{#each Object.entries(activeButtonIdMap) as [id, value]}
		<div class="flex col">
			<div class="circle note">{value.name}</div>
			<div><small>Row: {id.split("-")[0]}<br /> Col: {id.split("-")[1]}</small></div>
		</div>
	{/each}
</div>

<div class="bass-side">
	{#each bassRows as row (row)}
		<div class="row {row}">
			{#each layout[row] as { id, name } (id)}
				<div {id} class="circle" class:active={activeButtonIdMap[id]}>
					{name}
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	.active {
		background: red;
	}
</style>
