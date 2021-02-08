<template>
  <div class="countryNum">
    <!--  <h5 v-show="flag">抱歉,暂未获取到本地区当日疫情数据</h5>-->
    <div class="data_country_daily">
      <!-- 这里报错,不知道什么原因?不是vant组件的原因,而是得到的数据todayNum这个原因,但为什么会出现错误呢?我将具体的数据放到了today和total里面去了,就不报错了.-->
      <van-grid :column-num="3" :gutter="6" class="vanGrid" :border="true">
        <van-grid-item icon="photo-o" text="文字" class="van-grid-item_1"
          ><span>现有确诊</span
          ><span class="number_1">{{ today[0] }}</span></van-grid-item
        >

        <van-grid-item icon="photo-o" text="文字" class="van-grid-item_2"
          ><span>现有治愈</span
          ><span class="number_2">{{ today[2] }}</span></van-grid-item
        >

        <van-grid-item icon="photo-o" text="文字" class="van-grid-item_3"
          ><span>现有死亡</span
          ><span class="number_3">{{ today[3] }}</span></van-grid-item
        >

        <van-grid-item icon="photo-o" text="文字" class="van-grid-item_4"
          ><span>累计确诊</span
          ><span class="number_4">{{ total[0] }}</span></van-grid-item
        >

        <van-grid-item icon="photo-o" text="文字" class="van-grid-item_5"
          ><span>累计治愈</span
          ><span class="number_5">{{ total[2] }}</span></van-grid-item
        >

        <van-grid-item icon="photo-o" text="文字" class="van-grid-item_6"
          ><span>累计死亡</span
          ><span class="number_6">{{ total[3] }}</span></van-grid-item
        >
      </van-grid>
      <h4 v-cloak>统计截止至:{{ todayNum[5] }}</h4>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, toRefs } from "vue";
import axiosGet from "../../services/http";
import { Grid, GridItem } from "vant";

export default defineComponent({
  setup(props) {
    const { id } = toRefs(props);
    const todayNum = reactive([]);
    const today = reactive([]);
    const total = reactive([]);
    const specialId = ref("");
    const getNum = async (idx) => {
      // console.log(idx)
      await axiosGet("/api/worldDaily").then((res) => {
        if (idx === "日本") {
          specialId.value = "日本本土";
        }
        for (const key in res) {
          if (res[key].name === idx) {
            const item = res[key];
            for (const key1 in item) {
              todayNum.push(item[key1]);
            }
            // console.log(todayNum)
          } else if (res[key].name === specialId.value) {
            const item = res[key];
            for (const key1 in item) {
              todayNum.push(item[key1]);
            }
          }
        }
        for (const i in todayNum[0]) {
          today.push(todayNum[0][i]);
        }
        for (const c in todayNum[1]) {
          total.push(todayNum[1][c]);
        }
      });
    };
    onMounted(() => {
      getNum(id.value);
    });
    return {
      todayNum,
      today,
      total,
    };
  },
  components: {
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
  },
  props: ["id"],
});
</script>

<style lang="scss">
//当日疫情数字
.data_country_daily {
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;

  h3 {
    font-size: 18px;
    color: #1d1c1c;
    margin: 0 0 5px 0;
  }

  h4 {
    margin: 5px 0;
    padding: 0;
    font-size: 12px;
    color: rgb(124, 124, 124);
  }

  .vanGrid {
    .van-grid-item__content--center {
      border: 0.5px solid #ddd;
      border-radius: 5px;
      padding: 8px 0;

      :nth-child(1) {
        color: rgb(34, 34, 34);
        font-size: 13px;
      }

      :nth-child(2) {
        font-size: 20px;
      }

      //:nth-child(3) {
      //  font-size: 12px;
      //  color: rgb(124, 124, 124);
      //}
    }

    .van-grid-item_1 {
      .van-grid-item__content--center {
        background-color: rgb(253, 241, 241);

        .number_1 {
          color: rgb(242, 58, 59);
        }
      }
    }

    .van-grid-item_2 {
      .van-grid-item__content--center {
        background-color: rgb(250, 242, 246);

        .number_2 {
          color: rgb(202, 63, 129);
        }
      }
    }

    .van-grid-item_3 {
      .van-grid-item__content--center {
        background-color: rgb(252, 244, 240);

        .number_3 {
          color: rgb(240, 89, 38);
        }
      }
    }

    .van-grid-item_4 {
      .van-grid-item__content--center {
        background-color: rgb(253, 241, 241);

        .number_4 {
          color: rgb(204, 30, 30);
        }
      }
    }

    .van-grid-item_5 {
      .van-grid-item__content--center {
        background-color: rgb(241, 248, 244);

        .number_5 {
          color: rgb(23, 139, 90);
        }
      }
    }

    .van-grid-item_6 {
      .van-grid-item__content--center {
        background-color: rgb(243, 246, 248);

        .number_6 {
          color: rgb(78, 90, 101);
        }
      }
    }
  }
}
</style>
