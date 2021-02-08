import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router";
import "./global.config";
import Vant from "vant";
import "vant/lib/index.css";
import moment from "moment";

const app = createApp(App);

app.config.globalProperties.$route = router;

//定义全局的过滤器
app.config.globalProperties.$filters = {
  formatContent(data: string | null) {
    if (data === null) {
      return "暂时未找到新闻内容";
    } else {
      return data.slice(3, 20);
    }
  },
  formatNumber(data: number): string {
    if (data < 0) {
      return data.toString();
    } else if (data > 0) {
      return "+" + data;
    } else {
      return "+0";
    }
  },
  formatDate(data: string): string {
    return moment(data).format("YYYY-MM-DD");
  },
};

app
  .use(router)
  .use(Vant)
  .mount("#app");
