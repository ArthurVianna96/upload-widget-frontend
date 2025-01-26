export function formatBytes(
	bytes: number,
): string {
	let formatedBytes = bytes;
	if (bytes < 0) {
		throw new Error(
			"Size in bytes cannot be negative",
		);
	}
	const units = [
		"B",
		"KB",
		"MB",
		"GB",
		"TB",
		"PB",
	];
	let index = 0;
	while (
		formatedBytes >= 1024 &&
		index < units.length - 1
	) {
		formatedBytes /= 1024;
		index++;
	}
	return `${formatedBytes.toFixed(2)} ${units[index]}`;
}
