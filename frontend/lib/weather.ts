const VENUE_COORDS: Record<string, { lat: number; lng: number }> = {
  babymonster: { lat: 13.8956, lng: 100.5461 },
  xg:          { lat: 13.8956, lng: 100.5461 },
  postmalone:  { lat: 13.7561, lng: 100.6308 },
  theweeknd:   { lat: 13.7561, lng: 100.6308 },
};

const WMO: Record<number, [string, string]> = {
  0:  ["ท้องฟ้าแจ่มใส",     "fa-sun"],
  1:  ["เมฆบางส่วน",        "fa-cloud-sun"],
  2:  ["มีเมฆบ้าง",         "fa-cloud-sun"],
  3:  ["เมฆมาก",            "fa-cloud"],
  45: ["หมอก",              "fa-smog"],
  48: ["หมอก",              "fa-smog"],
  51: ["ฝนปรอยเบา",        "fa-cloud-drizzle"],
  53: ["ฝนปรอย",           "fa-cloud-drizzle"],
  55: ["ฝนปรอยหนัก",       "fa-cloud-drizzle"],
  61: ["ฝนตกเบา",          "fa-cloud-rain"],
  63: ["ฝนตก",             "fa-cloud-rain"],
  65: ["ฝนตกหนัก",         "fa-cloud-showers-heavy"],
  80: ["ฝนกระโชก",         "fa-cloud-showers-heavy"],
  81: ["ฝนกระโชก",         "fa-cloud-showers-heavy"],
  82: ["ฝนกระโชกหนัก",     "fa-cloud-showers-heavy"],
  95: ["พายุฟ้าคะนอง",      "fa-bolt"],
  96: ["พายุ + ลูกเห็บ",    "fa-bolt"],
  99: ["พายุรุนแรง",        "fa-bolt"],
};

function resolveWMO(code: number): [string, string] {
  return WMO[code] ?? WMO[Math.floor(code / 10) * 10] ?? ["ไม่ทราบสภาพอากาศ", "fa-cloud"];
}

export interface WeatherDay {
  tempMax: number;
  tempMin: number;
  precipProb: number;
  desc: string;
  icon: string;
}

export async function fetchConcertWeather(
  concertId: string,
  dateStr: string
): Promise<WeatherDay | null> {
  const coords = VENUE_COORDS[concertId];
  if (!coords) return null;

  const targetDate = dateStr.slice(0, 10);
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${coords.lat}&longitude=${coords.lng}` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode` +
    `&timezone=Asia%2FBangkok&forecast_days=16`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const idx: number = (data.daily.time as string[]).indexOf(targetDate);
    if (idx === -1) return null;

    const code: number = data.daily.weathercode[idx];
    const [desc, icon] = resolveWMO(code);

    return {
      tempMax: Math.round(data.daily.temperature_2m_max[idx]),
      tempMin: Math.round(data.daily.temperature_2m_min[idx]),
      precipProb: data.daily.precipitation_probability_max[idx] ?? 0,
      desc,
      icon,
    };
  } catch {
    return null;
  }
}
