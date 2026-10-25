import { useEffect, useState } from "react";

// บวก offset ของเมืองแล้วจัดรูปแบบแบบ UTC เพื่อไม่ให้ timezone ของเบราว์เซอร์มาเลื่อนเวลา
const formatCityTime = (ms, timezone) =>
    new Date(ms + timezone * 1000).toLocaleTimeString("th-TH", {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

// เวลาท้องถิ่นใช้นาฬิกาจริง ส่วน dt คือเวลาที่ OpenWeatherMap วัดข้อมูล (อาจมาจาก cache)
export function CityTime({ dt, timezone, className }) {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 30 * 1000);
        return () => clearInterval(id);
    }, []);

    // timezone เป็น 0 ได้ (เช่น London) จึงเช็ค null แทนการเช็ค falsy
    if (dt == null || timezone == null) return null;

    return (
        <div className={className}>
            <p>เวลาท้องถิ่น: {formatCityTime(now, timezone)}</p>
            <p className="text-xs">อัปเดตข้อมูลเมื่อ {formatCityTime(dt * 1000, timezone)}</p>
        </div>
    );
}
