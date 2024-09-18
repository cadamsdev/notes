export function isUsingWails() {
	return (
		typeof window !== 'undefined' &&
		'go' in window !== undefined
	);
}
