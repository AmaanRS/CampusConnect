import { IEvent } from "../backend/BackendTypes"

export interface StandardResponse {
	message: string
	success: boolean
}

export interface LoaderResponse extends StandardResponse {
	isLoggedIn: boolean
}

export interface CookieResponse extends StandardResponse {
	token: string
}

export interface IAuthContext {
	formData: {
		username: string
		email: string
		password: string
	}
	setFormData: React.Dispatch<
		React.SetStateAction<{ username: string; email: string; password: string }>
	>
	login: () => Promise<{ message: string; success: boolean; token?: string }>
	signup: () => Promise<{ message: string; success: boolean }>
}

export interface IEventContext {
	events: IEvent[]
	setEvents: React.Dispatch<React.SetStateAction<IEvent[]>>
	getAllEvents: () => Promise<{
		message: string
		success: boolean
		events: IEvent[]
	}>
	createEvent: () => Promise<{ message: string; success: boolean }>
}
