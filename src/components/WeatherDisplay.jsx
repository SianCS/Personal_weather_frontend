import { CityTime } from "./CityTime";

export const WeatherDisplay =({ weather, isFavorited, onFavoriteClick }) => {
    if (!weather) return null;
    return (
        <div className="card bg-base-100/50 backdrop-blur-sm shadow-xl w-full">
            <div className="card-body items-center text-center">
                {/* ชื่อเมืองอยู่กลาง ปุ่มหัวใจอยู่ขวา (มีช่องว่างซ้ายเท่าปุ่มเพื่อให้ชื่ออยู่กึ่งกลาง) ชื่อยาวจะขึ้นบรรทัดใหม่แทนการทับปุ่ม */}
                <div className="flex w-full items-start gap-2">
                    <div className="w-10 shrink-0" />
                    <h2 className="card-title text-2xl flex-1 justify-center break-words min-w-0">{weather.city}</h2>
                    <button className="btn btn-primary btn-circle shrink-0" onClick={onFavoriteClick} title={isFavorited ? "ลบออกจากรายการโปรด" : "เพิ่มเป็นรายการโปรด"}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isFavorited ? 'text-red-500' : 'text-gray-400'}`} fill={isFavorited ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    </button>
                </div>
                <CityTime dt={weather.dt} timezone={weather.timezone} className="text-sm opacity-70" />
                <div className="flex items-center my-2">
                    {weather.icon && <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt={weather.description} className="w-20 h-20"/>}
                    <p className="text-6xl font-bold">{Math.round(weather.temperature)}°</p>
                </div>
                <p className="text-xl capitalize">{weather.description}</p>
                <div className="divider my-2"></div>
               <div className="flex justify-around w-full">
                    <div className="text-center"><p className="font-semibold opacity-70">ความชื้น</p><p className="text-lg font-bold">{weather.humidity}%</p></div>
                    <div className="text-center"><p className="font-semibold opacity-70">ความเร็วลม</p><p className="text-lg font-bold">{weather.windSpeed} m/s</p></div>
                    
                    {weather.chanceOfRain > 0 && (
                        <div className="text-center">
                            <p className="font-semibold opacity-70">โอกาสเกิดฝน</p>
                            <p className="text-lg font-bold flex items-center justify-center">
                                <span className="mr-1">💧</span> 
                                {weather.chanceOfRain}%
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};