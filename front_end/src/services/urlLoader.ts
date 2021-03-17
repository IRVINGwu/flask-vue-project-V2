import { ref } from 'vue'
import axios from 'axios'

// 添加一个参数作为要使用的 地址
function useURLLoader<T>(url: string) {
// 声明几个ref，代表不同的状态和结果
  const result = ref<T | null>(null)
  const loading = ref(true)
  const loaded = ref(false)
  const error = ref(null)

// 发送异步请求，获得data
// 由于 axios 都有定义，所以rawData 可以轻松知道其类型
  axios.get(url).then((rawData) => {
    loading.value = false
    loaded.value = true
    result.value = rawData.data
  }).catch((e) => {
    error.value = e
  })
  // 将这些ref 一一返回
  return {
    result,
    loading,
    error,
    loaded
  }
}


export {useURLLoader}
