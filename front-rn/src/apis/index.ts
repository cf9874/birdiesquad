import axios, { AxiosRequestConfig } from "axios";

const API_CALLER = {
  // GET API Call Function
  get: async function (url: string, config: AxiosRequestConfig = {}) {
    return new Promise(function (resolve, reject) {
      axios
        .get(url, config)
        .then(async (response: object) => {
          resolve(response);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  },

  // POST API Call Function
  post: async function (
    url: string,
    body: object,
    config: AxiosRequestConfig = {}
  ) {
    return new Promise(function (resolve, reject) {
      axios
        .post(url, body, config)
        .then((response: object) => {
          resolve(response);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  },

  //PUT API Call Function
  put: async function (
    url: string,
    body: object,
    config: AxiosRequestConfig = {}
  ) {
    return new Promise(function (resolve, reject) {
      axios
        .put(url, body, config)
        .then((response: object) => {
          resolve(response);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  },

  //DELETE API Call Function
  delete: async function (
    url: string,
    body: string,
    config: AxiosRequestConfig = {}
  ) {
    return new Promise(function (resolve, reject) {
      axios
        .delete(url + `${body}`, config)
        .then((response: object) => {
          resolve(response);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  },

  //MULTIPART API Call Function
  multipart: async function (url: string, formData: object) {
    return new Promise(function (resolve, reject) {
      axios
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        })
        .then((response: object) => {
          resolve(response);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  },
};
export default API_CALLER;
