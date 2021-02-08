<template>
  <div class="china_province">
    <h3>{{ id }}疫情地图</h3>
    <div id="province_map" class="map" style="width: 100%;height: 400px;"></div>
    <h3>{{ id }}疫情详情</h3>
    <div id="province_table" class="table">
      <table class="table table-hover">
        <thead class="thead-dark">
          <tr>
            <th scope="col">城市</th>
            <th scope="col">现有确诊</th>
            <th scope="col">累计确诊</th>
            <th scope="col">治愈</th>
            <th scope="col">死亡</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tablelist" :key="index">
            <td v-text="item.name === '未明确地区' ? id : item.name"></td>
            <td>{{ item.todayConfirm }}</td>
            <td>{{ item.totalConfirm }}</td>
            <td>{{ item.totalHeal }}</td>
            <td>{{ item.totalDead }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  toRefs,
  ref,
  reactive,
  onBeforeMount,
  onMounted,
} from "vue";
import axiosGet from "../../services/http";
import * as echarts from "echarts";

export default defineComponent({
  setup(props) {
    const { id } = toRefs(props);
    const tablelist = reactive([]);
    const dataMap = reactive([]);

    //获取地图所需的json数据
    const result = ref(null);
    const getJson = async (idx) => {
      await axiosGet("/api/mapJson/" + idx).then((res) => {
        result.value = res;
      });
    };

    let option = reactive({});
    const draw = async (idx) => {
      echarts.registerMap(idx, result.value);
      option = {
        tooltip: {
          formatter: function(params) {
            const info =
              '<p style="color: white;font-size: 16px;padding-left: 0;width:108px;height: 30px;text-align: center;padding-top: 4px;">' +
              params.name.toString() +
              "<br/>" +
              "今日确诊:" +
              params.value +
              "</p>";
            return info;
          },
          backgroundColor: "rgb(0,0,0,0.5)",
          textStyle: "#fff",
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
            { start: 1000, end: 10000 },
            { start: 200, end: 1000 },
            { start: 100, end: 200 },
            { start: 50, end: 100 },
            { start: 10, end: 50 },
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
        series: [
          {
            name: idx,
            type: "map",
            zoom: 1.2,
            map: idx,
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
        grid: {
          x: 50,
          x2: 25,
        },
      };
      const myChart = echarts.init(document.getElementById("province_map"));
      myChart.setOption(option);
    };

    //获取制图所需的数据
    const getData = async (idx) => {
      await axiosGet("/api/chinaProvinCity/" + idx).then((res) => {
        //配置dataMap
        let name = "";
        if (
          idx === "上海" ||
          idx === "天津" ||
          idx === "重庆" ||
          idx === "北京"
        ) {
          for (const key in res) {
            const data = res[key][0];
            name = data.name + "区";
            const value = data.today.confirm;
            const obj = {
              name: name,
              value: value,
            };
            dataMap.push(obj);
          }
        } else if (idx === "香港" || idx === "澳门" || idx === "台湾") {
          const myChart = document.getElementById("province_map");
          myChart.innerHTML = "不好意思,本地区暂未提供疫情地图";
          myChart.style.textAlign = "center";
        } else {
          for (const key in res) {
            const data = res[key][0];
            if (data.name === "神农架林区") {
              name = data.name;
            } else if (data.name === "恩施州") {
              name = "恩施土家族苗族自治州";
            } else {
              name = data.name + "市";
            }
            const value = data.today.confirm;
            const obj = {
              name: name,
              value: value,
            };
            dataMap.push(obj);
          }
        }
        //获取表格所需数据
        for (const key in res) {
          const data = res[key][0];
          const obj = {
            name: data.name,
            todayConfirm: data.today.confirm,
            totalConfirm: data.total.confirm,
            totalHeal: data.total.heal,
            totalDead: data.total.dead,
          };
          tablelist.push(obj);
        }
        draw(idx);
      });
    };

    onBeforeMount(() => {
      getJson(id.value);
    });
    onMounted(() => {
      getData(id.value);
    });
    return {
      tablelist,
    };
  },
  props: ["id"],
});
</script>

<style scoped lang="scss">
.china_province {
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

  .table {
    padding: 3px;

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
            background-color: rgb(253, 238, 238);
            color: rgb(246, 104, 133);
          }

          th:nth-child(4) {
            background-color: rgb(233, 247, 236);
            color: rgb(132, 139, 80);
          }

          th:nth-child(5) {
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
}
</style>
