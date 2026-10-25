import axios from "axios";
import { toast } from "react-toastify";
import useUserStore from "../stores/userStore";

// URL หลักของ Backend API ของคุณ
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8555/api";

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
      const userStateString = localStorage.getItem("userState");

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

// ถ้า Token หมดอายุ/ไม่ถูกต้อง (401) ให้ logout อัตโนมัติ แล้วกลับไปหน้า Guest
privateApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useUserStore.getState().logout();
      toast.error("เซสชันหมดอายุ กรุณา Login ใหม่", { toastId: "session-expired" });
    }
    return Promise.reject(error);
  },
);

// Backend อยู่บน Render แผนฟรีซึ่งจะหลับเมื่อไม่มีคนใช้ request แรกอาจรอ 30–60 วินาที
// ถ้ามี request ค้างนานเกิน SLOW_REQUEST_MS ให้บอกผู้ใช้ จะได้ไม่คิดว่าเว็บพัง
const SLOW_REQUEST_MS = 5000;
const WAKE_TOAST_ID = "server-waking";
let pendingRequests = 0;
let wakeTimer = null;

const trackRequestStart = (config) => {
  pendingRequests += 1;
  if (!wakeTimer) {
    wakeTimer = setTimeout(() => {
      toast.info("กำลังปลุกเซิร์ฟเวอร์ (free tier) อาจใช้เวลาสักครู่...", {
        toastId: WAKE_TOAST_ID,
        autoClose: false,
      });
    }, SLOW_REQUEST_MS);
  }
  return config;
};

const trackRequestEnd = () => {
  pendingRequests = Math.max(0, pendingRequests - 1);
  if (pendingRequests === 0) {
    clearTimeout(wakeTimer);
    wakeTimer = null;
    toast.dismiss(WAKE_TOAST_ID);
  }
};

for (const api of [publicApi, privateApi]) {
  api.interceptors.request.use(trackRequestStart);
  api.interceptors.response.use(
    (response) => {
      trackRequestEnd();
      return response;
    },
    (error) => {
      trackRequestEnd();
      return Promise.reject(error);
    },
  );
}

// ดึงข้อความ error จาก response ของ Backend (Backend ส่งมาในรูป { message })
export const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || fallback || err.message;

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
