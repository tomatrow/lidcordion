export function createOscillator({
	context,
	frequency,
	destination
}: {
	context: AudioContext
	frequency: number
	destination: AudioNode
}) {
	const sawOsc = context.createOscillator()
	const squareOsc = context.createOscillator()
	const squareOctOsc = context.createOscillator()
	const sawGain = context.createGain()
	const squareGain = context.createGain()
	const squareOctGain = context.createGain()
	const filter = context.createBiquadFilter()
	const envelope = context.createGain()

	sawOsc.connect(sawGain)
	sawGain.connect(filter)

	squareOsc.connect(squareGain)
	squareGain.connect(filter)

	squareOctOsc.connect(squareOctGain)
	squareOctGain.connect(filter)

	filter.connect(envelope)
	envelope.connect(destination)

	squareOsc.type = "square"
	squareOsc.frequency.value = frequency
	squareOsc.start()

	sawOsc.type = "sawtooth"
	sawOsc.frequency.value = frequency + 0.7 // detune for a more fuzzy sound
	sawOsc.start()

	squareOctOsc.type = "square"
	squareOctOsc.frequency.value = frequency * 2 - 1.3
	squareOctOsc.start()

	squareGain.gain.value = 0.8

	sawGain.gain.value = 0.5

	squareOctGain.gain.value = 0.3

	filter.type = "lowpass"
	filter.frequency.value = 4000

	envelope.gain.value = 0
	envelope.gain.setTargetAtTime(1, context.currentTime, 0.05)

	return {
		update(gain: number) {
			envelope.gain.setTargetAtTime(gain, context.currentTime, 0.05)
		},
		stop() {
			envelope.gain.setTargetAtTime(0, context.currentTime, 0.2)
			sawOsc.stop(context.currentTime + 0.5)
			squareOsc.stop(context.currentTime + 0.5)
			squareOctOsc.stop(context.currentTime + 0.5)
		}
	}
}
