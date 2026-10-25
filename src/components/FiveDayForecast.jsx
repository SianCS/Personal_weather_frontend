import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { privateApi } from "../api";
import LoadingUi from "./LoadingUi";

const hourOf = (slot) => Number(slot.localTime.slice(11, 13));

// รวมข้อมูลรายสามชั่วโมงเป็นรายวัน (ตามเวลาท้องถิ่นของเมือง)
function toDailyForecasts(slots) {
    const days = {};
    for (const slot of slots) {
        const date = slot.localTime.slice(0, 10);
        (days[date] ??= []).push(slot);
    }

    return Object.entries(days).map(([date, daySlots]) => {
        // ใช้ไอคอน/คำอธิบายของช่วงที่ใกล้เที่ยงที่สุดเป็นตัวแทนของวัน
        const midday = daySlots.reduce((best, s) =>
            Math.abs(hourOf(s) - 12) < Math.abs(hourOf(best) - 12) ? s : best
        );
        const temps = daySlots.map((s) => s.temperature);
        return {
            date,
            icon: midday.icon,
            description: midday.description,
            maxTemp: Math.max(...temps),
            minTemp: Math.min(...temps),
            chanceOfRain: Math.max(...daySlots.map((s) => s.chanceOfRain)),
        };
    });
}

// date เป็นวันที่ของเมืองอยู่แล้ว จึงแสดงผลแบบ UTC เพื่อไม่ให้ timezone ของเบราว์เซอร์มาเลื่อนวัน
const weekdayOf = (date) =>
    new Date(`${date}T00:00:00Z`).toLocaleDateString("th-TH", { weekday: "short", timeZone: "UTC" });

export function FiveDayForecast({ cityId }) {
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!cityId) return;
        setLoading(true);
        privateApi.get(`/weather/${cityId}/forecast`)
            .then(res => setForecast(toDailyForecasts(res.data.forecasts)))
            .catch(() => toast.error("ไม่สามารถโหลดข้อมูลพยากรณ์ 5 วันได้"))
            .finally(() => setLoading(false));
    }, [cityId]);

    if (!cityId) return null;
    if (loading) return <div className="card bg-base-100/50 backdrop-blur-sm shadow-xl w-full min-h-[10rem] flex justify-center items-center"><LoadingUi text="โหลดพยากรณ์..."/></div>;

    return (
        <div className="card bg-base-100/50 backdrop-blur-sm shadow-xl w-full">
            <div className="card-body">
                <h2 className="card-title flex justify-center">พยากรณ์ 5 วันข้างหน้า</h2>
                <p className="text-xs opacity-70">(ข้อมูลอัพเดตทุก 3 ชม)</p>
                <div className="flex justify-between overflow-x-auto">
                    {forecast.slice(0, 5).map(day => (
                        <div key={day.date} className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-white/50 transition flex-shrink-0 w-24">
                            <p className="font-semibold text-sm">{weekdayOf(day.date)}</p>
                            <img src={day.icon} alt={day.description} className="w-14 h-14"/>
                            <p className="font-bold text-xl">{Math.round(day.maxTemp)}°</p>

                            <p className="text-xs text-gray-600">ต่ำสุด {Math.round(day.minTemp)}°</p>
                            <p className="text-xs capitalize text-blue-800 mt-1 h-8 truncate" title={day.description}>{day.description}</p>

                            {day.chanceOfRain > 0 && (
                                <div className="flex items-center text-xs text-blue-600 font-semibold mt-1">
                                    <span>💧 {day.chanceOfRain}%</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
