import { useCallback, useEffect, useState } from "react";
import LoadingUi from "../components/LoadingUi";
import ErrorUi from "../components/ErrorUi";
import { CityTime } from "../components/CityTime";
import Login from "./Login";
import Register from "./Register";
import { AddFavoriteIcon, LocationIcon, SearchIcon } from "../icons";
import { getErrorMessage, searchByCityName, searchByLagLon } from "../api";

function GuestPage() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cityInput, setCityInput] = useState("");

  // ฟังก์ชันสำหรับดึงข้อมูลอากาศ (ใช้เป็น wrapper)
  const fetchWeather = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiCall(); // เรียกใช้ฟังก์ชัน API ที่ส่งเข้ามา
      setWeather(res.data);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      fetchWeather(() => searchByCityName(cityInput.trim()));
    }
  };

  // ฟังก์ชันสำหรับแจ้งเตือนและนำทางไปหน้า Login
  const handleAuthRedirect = () => {
    document.getElementById("my_modal_2").showModal();
  };

  // ฟังก์ชันสำหรับกดปุ่มตำแหน่งปัจจุบัน
  const handleGetCurrentLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(() =>
          searchByLagLon(position.coords.latitude, position.coords.longitude),
        );
      },
      () => {
        // หากเข้าถึงตำแหน่งไม่ได้ ให้แสดงข้อผิดพลาด หรือใช้ค่าเริ่มต้น
        setError(
          "ไม่สามารถเข้าถึงตำแหน่งปัจจุบันได้ กำลังแสดงข้อมูลของกรุงเทพฯ",
        );
        fetchWeather(() => searchByCityName("Bangkok"));
      },
    );
  }, [fetchWeather]);

  useEffect(() => {
    // โหลดข้อมูลจากตำแหน่งปัจจุบันเมื่อเปิดหน้าครั้งแรก
    handleGetCurrentLocation();
  }, [handleGetCurrentLocation]);

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1499346030926-9a72daac6c63?q=80&w=2070&auto=format&fit=crop')",
      }}
    >
      <div className="min-h-screen w-full bg-black/10 backdrop-blur-sm ...">
        <div className="flex justify-end items-center gap-3 p-4">
          <button
            className="btn btn-primary"
            onClick={() => document.getElementById("my_modal_2").showModal()}
          >
            Login
          </button>
          <button
            className="btn btn-primary"
            onClick={() => document.getElementById("my_modal_3").showModal()}
          >
            Register
          </button>
        </div>

        <p className="px-4 pt-4 text-center">
          ถ้าต้องการ ฟีเจอร์อื่นๆ เช่น ดูแผนที่ พยากรณ์ 5 วันข้างหน้า หรือ
          เพิ่มรายการโปรด กรุณา Login{" "}
        </p>

        <div className="container mx-auto p-4 flex justify-center pt-8 md:pt-24">
          <div className="w-full max-w-md flex flex-col gap-6 ">
            <dialog id="my_modal_2" className="modal">
              <div className="modal-box relative">
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  onClick={() => document.getElementById("my_modal_2").close()}
                >
                  ✕
                </button>
                <h3 className="font-bold text-lg text-center">Hello!</h3>
                <p className="py-4 text-center">
                  ถ้าต้องการ ฟีเจอร์อื่นๆ เช่น ดูแผนที่ พยากรณ์ 5 วันข้างหน้า
                  หรือ เพิ่มรายการโปรด กรุณา Login{" "}
                </p>
                <Login />
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>

            <div className="flex items-center gap-3 justify-center w-full">
              <form
                onSubmit={handleSearch}
                className="relative flex items-center flex-1 min-w-0 max-w-96"
              >
                <input
                  type="text"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  placeholder="ค้นหาชื่อเมือง..."
                  className="w-full px-5 py-3 pl-12 text-lg rounded-full shadow-lg border-2 bg-white/50"
                />
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
                  title="ใช้ตำแหน่งปัจจุบัน"
                >
                  <LocationIcon />
                </button>
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
                  title="ค้นหา"
                >
                  <SearchIcon />
                </button>
              </form>

              <button
                className="group transition flex-shrink-0"
                onClick={handleAuthRedirect}
                title="เพิ่มรายการโปรด"
              >
                <AddFavoriteIcon className="w-10 group-hover:fill-red-600 transition" />
              </button>
            </div>

            <dialog id="my_modal_3" className="modal">
              <div className="modal-box relative">
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  onClick={() => document.getElementById("my_modal_3").close()}
                >
                  ✕
                </button>
                <h3 className="font-bold text-lg text-center">
                  สร้างบัญชีใหม่
                </h3>
                <Register />
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>

            <div className="flex-grow flex items-center justify-center min-h-[20rem]">
              {loading && <LoadingUi />}
              {error && <ErrorUi message={error} />}
              {weather && (
                <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full text-center">
                  <p className="text-2xl font-medium">{weather.city}</p>

                  <CityTime
                    dt={weather.dt}
                    timezone={weather.timezone}
                    className="text-sm text-gray-700 mt-1"
                  />

                  <div className="flex items-center justify-center my-2">
                    {weather.icon && (
                      <img
                        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                        alt={weather.description}
                        className="w-24 h-24"
                      />
                    )}
                    <p className="text-6xl font-bold">
                      {Math.round(weather.temperature)}°
                    </p>
                  </div>
                  <p className="text-xl capitalize">{weather.description}</p>

                  <div className="flex justify-around w-full mt-4 pt-4 border-t border-gray-300/50">
                    <div className="text-center">
                      <p className="font-semibold text-gray-600">ความชื้น</p>
                      <p className="text-lg font-bold">{weather.humidity}%</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-600">ความเร็วลม</p>
                      <p className="text-lg font-bold">
                        {weather.windSpeed} m/s
                      </p>
                    </div>

                    {weather.chanceOfRain !== undefined && (
                      <div className="text-center">
                        <p className="font-semibold text-gray-600">
                          โอกาสเกิดฝน
                        </p>
                        <p className="text-lg font-bold">
                          💧 {weather.chanceOfRain}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestPage;
