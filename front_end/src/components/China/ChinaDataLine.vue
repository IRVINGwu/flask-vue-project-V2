<template>
  <div class="china_line_container">
    <van-tabs type="card" animated @click="onClick" id="tabs">
      <van-tab title="新增趋势">
        <div id="chartline1" style="width:100%; height:400px;"></div>
      </van-tab>
      <van-tab title="确诊趋势">
        <div id="chartline2" style="width:100%; height:400px;"></div>
      </van-tab>
      <van-tab
        title="治疗趋势"
        id="chartline3"
        style="width:50%; height:400px;"
      >
      </van-tab>
    </van-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import { Tab, Tabs } from "vant";
import * as echarts from "echarts";
import axiosGet from "../../services/http";

export default defineComponent({
  name: "ChinaDataLine",
  setup() {
    // const current = ref(0)
    //制图所需要的数据
    const xdata = reactive([]);
    const ydata1 = reactive([]);
    const ydata2 = reactive([]);
    const ydata3 = reactive([]);
    const ydata4 = reactive([]);
    const ydata5 = reactive([]);
    //设置好的配置项
    let option1 = reactive({});
    let option2 = reactive({});
    let option3 = reactive({});
    const onClick = (name = 0) => {
      // console.log(name)
      return name;
    };
    const drawLine = async () => {
      await axiosGet("/api/chinaSum").then((res) => {
        for (let i = 0; i < res.length; i++) {
          xdata.push(res[i].date);
          ydata1.push(res[i].today.confirm);
          ydata2.push(res[i].today.suspect);
          ydata3.push(res[i].total.confirm);
          ydata4.push(res[i].total.heal);
          ydata5.push(res[i].total.dead);
        }
        option1 = {
          tooltip: {
            trigger: "axis",
            axisPointer: { lineStyle: { color: "rgb(239,243,250)" } },
            backgroundColor: "#fff",
            textStyle: { color: "#999", fontSize: 12 },
            extraCssText: "box-shadow:0 2px 10px #ccc;",
          },
          legend: {
            data: ["新增确诊", "新增疑似"],
            show: true,
            top: "20",
          },
          xAxis: [
            {
              type: "category",
              data: xdata,
            },
          ],
          yAxis: [
            {
              type: "value",
            },
          ],
          dataZoom: [
            {
              type: "slider",
              start: 0,
              end: 100,
              bottom: 0,
              show: true,
            },
          ],
          series: [
            {
              name: "新增确诊",
              type: "line",
              data: ydata1,
            },
            {
              name: "新增疑似",
              type: "line",
              data: ydata2,
            },
          ],
          grid: {
            x: 50,
            x2: 25,
          },
        };
        option2 = {
          tooltip: {
            trigger: "axis",
            axisPointer: { lineStyle: { color: "rgb(239,243,250)" } },
            backgroundColor: "#fff",
            textStyle: { color: "#999", fontSize: 12 },
            extraCssText: "box-shadow:0 2px 10px #ccc",
          },
          legend: {
            data: ["新增确诊", "累计确诊"],
            show: true,
            top: "20",
          },
          xAxis: [
            {
              type: "category",
              data: xdata,
            },
          ],
          yAxis: [
            {
              type: "value",
            },
          ],
          dataZoom: [
            {
              type: "slider",
              start: 0,
              end: 100,
              bottom: 0,
              show: true,
            },
          ],
          series: [
            {
              name: "新增确诊",
              type: "line",
              data: ydata1,
            },
            {
              name: "累计确诊",
              type: "line",
              data: ydata3,
            },
          ],
          grid: {
            x: 50,
            x2: 25,
          },
        };
        option3 = {
          tooltip: {
            trigger: "axis",
            axisPointer: { lineStyle: { color: "rgb(239,243,250)" } },
            backgroundColor: "#fff",
            textStyle: { color: "#999", fontSize: 12 },
            extraCssText: "box-shadow:0 2px 10px #ccc",
          },
          legend: {
            data: ["累计治愈", "累计死亡"],
            show: true,
            top: "20",
          },
          xAxis: [
            {
              type: "category",
              data: xdata,
            },
          ],
          yAxis: [
            {
              type: "value",
            },
          ],
          dataZoom: [
            {
              type: "slider",
              start: 0,
              end: 100,
              bottom: 0,
              show: true,
            },
          ],
          series: [
            {
              name: "累计治愈",
              type: "line",
              data: ydata4,
            },
            {
              name: "累计死亡",
              type: "line",
              data: ydata5,
            },
          ],
          grid: {
            x: 50,
            x2: 25,
          },
        };

        const line1 = document.getElementById("chartline1");
        const line2 = document.getElementById("chartline2");
        const line3 = document.getElementById("chartline3");

        line1.style.display = "block";
        line2.style.display = "block";
        line3.style.display = "block";
        const chartline1 = echarts.init(line1);
        const chartline2 = echarts.init(line2);
        const chartline3 = echarts.init(line3);
        chartline1.setOption(option1);
        chartline2.setOption(option2);
        chartline3.resize();
        chartline3.setOption(option3);
      });
    };
    onMounted(() => {
      // onClick()
      drawLine();
    });
    return {
      onClick,
    };
  },
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
  },
});
</script>

<style lang="scss">
.china_line_container {
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
