
// vercel backend api environment
const vercel = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_APP_VERCEL_BACKEND_URL : import.meta.env.VITE_APP_LOCAL_BACKEND_URL;
// render backend api environment
const render = process.env.NODE_ENV ==='production' ? import.meta.env.VITE_APP_RENDER_BACKEND_URL : import.meta.env.VITE_APP_LOCAL_BACKEND_URL;
const backendUrls ={
    vercel,
    render
};
// google auth client id environment
const googleAuthClientId = import.meta.env.VITE_APP_GOOGLE_AUTH_CLIENT_ID;

export const environmentVariables = {
backendUrls,
googleAuthClientId
}