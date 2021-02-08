<template>
  <div class="china_table">
    <table class="table table-hover" id="table">
      <thead class="thead-dark" id="thead">
        <tr id="tr">
          <th scope="col">地区</th>
          <th scope="col">现有确诊</th>
          <th scope="col">累计确诊</th>
          <th scope="col">治愈</th>
          <th scope="col">死亡</th>
          <th scope="col">疫情</th>
        </tr>
      </thead>
      <tbody id="tbody">
        <tr v-for="(item, index) in tablelist" :key="index">
          <td>{{ item.province }}</td>
          <td>{{ item.todayConfirm }}</td>
          <td>{{ item.totalConfirm }}</td>
          <td>{{ item.totalHeal }}</td>
          <td>{{ item.totalDead }}</td>
          <td>
            <router-link :to="'/' + item.province" tag="td">详情</router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onBeforeMount } from "vue";
import axiosGet from "../../services/http";

export default defineComponent({
  name: "ChinaDataTable",
  setup() {
    const tablelist = reactive([]);

    const getTotalTable = async () => {
      await axiosGet("/api/chinaProvinceDaily").then((res) => {
        const table = res[2].children;
        for (const key in table) {
          const item = table[key];
          const obj = {
            province: item.name,
            todayConfirm: item.today.confirm,
            totalConfirm: item.total.confirm,
            totalHeal: item.total.heal,
            totalDead: item.total.dead,
          };
          tablelist.push(obj);
        }
      });
    };

    onBeforeMount(() => {
      getTotalTable();
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

        th:nth-child(6) {
          background-color: rgb(245, 245, 245);
          color: rgb(68, 34, 75);
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
        }

        td:nth-child(1) {
          text-align: left;
        }

        td:nth-child(6) {
          color: red;
          font-size: 0.5rem;
        }
      }
    }
  }
}
</style>
