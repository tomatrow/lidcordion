// Map computer keys to accordion button layout
export const keyMap = {
	z: { row: 1, column: 1 },
	x: { row: 1, column: 2 },
	c: { row: 1, column: 3 },
	v: { row: 1, column: 4 },
	b: { row: 1, column: 5 },
	n: { row: 1, column: 6 },
	m: { row: 1, column: 7 },
	",": { row: 1, column: 8 },
	".": { row: 1, column: 9 },
	"/": { row: 1, column: 10 },
	a: { row: 2, column: 1 },
	s: { row: 2, column: 2 },
	d: { row: 2, column: 3 },
	f: { row: 2, column: 4 },
	g: { row: 2, column: 5 },
	h: { row: 2, column: 6 },
	j: { row: 2, column: 7 },
	k: { row: 2, column: 8 },
	l: { row: 2, column: 9 },
	";": { row: 2, column: 10 },
	"'": { row: 2, column: 11 },
	w: { row: 3, column: 1 },
	e: { row: 3, column: 2 },
	r: { row: 3, column: 3 },
	t: { row: 3, column: 4 },
	y: { row: 3, column: 5 },
	u: { row: 3, column: 6 },
	i: { row: 3, column: 7 },
	o: { row: 3, column: 8 },
	p: { row: 3, column: 9 },
	"[": { row: 3, column: 10 }
}

export const keyMapChromatic = {
	...keyMap,
	3: { row: 4, column: 1 },
	4: { row: 4, column: 2 },
	5: { row: 4, column: 3 },
	6: { row: 4, column: 4 },
	7: { row: 4, column: 5 },
	8: { row: 4, column: 6 },
	9: { row: 4, column: 7 },
	0: { row: 4, column: 8 },
	"-": { row: 4, column: 9 },
	"=": { row: 4, column: 10 }
} as const

export const tone = {
	C: [16.35, 32.7, 65.41, 130.81, 261.63, 523.25, 1046.5, 2093.0, 4186.01],
	Db: [17.32, 34.65, 69.3, 138.59, 277.18, 554.37, 1108.73, 2217.46, 4434.92],
	D: [18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66, 2349.32, 4698.64],
	Eb: [19.45, 38.89, 77.78, 155.56, 311.13, 622.25, 1244.51, 2489.02, 4978.03],
	E: [20.6, 41.2, 82.41, 164.81, 329.63, 659.26, 1318.51, 2637.02],
	F: [21.83, 43.65, 87.31, 174.61, 349.23, 698.46, 1396.91, 2793.83],
	Gb: [23.12, 46.25, 92.5, 185.0, 369.99, 739.99, 1479.98, 2959.96],
	G: [24.5, 49.0, 98.0, 196.0, 392.0, 783.99, 1567.98, 3135.96],
	Ab: [25.96, 51.91, 103.83, 207.65, 415.3, 830.61, 1661.22, 3322.44],
	A: [27.5, 55.0, 110.0, 220.0, 440.0, 880.0, 1760.0, 3520.0],
	Bb: [29.14, 58.27, 116.54, 233.08, 466.16, 932.33, 1864.66, 3729.31],
	B: [30.87, 61.74, 123.47, 246.94, 493.88, 987.77, 1975.53, 3951.07]
} as Record<"C" | "Db" | "D" | "Eb" | "E" | "F" | "Gb" | "G" | "Ab" | "A" | "Bb" | "B", number[]>
