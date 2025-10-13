<script lang="ts">
	let lidAngle = $state(-1)

	$effect(() => {
		const eventSource = new EventSource("/api/lidangle")

		eventSource.onmessage = (event) => {
			const newLidAngle = parseFloat(event.data)
			if (Number.isFinite(newLidAngle)) lidAngle = newLidAngle
		}

		return () => {
			eventSource.close()
		}
	})
</script>

<p>{lidAngle}</p>
