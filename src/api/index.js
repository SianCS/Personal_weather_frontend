import axios from "axios";
// import useUserStore from "../stores/userStore";

// URL หลักของ Backend API ของคุณ
const API_BASE_URL = "http://localhost:8555/api";

/**
 * API client สำหรับเรียก endpoint ที่ไม่ต้องยืนยันตัวตน
 * เช่น /weather, /cities/search, /auth/login, /auth/register
 */
export const publicApi = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * API client สำหรับเรียก endpoint ที่ต้องยืนยันตัวตน (จะแนบ Token ไปด้วย)
 * เช่น /favorites, /auth/me, /weather/:cityId/forecast
 */
export const privateApi = axios.create({
  baseURL: API_BASE_URL,
});

// ตั้งค่าให้ privateApi แนบ Token ไปกับทุก Request โดยอัตโนมัติ
// โดยการดึง Token ที่เก็บไว้ใน localStorage
privateApi.interceptors.request.use(
  (config) => {
    try {
      // 1. ดึง state ทั้งหมดจาก localStorage (Zustand จะเก็บไว้ใน key ที่เราตั้งชื่อ)
      const userStateString = localStorage.getItem("userState"); // ◀️ ตรวจสอบว่า 'userState' คือชื่อที่คุณใช้ใน persist middleware

      if (userStateString) {
        // 2. แปลง JSON string กลับเป็น object
        const userState = JSON.parse(userStateString);
        // 3. ดึง token ออกมาจาก state object
        const token = userState.state?.token;

        if (token) {
          // 4. ถ้ามี Token ให้ใส่ใน Header Authorization
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error(
        "Could not parse user state from localStorage or set token",
        error,
      );
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// --- คุณสามารถเพิ่ม Helper Functions สำหรับเรียก API ที่นี่ได้ในอนาคต ---
// ตัวอย่าง:
// export const loginUser = (credentials) => publicApi.post('/auth/login', credentials);
// export const getMyFavorites = () => privateApi.get('/favorites');

export const searchByCityName = (cityName) => {
  return publicApi.get("/weather", {
    params: {
      city: cityName,
    },
  });
};

export const searchByLagLon = (lat, lon) => {
  return publicApi.get("/weather/by-coords", {
    params: {
      lat: lat,
      lon: lon,
    },
  });
};

export const registerUser = (userData) => {
  return publicApi.post("/auth/register", userData);
};

export const loginUser = (credentials) => {
  return publicApi.post("/auth/login", credentials);
};
