import axios from "axios";

function axiosGet(options: any, params: number | string) {
  axios(options.url + params)
    .then((res) => {
      options.success(res.data);
    })
    .catch((err) => {
      options.error(err);
    });
}

export { axiosGet };
