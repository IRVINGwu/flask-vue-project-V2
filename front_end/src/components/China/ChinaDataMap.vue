<template>
  <div class="china_map_container">
    <van-tabs @click="onClick" animated id="tabs">
      <van-tab title="现有确诊数">
        <div id="daily" style="width: 100%;height: 400px;"></div>
      </van-tab>
      <van-tab title="累计确诊数" id="sum" style="width: 100%;height: 400px;">
      </van-tab>
    </van-tabs>
  </div>
</template>

<script lang="ts">
import * as echarts from "echarts";
import { Tab, Tabs } from "vant";
import axiosGet from "../../services/http";

import { defineComponent, onMounted, ref, onBeforeMount, reactive } from "vue";

export default defineComponent({
  name: "ChinaDataMap",
  setup() {
    const flag = ref(false);

    //获取地图的json数据
    const result = ref(null);
    const getData = async () => {
      await axiosGet("/api/mapJson/china").then((res) => {
        result.value = res;
        // console.log(result.value)
      });
    };

    //画今日疫情地图
    let option1 = reactive({});
    let option2 = reactive({});
    const draw = async () => {
      await axiosGet("/api/chinaProvinceDaily").then((res) => {
        //注册地图所需的json数据
        echarts.registerMap("china", result.value);

        //创建datamap
        const dataMap = [];
        const dataMap2 = [];
        // console.log(res);

        //获取省份和数字
        const table = res[2].children;
        for (const key in table) {
          const name = table[key].name;
          const num = table[key].today.confirm;
          const obj = {
            name: name,
            value: num,
          };

          const name2 = table[key].name;
          const num2 = table[key].total.confirm;
          const obj2 = {
            name: name2,
            value: num2,
          };

          dataMap.push(obj);
          dataMap2.push(obj2);
        }

        //echarts配置项
        option1 = {
          tooltip: {
            //悬浮时显示
            formatter: function(params) {
              const info =
                "<p style='font-size:16px;color:white;padding-left:0;width:108px;height:30px;text-align:center;padding-top:4px;'>" +
                "省份：" +
                params.name +
                "<br/>" +
                "今日确诊：" +
                params.value +
                "</p>";
              return info;
            },
            backgroundColor: "rgba(0,0,0,0.5)",
            textStyle: { color: "#fff" },
          },
          //左侧小导航图标
          visualMap: {
            show: true,
            x: "left",
            bottom: "0%",
            itemWidth: 5,
            itemHeight: 5,
            textGap: 5,
            textStyle: {
              fontSize: 10,
            },
            itemGap: 4,
            splitList: [
              { start: 5000, end: 10000 },
              { start: 1000, end: 5000 },
              { start: 500, end: 1000 },
              { start: 100, end: 500 },
              { start: 10, end: 99 },
              { start: 1, end: 9 },
              { start: 0, end: 0 },
            ],
            color: [
              "#663366",
              "#990033",
              "#ff0033",
              "#99cccc",
              "#cccc00",
              "#f6c7a3",
              "rgb(226,235,244)",
            ],
          },
          //数据
          series: [
            {
              name: "中国",
              type: "map",
              zoom: 1.2,
              map: "china",
              label: {
                normal: {
                  show: true,
                  textStyle: {
                    fontSize: 6,
                    color: "#2b2b2b",
                  },
                },
              },
              data: dataMap,
            },
          ],
        };
        option2 = {
          tooltip: {
            formatter: function(params) {
              const info =
                "<p style='font-size:14px;color:white;width:108px;height:30px;text-align:center;padding-top:4px;padding-left:0;'>" +
                "省份：" +
                params.name +
                "<br/>" +
                "累计确诊：" +
                params.value +
                "</p>";
              return info;
            },
            backgroundColor: "rgba(0,0,0,0.5)",
            textStyle: { color: "#fff" },
          },
          visualMap: {
            show: true,
            x: "left",
            bottom: "0%",
            itemWidth: 5,
            itemHeight: 5,
            textGap: 5,
            textStyle: {
              fontSize: 10,
            },
            itemGap: 4,
            splitList: [
              { start: 100001, end: 500000 },
              { start: 50001, end: 100000 },
              { start: 10001, end: 50000 },
              { start: 1001, end: 10000 },
              { start: 101, end: 1000 },
              { start: 1, end: 100 },
              { start: 0, end: 0 },
            ],
            color: [
              "#663366",
              "#990033",
              "#ff0033",
              "#99cccc",
              "#cccc00",
              "#f6c7a3",
              "rgb(226,235,244)",
            ],
          },
          series: [
            {
              name: "中国",
              type: "map",
              zoom: 1.2,
              map: "china",
              label: {
                normal: {
                  show: true,
                  textStyle: {
                    fontSize: 6,
                    color: "#2b2b2b",
                  },
                },
              },
              data: dataMap2,
            },
          ],
        };

        const map1 = document.getElementById("daily");
        const map2 = document.getElementById("sum");

        map1.style.display = "block";
        map2.style.display = "block";
        // console.log(map1)
        // console.log(map2)

        const myChart1 = echarts.init(map1);
        const myChart2 = echarts.init(map2);

        myChart1.setOption(option1);
        myChart2.setOption(option2);
      });
    };

    const onClick = (name) => {
      if (name === 1) {
        flag.value = true;
      }
    };

    onBeforeMount(() => {
      getData();
    });
    onMounted(() => {
      draw();
    });
    return {
      flag,
      onClick,
    };
  },
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
  },
});
</script>

<style scoped lang="scss">
.china_map_container {
  padding: 0;
  margin: 0;
  box-sizing: border-box;

  van-tabs {
    width: 100%;
    height: 400px;
    display: flex;
    overflow: hidden;

    van-tab {
      width: 100%;
      height: 400px;
      display: block;
    }
  }
}
</style>
