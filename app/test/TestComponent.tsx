'use client'
import { useOptimistic, useState, useTransition } from "react"
import { v4 as uuidv4 } from 'uuid';

type Props = {
	namesInit: string[]
}
export default function Test({ namesInit } : Props) {
	const [ names, setNames ] = useState(namesInit)
	const [ optimisticNames, updateNames ] = useOptimistic(names,
		(state, newName: string) => {
			return [...state, newName]
		}
	)
	const [ isPending , startTransition ] = useTransition()
	console.log("optimisticNames: ", optimisticNames, isPending)

	async function addName() {
		startTransition(()=>{
			updateNames('Roberto')
		})
		await new Promise((res) => setTimeout(()=>{console.log("hey")},10000));
	}

	return (
		<>
			<form action={addName}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
			<h1>{`is pending: ${isPending}`}</h1>
			{optimisticNames.map(n => <p key={uuidv4()}>{n}</p>)}
		</>
	)

}
