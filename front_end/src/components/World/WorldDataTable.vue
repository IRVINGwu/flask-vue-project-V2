<template>
  <div class="china_table">
    <table class="table table-hover">
      <thead class="thead-dark">
        <tr>
          <th scope="col">国家</th>
          <th scope="col">现有确诊</th>
          <!--        <th scope="col">累计确诊</th>-->
          <th scope="col">现有治愈</th>
          <th scope="col">现有死亡</th>
          <th scope="col">疫情</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tablelist" :key="index">
          <td>{{ item.name }}</td>
          <td>{{ item.todayConfirm }}</td>
          <!--        <td>{{item.total.confirm }}</td>-->
          <td>{{ item.todayHeal }}</td>
          <td>{{ item.todayDead }}</td>
          <td>
            <router-link :to="'/world/' + item.name" tag="td" class="link"
              >more</router-link
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import axiosGet from "../../services/http";

export default defineComponent({
  name: "WorldDataTable",
  setup() {
    const tablelist = reactive([]);

    const getWorldTable = async () => {
      await axiosGet("/api/worldDaily").then((res) => {
        for (const key in res) {
          const item = res[key];
          const obj = {
            name: item.name,
            todayConfirm: item.today.confirm === null ? 0 : item.today.confirm,
            todayHeal: item.today.heal === null ? 0 : item.today.heal,
            todayDead: item.today.dead === null ? 0 : item.today.dead,
          };
          tablelist.push(obj);
        }
      });
    };
    onMounted(() => {
      getWorldTable();
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
    thead {
      height: 26px;

      tr {
        th {
          border: 0;
          font-size: 0.4rem;
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

        //th:nth-child(3) {
        //  background-color: rgb(253, 238, 238);
        //  color: rgb(246, 104, 133);
        //}
        th:nth-child(3) {
          background-color: rgb(233, 247, 236);
          color: rgb(132, 139, 80);
        }

        th:nth-child(4) {
          background-color: rgb(243, 246, 248);
          color: rgb(78, 90, 101);
        }

        th:nth-child(5) {
          background-color: rgb(245, 245, 245);
          color: rgb(68, 34, 75);
        }
      }
    }

    tbody {
      tr {
        font-size: 0.5rem;
        text-align: center;

        .link {
          font-size: 0.3rem;
          color: red;
        }

        td {
          border: 0;
          border-bottom: 1px solid #dee2e6;
        }

        td:nth-child(1) {
          font-size: 0.4rem;
          text-align: left;
        }
      }
    }
  }
}
</style>
