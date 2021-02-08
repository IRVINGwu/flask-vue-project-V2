<template>
  <div class="china_table">
    <table class="table table-hover" id="table">
      <thead class="thead-dark" id="thead">
        <tr id="tr">
          <th scope="col">省份/地区</th>
          <th scope="col">疫情发生地</th>
          <th scope="col">今日确诊</th>
          <th scope="col">今日治愈</th>
          <th scope="col">今日死亡</th>
        </tr>
      </thead>
      <tbody id="tbody">
        <tr v-for="(item, index) in tablelist" :key="index">
          <td>{{ item.location }}</td>
          <td>{{ item.city }}</td>
          <td>{{ item.todayConfirm }}</td>
          <td>{{ item.todayHeal }}</td>
          <td>{{ item.todayDead }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onBeforeMount } from "vue";
import axiosGet from "../../services/http";

export default defineComponent({
  setup() {
    const tablelist = reactive([]);

    const getTodayTable = async () => {
      await axiosGet("/api/chinaProvinceDaily").then((res) => {
        const table = res[2].children;

        for (const key in table) {
          if (table[key].today.confirm !== 0) {
            const province = table[key].name;
            const content = table[key].children;
            for (const key1 in content) {
              if (
                content[key1].today.confirm !== 0 &&
                !content[key1].name.includes("待确认") &&
                content[key1].today.confirm !== null
              ) {
                // console.log(content[key1].today.confirm);
                let cityName = "";
                if (content[key1].name === "未明确地区") {
                  cityName = "-";
                } else if (content[key1].name === "境外输入") {
                  cityName = "境外";
                } else {
                  cityName = content[key1].name;
                }
                const obj = {
                  todayConfirm: content[key1].today.confirm,
                  location: province,
                  // city:
                  //   content[key1].name === "未明确地区"
                  //     ? "-"
                  //     : content[key1].name,
                  city: cityName,
                  todayHeal:
                    content[key1].today.heal === null
                      ? 0
                      : content[key1].today.heal,
                  todayDead:
                    content[key1].today.dead === null
                      ? 0
                      : content[key1].today.dead,
                };
                tablelist.push(obj);
              }
            }
          }
        }
      });
    };

    onBeforeMount(() => {
      getTodayTable();
    });
    return {
      tablelist,
    };
  },
});
</script>

<style scoped lang="scss">
.china_table {
  padding: 3px;

  table {
    table-layout: fixed;

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
        font-size: 0.6rem;
        text-align: center;

        td {
          border: 0;
          border-bottom: 1px solid #dee2e6;
          text-align: center;
        }

        td:nth-child(1) {
          text-align: left;
        }
      }
    }
  }
}
</style>
