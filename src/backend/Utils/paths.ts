const userSignupRegex = /^\/user\/signup$/;
const imagesDeleteRegex = /^\/images\/delete\/.+$/;

const isAccountActiveMiddlewarePathsToSkip = [userSignupRegex, imagesDeleteRegex];

const authorizationMiddlewareFactoryToSkip = [""];

export {
	isAccountActiveMiddlewarePathsToSkip,
	authorizationMiddlewareFactoryToSkip,
};
