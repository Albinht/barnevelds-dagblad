import { NextRequest, NextResponse } from 'next/server'

// Barneveld coordinates
const BARNEVELD_LAT = 52.1383
const BARNEVELD_LON = 5.5797

// Cache configuration
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes in milliseconds
let cachedData: unknown = null
let cacheTime = 0

// Weather code to Dutch description mapping
const weatherDescriptions: { [key: number]: string } = {
  0: 'Helder',
  1: 'Overwegend helder',
  2: 'Gedeeltelijk bewolkt',
  3: 'Bewolkt',
  45: 'Mistig',
  48: 'Rijp afzetting mist',
  51: 'Lichte motregen',
  53: 'Matige motregen',
  55: 'Dichte motregen',
  56: 'Lichte ijzel',
  57: 'Ijzel',
  61: 'Lichte regen',
  63: 'Matige regen',
  65: 'Zware regen',
  66: 'Lichte ijzel',
  67: 'Zware ijzel',
  71: 'Lichte sneeuw',
  73: 'Matige sneeuw',
  75: 'Zware sneeuw',
  77: 'Sneeuwkorrels',
  80: 'Lichte regenbuien',
  81: 'Matige regenbuien',
  82: 'Zware regenbuien',
  85: 'Lichte sneeuwbuien',
  86: 'Zware sneeuwbuien',
  95: 'Onweer',
  96: 'Onweer met hagel',
  99: 'Zwaar onweer met hagel'
}

// Weather code to emoji mapping
const weatherIcons: { [key: number]: string } = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  55: '🌧️',
  56: '🌨️',
  57: '🌨️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  66: '🌨️',
  67: '🌨️',
  71: '❄️',
  73: '❄️',
  75: '❄️',
  77: '❄️',
  80: '🌦️',
  81: '🌧️',
  82: '⛈️',
  85: '🌨️',
  86: '🌨️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️'
}

// Wind direction from degrees
function getWindDirection(degrees: number): string {
  const directions = ['N', 'NO', 'O', 'ZO', 'Z', 'ZW', 'W', 'NW']
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}

export async function GET(_request: NextRequest) {
  try {
    // Check cache
    const now = Date.now()
    if (cachedData && (now - cacheTime) < CACHE_DURATION) {
      return NextResponse.json(cachedData)
    }

    // Fetch current weather and forecast from Open-Meteo
    const currentWeatherUrl = `https://api.open-meteo.com/v1/forecast?` +
      `latitude=${BARNEVELD_LAT}&longitude=${BARNEVELD_LON}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,` +
      `pressure_msl,wind_speed_10m,wind_direction_10m,uv_index` +
      `&hourly=temperature_2m,precipitation_probability,weather_code` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,` +
      `wind_speed_10m_max,wind_direction_10m_dominant` +
      `&timezone=Europe/Amsterdam` +
      `&forecast_days=7`

    const response = await fetch(currentWeatherUrl)

    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`)
    }

    const data = await response.json()

    // Format current weather
    const currentWeather = {
      temperature: Math.round(data.current.temperature_2m),
      description: weatherDescriptions[data.current.weather_code] || 'Onbekend',
      icon: weatherIcons[data.current.weather_code] || '🌡️',
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDirection: getWindDirection(data.current.wind_direction_10m),
      pressure: Math.round(data.current.pressure_msl),
      feelsLike: Math.round(data.current.apparent_temperature),
      uvIndex: Math.round(data.current.uv_index || 0),
      precipitation: data.current.precipitation
    }

    // Format 5-day forecast
    const forecast = data.daily.time.slice(1, 6).map((date: string, index: number) => ({
      date,
      tempMax: Math.round(data.daily.temperature_2m_max[index + 1]),
      tempMin: Math.round(data.daily.temperature_2m_min[index + 1]),
      description: weatherDescriptions[data.daily.weather_code[index + 1]] || 'Onbekend',
      icon: weatherIcons[data.daily.weather_code[index + 1]] || '🌡️',
      rainChance: data.daily.precipitation_probability_max[index + 1] || 0,
      precipitation: data.daily.precipitation_sum[index + 1] || 0,
      windSpeed: Math.round(data.daily.wind_speed_10m_max[index + 1] || 0),
      windDirection: getWindDirection(data.daily.wind_direction_10m_dominant[index + 1] || 0)
    }))

    // Get hourly forecast starting from current hour for next 24 hours
    const currentHour = new Date().getHours()
    const hourlyForecast = data.hourly.time.slice(currentHour, currentHour + 24).map((time: string, index: number) => ({
      time,
      temperature: Math.round(data.hourly.temperature_2m[currentHour + index]),
      rainChance: data.hourly.precipitation_probability[currentHour + index] || 0,
      icon: weatherIcons[data.hourly.weather_code[currentHour + index]] || '🌡️',
      isCurrentHour: index === 0
    }))

    // Determine if there are any weather warnings
    const warnings = []

    // Check for extreme temperatures
    if (currentWeather.temperature > 30) {
      warnings.push({
        type: 'heat',
        severity: 'medium',
        message: 'Hittewaarschuwing: Drink voldoende water en zoek verkoeling'
      })
    }
    if (currentWeather.temperature < -5) {
      warnings.push({
        type: 'cold',
        severity: 'medium',
        message: 'Koudewaarschuwing: Kleed u warm aan'
      })
    }

    // Check for high wind speeds
    if (currentWeather.windSpeed > 50) {
      warnings.push({
        type: 'wind',
        severity: currentWeather.windSpeed > 75 ? 'high' : 'medium',
        message: `Windwaarschuwing: Windsnelheden tot ${currentWeather.windSpeed} km/u`
      })
    }

    // Check for storm
    const stormCodes = [95, 96, 99]
    if (stormCodes.includes(data.current.weather_code)) {
      warnings.push({
        type: 'storm',
        severity: 'high',
        message: 'Onweerswaarschuwing: Blijf binnen en vermijd open gebieden'
      })
    }

    const responseData = {
      location: 'Barneveld',
      current: currentWeather,
      forecast,
      hourly: hourlyForecast,
      warnings,
      lastUpdated: new Date().toISOString()
    }

    // Update cache
    cachedData = responseData
    cacheTime = now

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Weather API error:', error)

    // Return fallback data if API fails
    return NextResponse.json({
      location: 'Barneveld',
      current: {
        temperature: 12,
        description: 'Bewolkt',
        icon: '☁️',
        humidity: 75,
        windSpeed: 15,
        windDirection: 'ZW',
        pressure: 1013,
        feelsLike: 10,
        uvIndex: 2,
        precipitation: 0
      },
      forecast: [
        { date: new Date().toISOString().split('T')[0], tempMax: 14, tempMin: 8, description: 'Deels bewolkt', icon: '⛅', rainChance: 20, precipitation: 0, windSpeed: 12, windDirection: 'W' },
        { date: new Date(Date.now() + 86400000).toISOString().split('T')[0], tempMax: 12, tempMin: 6, description: 'Regen', icon: '🌧️', rainChance: 80, precipitation: 5, windSpeed: 18, windDirection: 'ZW' },
        { date: new Date(Date.now() + 172800000).toISOString().split('T')[0], tempMax: 10, tempMin: 4, description: 'Bewolkt', icon: '☁️', rainChance: 40, precipitation: 2, windSpeed: 15, windDirection: 'W' },
        { date: new Date(Date.now() + 259200000).toISOString().split('T')[0], tempMax: 11, tempMin: 5, description: 'Zonnig', icon: '☀️', rainChance: 10, precipitation: 0, windSpeed: 10, windDirection: 'NO' },
        { date: new Date(Date.now() + 345600000).toISOString().split('T')[0], tempMax: 13, tempMin: 7, description: 'Deels bewolkt', icon: '⛅', rainChance: 30, precipitation: 1, windSpeed: 14, windDirection: 'O' }
      ],
      hourly: [],
      warnings: [],
      lastUpdated: new Date().toISOString(),
      error: 'Using fallback data due to API error'
    })
  }
}