import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';

export class Request {
    axiosInstance: AxiosInstance;

    constructor({ config = {}, loginUrl = '/' }) {
        this.axiosInstance = axios.create(config);
        this.axiosInstance.interceptors.request.use(function(config) {
            config.headers['x-auth-token'] = localStorage.getItem('x-auth-token');
            return config;
        }, function(error) {
            return Promise.reject(error);
        });
        this.axiosInstance.interceptors.response.use(function(response) {
            const data = response.data;
            if (data.code === 200) {
                return data;
            }
            if (data.code === 401) {
                window.location.href = loginUrl + "?callback=" + encodeURIComponent(window.location.href);
            }
            return Promise.reject(data);
        }, function(error) {
            return Promise.reject(error);
        });
    }
    promiseRequest<T>(config: AxiosRequestConfig): Promise<T> {
        return this.axiosInstance.request(config);
    }
}

export const baseRequest = new Request({});