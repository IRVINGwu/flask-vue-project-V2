<template>
  <div class="world_country">
    <h3>{{ id }}疫情数据</h3>
    <WorldCountryNum :id="id"></WorldCountryNum>

    <h3>{{ id }}疫情发展趋势</h3>
    <h5 v-if="flag">抱歉,暂未提供本地区疫情发展趋势,敬请谅解!</h5>
    <div
      id="country_line"
      class="line"
      style="width: 100%;height: 400px;"
    ></div>

    <h3>{{ id }}疫情预测</h3>
    <div class="country_predict">
      <p class="predict1">
        是否担心疫情遥遥无期？您可以查看疫情预测图，看看疫情拐点是否到来。
      </p>
      <p class="predict2">
        注意：预测基于当前日期之前的30天疫情数据模拟生成，仅供参考！！！
      </p>
      <router-link :to="'/world/predict/' + id"
        ><button type="button" class="btn btn-info table-button">
          点击查看预测
        </button></router-link
      >
    </div>

    <h3>{{ id }}疫情详情</h3>
    <h5 v-if="flag">抱歉,暂未提供本地区疫情详情,敬请谅解!</h5>
    <div id="country_table" class="table">
      <table class="table table-hover">
        <thead class="thead-dark">
          <tr>
            <th scope="col">日期</th>
            <th scope="col">累计确诊</th>
            <th scope="col">累计治愈</th>
            <th scope="col">累计死亡</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tablelist" :key="index">
            <td>{{ $filters.formatDate(item.date) }}</td>
            <td>{{ item.confirm }}</td>
            <td>{{ item.heal }}</td>
            <td>{{ item.dead }}</td>
          </tr>
        </tbody>
      </table>
      <!--      这里做一个按钮,由用户选择是否展示所有数据,但是渲染不出来,不知道什么原因 -->
      <!--      <button type="button" class="btn btn-info table-button" @click="showAll">查看全部数据</button>-->
    </div>
  </div>
</template>

<script lang="ts">
import * as echarts from "echarts";
import WorldCountryNum from "./WorldCountryNum.vue";
import axiosGet from "../../services/http";

import { defineComponent, ref, toRefs, onMounted, reactive } from "vue";

export default defineComponent({
  name: "WorldCountry",
  setup(props) {
    const { id } = toRefs(props);
    const tablelist = reactive([]);
    const xdata = reactive([]);
    const ydata1 = reactive([]);
    const ydata2 = reactive([]);
    const ydata3 = reactive([]);
    const flag = ref(false);

    //绘图
    let option = reactive({});
    const draw = async () => {
      option = {
        tooltip: {
          axisPointer: { lineStyle: { color: "rgb(239,243,250)" } },
          trigger: "axis",
          backgroundColor: "#fff",
          textStyle: { color: "#999", fontSize: 12 },
          extraCssText: "box-shadow:0 2px 10px #ccc",
        },
        legend: {
          data: ["累计确诊", "累计治愈", "累计死亡"],
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
            axisLabel: {
              formatter: function(num) {
                const numStr = num.toString();
                // 万以内直接返回
                if (numStr.length < 5) {
                  return numStr;
                }
                //大于8位数是亿
                else if (numStr.length > 8) {
                  const decimal = numStr.substring(
                    numStr.length - 8,
                    numStr.length - 8
                  );
                  return parseFloat(num / 100000000 + "." + decimal) + "亿";
                }
                //大于6位数是十万 (以10W分割 10W以下全部显示)
                else if (numStr.length > 5) {
                  const decimal = numStr.substring(
                    numStr.length - 4,
                    numStr.length - 4
                  );
                  return parseFloat(num / 10000 + "." + decimal) + "万";
                } else if (numStr.length == 5) {
                  const decimal = numStr.substring(
                    numStr.length - 3,
                    numStr.length - 4
                  );
                  return parseFloat(num / 10000 + "." + decimal) + "万";
                }
              },
            },
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
            name: "累计确诊",
            type: "line",
            data: ydata1,
          },
          {
            name: "累计治愈",
            type: "line",
            data: ydata2,
          },
          {
            name: "累计死亡",
            type: "line",
            data: ydata3,
          },
        ],
        grid: {
          x: 50,
          x2: 25,
        },
      };
      const myChart = echarts.init(document.getElementById("country_line"));
      myChart.setOption(option);
    };

    //获取作图数据
    const getData = async (idx) => {
      if (idx === "日本本土") {
        idx = "日本";
      }
      await axiosGet("/api/worldDailyData/" + idx).then((res) => {
        if (res === "详情暂时未找到") {
          const myChart = document.getElementById("country_line");
          myChart.innerHTML = "不好意思,本地区暂未提供疫情趋势图";
          myChart.style.textAlign = "center";
        } else {
          for (const key in res) {
            const data = res[key];
            const date = data.日期;
            const confirm = data.确诊病例;
            const heal = data.康复病例;
            const dead = data.死亡病例;
            const obj = {
              date: date,
              confirm: confirm,
              heal: heal,
              dead: dead,
            };
            //图表所需数据
            xdata.push(date);
            ydata1.push(confirm);
            ydata2.push(heal);
            ydata3.push(dead);
            //表格所需数据
            tablelist.push(obj);
          }
          draw();
        }
      });
      if (tablelist.length === 0) {
        flag.value = true;
      }
    };

    onMounted(() => {
      getData(id.value);
    });

    return {
      flag,
      tablelist,
    };
  },
  components: {
    WorldCountryNum,
  },
  props: ["id"],
});
</script>

<style lang="scss">
.world_country {
  //margin-top: 46px;
  margin-bottom: 35px;
  padding: 5px;

  h3 {
    font-size: 20px;
    color: #020202;
    margin: 10px 0;
    border-left: 5px solid red;
    padding: 0 0 0 5px;
  }

  h5 {
    font-size: 16px;
    color: darkred;
    margin: 10px 5px;
  }

  //疫情预测
  .country_predict {
    //text-align: center;
    .predict1 {
      font-size: 16px;
      color: #020202;
    }

    .predict2 {
      font-size: 14px;
      color: #646566;
      margin-top: -10px;
    }
  }

  //疫情数据表格
  .table {
    table {
      thead {
        height: 26px;

        tr {
          th {
            border: 0;
            font-size: 0.625rem;
            padding: 15px 0;
            text-align: center;
          }

          th:nth-child(1) {
            background-color: rgb(245, 245, 245);
            color: rgb(34, 34, 34);
            text-align: left;
            padding-left: 0.8rem;
          }

          th:nth-child(2) {
            background-color: rgb(252, 242, 232);
            color: rgb(255, 114, 60);
          }

          th:nth-child(3) {
            background-color: rgb(233, 247, 236);
            color: rgb(132, 139, 80);
          }

          th:nth-child(4) {
            background-color: rgb(243, 246, 248);
            color: rgb(78, 90, 101);
          }
        }
      }

      tbody {
        tr {
          font-size: 0.625rem;
          text-align: center;

          td {
            border: 0;
            border-bottom: 1px solid #dee2e6;
          }

          td:nth-child(1) {
            text-align: left;
          }
        }
      }
    }
  }

  .table-button {
    margin-left: 50%;
    transform: translateX(-50%);
    width: 50%;
    text-align: center;
    color: white;
  }
}
</style>
