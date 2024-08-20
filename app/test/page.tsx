import Test from "./TestComponent"


export default function TestPage() {
	const names = [
		"James",
		"Ferdinand",
		"Julius"
	]
	return (
		<Test namesInit={names} />
	)
}
