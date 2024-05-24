
export interface StandardResponse {
	message: string;
	success: boolean;
}

export interface HomeLoaderResponse extends StandardResponse{
    isLoggedIn:boolean
}

export interface CookieResponse extends StandardResponse{
    token:string
}