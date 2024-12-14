import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import { ref, computed } from 'vue'

// 餐廳資料
export const restaurants = [
  {
    id: 1,
    name: "星光牛排館",
    image: "/api/placeholder/800/600",
    rating: 4.5,
    priceLevel: 3,
    cuisine: "美式牛排",
    address: "台北市信義區信義路五段7號",
    openHours: "11:30-21:30",
    description: "提供高級牛排料理，環境優雅，適合商務聚餐與約會。特製醬料與完美火候讓每一塊牛排都充滿美味。"
  },
  {
    id: 2,
    name: "湯師父麵食館",
    image: "/api/placeholder/800/600",
    rating: 4.2,
    priceLevel: 1,
    cuisine: "中式麵食",
    address: "台北市大安區忠孝東路四段45號",
    openHours: "10:00-20:30",
    description: "老字號麵食館，以手工麵條聞名，湯頭濃郁，價格實惠。推薦牛肉麵和餃子。"
  },
  {
    id: 3,
    name: "阿明海鮮餐廳",
    image: "/api/placeholder/800/600",
    rating: 4.7,
    priceLevel: 2,
    cuisine: "台式海鮮",
    address: "台北市萬華區廣州街60號",
    openHours: "16:00-00:00",
    description: "新鮮海產直送，現點現煮，合菜與熱炒都很受歡迎。必點清蒸石斑魚和炒螃蟹。"
  }
]

// 狀態管理
export const currentIndex = ref(0)
export const showDetails = ref(false)
export const startX = ref(null)
export const offsetX = ref(0)

// 計算當前餐廳
export const currentRestaurant = computed(() => restaurants[currentIndex.value])

// 觸控處理函數
export const handleTouchStart = (e) => {
  startX.value = e.touches[0].clientX
}

export const handleTouchMove = (e) => {
  if (startX.value === null) return
  const currentX = e.touches[0].clientX
  const diff = currentX - startX.value
  offsetX.value = diff
}

export const handleTouchEnd = () => {
  if (offsetX.value > 50) {
    // 右滑
    showDetails.value = true
  } else if (offsetX.value < -50) {
    // 左滑
    nextRestaurant()
  }
  startX.value = null
  offsetX.value = 0
}

// 切換到下一個餐廳
export const nextRestaurant = () => {
  if (currentIndex.value < restaurants.length - 1) {
    currentIndex.value++
  }
}

createApp(App).mount('#app')