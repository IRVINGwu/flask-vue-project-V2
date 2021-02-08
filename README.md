项目后端用flask，前端用vue，做一个移动端的健康咨询app。

前端使用Vue3.0+TypeScript来写。我原以为没有太大的变化，只是将作图的过程放在setup()函数中而已，没想到真的有很大的变化，我在网上查了一下，最起码设置图的option这一步是不能放在setup()函数中的，而是要放在外面的，而放在外面，调用又有问题。再说现在echarts可能对于vue3.0+ts的支持不够，问题还是蛮多的，所以只能等以后有人写出来，我再照着做。这里可以参考：https://www.cnblogs.com/catherinezyr/p/10768399.html。

<p style='color:red;font-size:18px;'>重点看这篇文章https://blog.csdn.net/ed7zgee9x/article/details/109039793</P>

这篇文章介绍了vue2.x时代ts的写法和vue3.0时代ts的写法，可以看出，vue3.0时代ts项目的写法和js区别不大，所以我可以得出结论，如果想使用vue3.0+ts来写echarts的话，只是类型声明这方面比较麻烦，其余地方变化不大。echarts的类型声明。https://blog.csdn.net/qq_43584975/article/details/111279083

```js
const ele = document.getElementById('hrvChart');//根据Id获取容器
 const chart = echarts.init(ele as HTMLCanvasElement);	
 chart.setOption(
        this.options(
          this.seriesData,
          this.max,
          this.min,
          this.maxtime,
          this.mintime,
          this.month
        ),
        true
      );
      //绘制图表
      //seriesData是以数组形式，具体可以看下前面函数写的类型，制作一个参考用，其余的数据都是在获取之后在传入进去

```



如果只是在vue3.0项目中使用echarts的话，参考这篇文章：https://blog.csdn.net/qq_39279706/article/details/112245678

```vue
<template>
  <div class="map">
     <div id="main" style="width: 100%; height: 400px;">
     </div>
  </div>
</template>
<script>
import * as echarts from 'echarts';
import { onMounted } from 'vue';
export default {
  setup() {
    //methods
    	const echartInit = () =>{
       		var myChart = echarts.init(document.getElementById('main'));
        	// 指定图表的配置项和数据
        	var option = {
	            title: {
	                text: 'ECharts 入门示例'
	            },
	            tooltip: {},
	            legend: {
	                data:['销量']
	            },
	            xAxis: {
	                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
	            },
	            yAxis: {},
	            series: [{
	                name: '销量',
	                type: 'bar',
	                data: [5, 20, 36, 10, 10, 20]
	            }]
	        };
	        // 使用刚指定的配置项和数据显示图表。
	        myChart.setOption(option);
   		}
    //onMounted
    	onMounted(()=>{
      		echartInit()
    	})
    //return
    	return { 
      		echartInit
    	};
  }
};

```

------

在axios请求数据后，获得的数据也要赋类型，在获取数据后的循环过程中，每一个循环项，比如说result[i]也要赋类型，比如说：`const item: any = result[i]`，这样后面就不会报错了。但这样不是很好的解决办法，那样我还不如直接用js。

在使用第三方js文件的时候，比如说axios，我如果封装为一个方法，那么这个方法的返回值必须和我在组件中定义的响应式数据的类型保持一致，否则会报错，但是我不知道返回的是什么，所以这点很难。看下面：

![image-20210208152401630](https://img-typora-irving.oss-cn-shanghai.aliyuncs.com/img/image-20210208152401630.png)

上面将数据定义为null并不好，会报错，还是看具体返回结果吧。

比如说我在绘制地图时，返回的是json数据，我先把结果定义为null，没有错误，但是定义为''就报错：

```js
	//chinaDataMap.vue文件

	//获取地图的json数据
    const result = ref(null); //定义为null不报错，定义为“”就报错
    const getData = async () => {
      await axiosGet("/api/mapJson/china").then((res) => {
        result.value = res;
      });
    };
```



于是我把定义的axiosGet函数的返回值定义为any类型，没有报错了。如果还有`Parameter 'res' implicitly has an 'any' type`这种报错的话，那么就在tsconfig.json里面将useStrict改为false

![image-20210208152601456](https://img-typora-irving.oss-cn-shanghai.aliyuncs.com/img/image-20210208152601456.png)

------

TS比JS严格，在该用const的地方，不能使用let（但是在JS中，我用`const num = ref(0)`这种定义方法的时候，反而会报错，要改用let，不知道怎么回事。）；如果导入的方法没有使用过，那么会报错，需要删除掉。



echarts的option的类型为EChartsFullOption，可以写上，但是这个类型检查严格，它会依据最新安装的echarts的配置项来检查，可以看看。



TS中由于是静态类型检查，所以当一个方法定义在另一个方法下面，而另一个方法使用了这个方法，就会报`某某方法 was used befor it was defined`，这时候只需要将这个方法放到另一个方法上面即可。

------

2021.2.8

项目勉强可以跑起来了，其实VUE3.0的问题解决之后，ts的部分其实没有什么影响。所以这个项目中的类型定义很少，下一步可以看一下，哪些地方可以加上类型定义，方便大家的合作。