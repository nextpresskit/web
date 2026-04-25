export const getAccessToken = () => {
	const accessToken = localStorage.getItem("accessToken");
	return accessToken;
};

export const getRefreshToken = () => {
	const refreshToken = localStorage.getItem("refreshToken");
	return refreshToken;
};

export const setAccessTokens = (accessToken: string, refreshToken: string) => {
	localStorage.setItem("accessToken", accessToken);
	localStorage.setItem("refreshToken", refreshToken);
};

export const removeAccessTokens = () => {
	localStorage.removeItem("accessToken");
	localStorage.removeItem("refreshToken");
};
