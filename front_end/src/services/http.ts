import axios from "axios";
import { Toast, Dialog } from "vant";

axios.defaults.baseURL = "http://192.168.1.2:8080";

axios.defaults.timeout = 10000;

axios.interceptors.request.use(
  (config) => {
    Toast.loading({
      duration: 0,
      message: "加载中...",
      forbidClick: true,
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    Toast.clear();
    return response;
  },
  (error) => {
    Toast.clear();
    Dialog.alert({
      title: "提示",
      message: "网络请求失败,反馈给客服",
    });
  }
);

function axiosGet(url: string, data?: string): any {
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url,
      params: data,
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default axiosGet;
