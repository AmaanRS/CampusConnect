import { createContext, ReactNode, useContext, useState } from "react"
import { IEventContext } from "../../FrontendTypes"
import axios from "axios"
import { IEvent } from "../../../backend/BackendTypes"

const VITE_BACKEND_ORIGIN: string = import.meta.env.VITE_BACKEND_ORIGIN

const EventContext = createContext<IEventContext | undefined>(undefined)

function EventProvider({ children }: { children: ReactNode }) {
	const [events, setEvents] = useState<IEvent[]>([])

	//Implement this
	const getAllEvents = () => {}

	//Implement this
	const createEvent = () => {}

	return (
		<>
			<EventContext.Provider value={{ events, setEvents,getAllEvents,createEvent }}>
				{children}
			</EventContext.Provider>
		</>
	)
}

export default EventProvider

export const useEvent = () => {
	const context = useContext(EventContext)
	if (!context) {
		throw new Error("useEvent must be used within an EventProvider")
	}
	return context
}
