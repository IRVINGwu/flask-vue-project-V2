<template>
  <div class="newsItem">
    <h3>{{ newsItem.title }}</h3>
    <span>{{ newsItem.source }}</span
    ><br />
    <span>{{ newsItem.time }}</span>
    <div class="content" v-html="newsItem.content"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, onMounted } from "vue";
import axiosGet from "../../services/http";
// import {useURLLoader} from "@/services/urlLoader";

export interface NewsItemResult{
  content: string;
  date: string;
  id: number;
  link: string;
  source?: string;
  time?: string;
  title?: string;
}

export default defineComponent({
  name: "newsItem",
  setup(props) {
    const { id } = toRefs(props);
    const newsItem = ref("");

    const getNews = async () => {
      await axiosGet("/api/news/" + id.value).then((res) => {
        // console.log(res);
        newsItem.value = res.data[0];
      });
    };
    onMounted(() => {
      getNews();
    });

    return {
      newsItem
    };
  },
  props: ["id"],
});
</script>

<style scoped lang="scss">
.newsItem {
  //margin-top: 46px;
  margin-bottom: 50px;
  padding: 10px;
  h3 {
    text-align: center;
    font-size: 20px;
    color: #020202;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  }
  span {
    font-size: 16px;
    color: rgba(146, 131, 112, 0.9);
    padding-left: 5px;
  }
  .content {
    font-size: 16px;
    color: #020202;
    padding: 5px;
  }
}
</style>
