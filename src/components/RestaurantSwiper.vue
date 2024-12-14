<!-- RestaurantSwiper.vue -->
<template>
  <div class="relative min-h-screen bg-gray-100">
    <!-- 距離控制滑塊 -->
    <div class="fixed top-4 left-0 right-0 z-10 px-4">
      <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-4">
        <label for="radius" class="block text-sm font-medium text-gray-700 mb-2">
          搜尋半徑: {{ radius / 1000 }} 公里
        </label>
        <input
          type="range"
          id="radius"
          v-model="radius"
          :min="1000"
          :max="5000"
          step="100"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          @change="handleRadiusChange"
        >
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>1km</span>
          <span>5km</span>
        </div>
      </div>
    </div>

    <!-- 餐廳卡片 -->
    <div class="relative h-screen overflow-hidden">
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-2"></div>
          <p class="text-gray-600">正在搜尋附近的餐廳...</p>
        </div>
      </div>

      <div v-else-if="error" class="absolute inset-0 flex items-center justify-center p-4">
        <div class="text-center text-red-600">
          <p class="text-lg font-semibold mb-2">發生錯誤</p>
          <p>{{ error }}</p>
          <button 
            @click="fetchRestaurants" 
            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            重試
          </button>
        </div>
      </div>

      <template v-else>
        <div class="w-full max-w-md mx-auto h-[600px] relative">
          <!-- 主卡片視圖 -->
          <div v-if="!showDetails" 
               class="card"
               :style="{ transform: `translateX(${offsetX}px)` }"
               @touchstart="handleTouchStart"
               @touchmove="handleTouchMove"
               @touchend="handleTouchEnd">
            <img
              :src="currentRestaurant.image"
              :alt="currentRestaurant.name"
              class="w-full h-full object-cover"
            />
            
            <!-- 卡片資訊覆蓋層 -->
            <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
              <h2 class="text-3xl font-bold mb-2">{{ currentRestaurant.name }}</h2>
              <div class="flex items-center space-x-4">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span class="ml-1">{{ currentRestaurant.rating }}</span>
                </div>
                <!-- <span>•</span>
                <span>{{ currentRestaurant.cuisine }}</span> -->
              </div>
            </div>

            <!-- 操作按鈕 -->
            <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <button 
                @click="nextRestaurant"
                class="p-3 bg-white rounded-full shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button 
                @click="showDetails = true"
                class="p-3 bg-white rounded-full shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 詳細資訊視圖 -->
          <div v-else class="card p-4 bg-white overflow-y-auto">
            <button
              @click="showDetails = false"
              class="absolute top-4 left-4 p-2 rounded-full bg-white shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div class="mt-8">
              <h2 class="text-2xl font-bold mb-4">{{ currentRestaurant.name }}</h2>
              
              <!-- 評分和類型 -->
              <div class="flex items-center justify-center space-x-4 mb-4">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  <span class="ml-1">{{ currentRestaurant.rating }}</span>
                  <span class="ml-2 text-gray-600">({{ currentRestaurant.user_ratings_total }}則評價)</span>
                </div>
              </div>
              
              <!-- 地址 -->
              <div class="mb-4">
                <h3 class="font-semibold text-gray-700 mb-1">地址</h3>
                <p class="text-gray-600">{{ currentRestaurant.address }}</p>
              </div>
              
              <!-- 營業時間 -->
              <div class="mb-4">
                <h3 class="font-semibold text-gray-700 mb-1">營業時間</h3>
                <div v-if="currentRestaurant.opening_hours && currentRestaurant.opening_hours.length > 0" class="text-gray-600">
                  <div v-for="(hours, index) in currentRestaurant.opening_hours" :key="index" class="mb-1">
                    {{ hours }}
                  </div>
                </div>
                <p v-else class="text-gray-500 italic">暫無營業時間資訊</p>
                <p class="mt-2 text-sm" :class="currentRestaurant.open_now ? 'text-green-600' : 'text-red-600'">
                  {{ currentRestaurant.open_now ? '營業中' : '休息中' }}
                </p>
              </div>
              <!-- Uber Eats 連結 -->
              <div v-if="currentRestaurant.uber_eats_url" class="mb-4 flex justify-center">
                <a 
                  :href="currentRestaurant.uber_eats_url" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center px-4 py-2 bg-[#06C167] text-white rounded-lg hover:bg-[#05a85a] transition-colors"
                >
                  <img src="https://d3i4yxtzktqr9n.cloudfront.net/web-eats-v2/ee037401cb5d31b23cf780808ee4ec1f.svg" 
                       alt="Uber Eats" 
                       class="w-6 h-6 mr-2"
                  >
                  在 Uber Eats 上訂購
                </a>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { restaurantService } from '../services/api'

// 狀態管理
const restaurants = ref([])
const currentIndex = ref(0)
const showDetails = ref(false)
const startX = ref(null)
const offsetX = ref(0)
const loading = ref(false)
const error = ref(null)
const radius = ref(2000) // 默認搜尋半徑為 2 公里

// 佔位圖片 URL
const placeholderImage = 'https://via.placeholder.com/800x600.png?text=No+Image'

// 計算當前餐廳
const currentRestaurant = computed(() => {
  if (!restaurants.value || !restaurants.value.length) {
    return {
      id: null,
      name: '',
      image: placeholderImage,
      rating: 0,
      user_ratings_total: 0,
      cuisine: '',
      address: '',
      opening_hours: null,
      open_now: null,
      description: '',
      uber_eats_url: null
    }
  }
  const restaurant = restaurants.value[currentIndex.value];
  return {
    id: restaurant.place_id,
    name: restaurant.name,
    image: restaurant.photos?.[0]?.urls?.large || placeholderImage,
    rating: restaurant.rating || 0,
    user_ratings_total: restaurant.user_ratings_total || 0,
    cuisine: restaurant.types?.[0] || '',
    address: restaurant.address || '',
    opening_hours: restaurant.opening_hours || null,
    open_now: restaurant.open_now,
    description: '',
    uber_eats_url: restaurant.uber_eats_url || null
  }
})

// 獲取使用者位置
const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('您的瀏覽器不支援地理位置功能'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        reject(new Error('無法獲取您的位置，請確認已允許位置存取權限'));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};

// 獲取餐廳數據
const fetchRestaurants = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    let location;
    try {
      location = await getUserLocation();
    } catch (locationError) {
      console.warn('無法獲取位置，使用預設位置:', locationError);
      location = {
        latitude: 25.0330,  // 台北市中心緯度（預設值）
        longitude: 121.5654 // 台北市中心經度（預設值）
      };
    }
    
    const response = await restaurantService.searchRestaurants(
      location.latitude,
      location.longitude,
      radius.value
    );
    
    if (response.data) {
      restaurants.value = response.data;
      currentIndex.value = 0;
    } else {
      error.value = '無法獲取餐廳資料';
    }
  } catch (err) {
    error.value = err.message || '無法獲取餐廳資料，請稍後再試';
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
}

// 處理半徑變更
const handleRadiusChange = () => {
  fetchRestaurants()
}

// 觸控處理函數
const handleTouchStart = (e) => {
  startX.value = e.touches[0].clientX
}

const handleTouchMove = (e) => {
  if (startX.value === null) return
  const currentX = e.touches[0].clientX
  const diff = currentX - startX.value
  offsetX.value = diff
}

const handleTouchEnd = () => {
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
const nextRestaurant = () => {
  if (currentIndex.value < restaurants.value.length - 1) {
    currentIndex.value++
  }
}

// 在組件掛載時獲取數據
onMounted(fetchRestaurants)
</script>

<style scoped>
.card {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  transition: transform 0.3s ease;
}
</style>
