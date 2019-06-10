import Cookies from 'universal-cookie';
const cookies = new Cookies();
// Add a request interceptor
export const setRequestHeadersInterceptor = config => {
    config.headers = {
        "Accept": "application/json",
        'Content-Type': 'application/json',
    }
    const token = cookies.get('token')
    if (token) {
        config.headers.Authorization = `${'bearer ' + cookies.get('token')}`
    }
    return config;
};

