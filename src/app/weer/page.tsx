'use client'

import { useState, useEffect } from 'react'

interface WeatherData {
  temperature: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
  windDirection: string
  pressure: number
  feelsLike: number
  uvIndex: number
  precipitation: number
}

interface ForecastDay {
  date: string
  tempMax: number
  tempMin: number
  description: string
  icon: string
  rainChance: number
  precipitation: number
  windSpeed: number
  windDirection: string
}

interface HourlyForecast {
  time: string
  temperature: number
  rainChance: number
  icon: string
}

interface WeatherWarning {
  type: string
  severity: string
  message: string
}

interface TrafficInfo {
  id: string
  type: string
  location: string
  description: string
  severity: string
  startDate?: string
  endDate?: string
}

export default function WeerPage() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([])
  const [warnings, setWarnings] = useState<WeatherWarning[]>([])
  const [trafficInfo, setTrafficInfo] = useState<TrafficInfo[]>([])
  const [activeTab, setActiveTab] = useState<'weer' | 'verkeer'>('weer')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch weather data from API
  useEffect(() => {
    fetchWeatherData()
    fetchTrafficData()

    // Refresh weather data every 10 minutes
    const weatherInterval = setInterval(fetchWeatherData, 10 * 60 * 1000)
    // Refresh traffic data every 5 minutes
    const trafficInterval = setInterval(fetchTrafficData, 5 * 60 * 1000)

    return () => {
      clearInterval(weatherInterval)
      clearInterval(trafficInterval)
    }
  }, [])

  const fetchWeatherData = async () => {
    try {
      const response = await fetch('/api/weather')
      if (!response.ok) throw new Error('Failed to fetch weather data')

      const data = await response.json()

      setCurrentWeather(data.current)
      setForecast(data.forecast || [])
      setHourlyForecast(data.hourly || [])
      setWarnings(data.warnings || [])
      setLoading(false)
      setError(null)
    } catch (err) {
      console.error('Error fetching weather:', err)
      setError('Kon weergegevens niet laden')
      setLoading(false)

      // Set fallback data
      setCurrentWeather({
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
      })
    }
  }

  const fetchTrafficData = async () => {
    try {
      const response = await fetch('/api/traffic')
      if (!response.ok) throw new Error('Failed to fetch traffic data')

      const data = await response.json()
      setTrafficInfo(data.data || [])
    } catch (err) {
      console.error('Error fetching traffic:', err)
      setTrafficInfo([])
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const formatTime = (timeString: string, isCurrentHour: boolean = false) => {
    if (isCurrentHour) {
      return 'Nu'
    }
    const date = new Date(timeString)
    return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
  }

  const _getWindDirection = (direction: string) => {
    const directions: { [key: string]: string } = {
      'N': 'Noord',
      'NO': 'Noordoost',
      'O': 'Oost',
      'ZO': 'Zuidoost',
      'Z': 'Zuid',
      'ZW': 'Zuidwest',
      'W': 'West',
      'NW': 'Noordwest'
    }
    return directions[direction] || direction
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTrafficIcon = (type: string) => {
    switch (type) {
      case 'wegwerkzaamheden': return '🚧'
      case 'ongeval': return '🚨'
      case 'file': return '🚗'
      case 'waarschuwing': return '⚠️'
      case 'weather': return '🌦️'
      default: return '📍'
    }
  }

  const getWarningColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800'
      case 'medium': return 'bg-orange-50 border-orange-200 text-orange-800'
      default: return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    }
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-4 lg:py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 text-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">Weer & Verkeer</h1>
        <p className="text-base lg:text-xl text-gray-600 max-w-3xl mx-auto">
          Actuele weersinformatie en verkeerssituatie voor Barneveld en omgeving
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
          <button
            onClick={() => setActiveTab('weer')}
            className={`px-6 py-3 rounded-md font-semibold transition-colors ${
              activeTab === 'weer'
                ? 'bg-brand-blue text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              Weer
            </span>
          </button>
          <button
            onClick={() => setActiveTab('verkeer')}
            className={`px-6 py-3 rounded-md font-semibold transition-colors ${
              activeTab === 'verkeer'
                ? 'bg-brand-blue text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Verkeer
            </span>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
          <p className="mt-4 text-gray-600">Gegevens laden...</p>
        </div>
      )}

      {/* Weather Tab */}
      {activeTab === 'weer' && currentWeather && !loading && (
        <div className="space-y-8">
          {/* Current Weather */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg text-white p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Barneveld</h2>
                <p className="text-blue-100">{new Date().toLocaleDateString('nl-NL', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</p>
              </div>
              <div className="text-right">
                <div className="text-6xl mb-2">{currentWeather.icon}</div>
                <p className="text-lg">{currentWeather.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="text-6xl font-bold mb-2">{currentWeather.temperature}°C</div>
                <p className="text-blue-100">Voelt als {currentWeather.feelsLike}°C</p>
                {currentWeather.precipitation > 0 && (
                  <p className="text-blue-100 mt-2">Neerslag: {currentWeather.precipitation} mm</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-100 mb-1">Wind</p>
                  <p className="font-semibold">{currentWeather.windSpeed} km/u {currentWeather.windDirection}</p>
                </div>
                <div>
                  <p className="text-blue-100 mb-1">Luchtvochtigheid</p>
                  <p className="font-semibold">{currentWeather.humidity}%</p>
                </div>
                <div>
                  <p className="text-blue-100 mb-1">Luchtdruk</p>
                  <p className="font-semibold">{currentWeather.pressure} hPa</p>
                </div>
                <div>
                  <p className="text-blue-100 mb-1">UV-index</p>
                  <p className="font-semibold">{currentWeather.uvIndex}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Warnings */}
          {warnings.length > 0 && (
            <div className="space-y-3">
              {warnings.map((warning, index) => (
                <div key={index} className={`border rounded-lg p-4 ${getWarningColor(warning.severity)}`}>
                  <div className="flex items-start">
                    <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="font-semibold capitalize">{warning.type} waarschuwing</h3>
                      <p className="text-sm mt-1">{warning.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hourly Forecast (next 12 hours) */}
          {hourlyForecast.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Per uur</h2>
              <div className="bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
                <div className="flex space-x-4 min-w-max">
                  {hourlyForecast.slice(0, 12).map((hour: { time: string; temperature: number; rainChance: number; icon: string; isCurrentHour?: boolean }, index) => (
                    <div key={index} className={`text-center min-w-[80px] ${hour.isCurrentHour ? 'bg-blue-50 rounded-lg p-2' : ''}`}>
                      <p className={`text-xs mb-1 ${hour.isCurrentHour ? 'text-blue-700 font-semibold' : 'text-gray-600'}`}>
                        {formatTime(hour.time, hour.isCurrentHour)}
                      </p>
                      <div className="text-2xl mb-1">{hour.icon}</div>
                      <p className="font-bold text-sm">{hour.temperature}°</p>
                      {hour.rainChance > 0 && (
                        <p className="text-xs text-blue-600 mt-1">{hour.rainChance}%</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5-Day Forecast */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">5-daagse voorspelling</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {forecast.map((day, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 text-center">
                  <p className="font-semibold text-gray-900 mb-2">{formatDate(day.date)}</p>
                  <div className="text-4xl mb-2">{day.icon}</div>
                  <p className="text-sm text-gray-600 mb-2">{day.description}</p>
                  <div className="flex justify-center items-center space-x-2 text-sm">
                    <span className="font-bold">{day.tempMax}°</span>
                    <span className="text-gray-500">{day.tempMin}°</span>
                  </div>
                  {day.rainChance > 0 && (
                    <div className="flex items-center justify-center mt-2 text-xs text-blue-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      {day.rainChance}%
                    </div>
                  )}
                  {day.precipitation > 0 && (
                    <p className="text-xs text-gray-500 mt-1">{day.precipitation} mm</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Traffic Tab */}
      {activeTab === 'verkeer' && (
        <div className="space-y-8">
          {/* Traffic Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Actuele verkeersinformatie</h2>

            {trafficInfo.length > 0 ? (
              <div className="space-y-4">
                {trafficInfo.map((info) => (
                  <div key={info.id} className={`border rounded-lg p-4 ${getSeverityColor(info.severity)}`}>
                    <div className="flex items-start">
                      <span className="text-2xl mr-3 flex-shrink-0">{getTrafficIcon(info.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{info.location}</h3>
                            <p className="text-sm mb-2">{info.description}</p>
                            {info.startDate && info.endDate && (
                              <p className="text-xs opacity-75">
                                Van {formatDate(info.startDate)} tot {formatDate(info.endDate)}
                              </p>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            info.severity === 'high' ? 'bg-red-600 text-white' :
                            info.severity === 'medium' ? 'bg-orange-600 text-white' :
                            'bg-yellow-600 text-white'
                          }`}>
                            {info.severity === 'high' ? 'Ernstig' :
                             info.severity === 'medium' ? 'Matig' : 'Licht'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen verkeersmeldingen</h3>
                <p className="text-gray-600">Er zijn momenteel geen verkeersmeldingen voor Barneveld en omgeving.</p>
              </div>
            )}
          </div>

          {/* Important Roads */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Belangrijke wegen</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Snelwegen</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• A1 (Amsterdam - Apeldoorn)</li>
                  <li>• A30 (Ede - Barneveld)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Provinciale wegen</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• N303 (Voorthuizen - Putten)</li>
                  <li>• N344 (Barneveld - Nijkerk)</li>
                  <li>• N800 (Barneveld - Leusden)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Belangrijke kruispunten</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Knooppunt Hoevelaken</li>
                  <li>• Afrit 16 Barneveld</li>
                  <li>• Kruising N303/N344</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* External Links */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Meer informatie</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <a href="https://www.buienradar.nl/weer/barneveld/nl/2759016" target="_blank" rel="noopener noreferrer"
             className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex items-center">
            <svg className="w-8 h-8 text-brand-blue mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <div>
              <p className="font-semibold text-gray-900">Buienradar</p>
              <p className="text-sm text-gray-600">Gedetailleerde weersvoorspelling</p>
            </div>
          </a>

          <a href="https://www.anwb.nl/verkeer" target="_blank" rel="noopener noreferrer"
             className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex items-center">
            <svg className="w-8 h-8 text-brand-blue mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-gray-900">ANWB Verkeer</p>
              <p className="text-sm text-gray-600">Actuele verkeersinformatie</p>
            </div>
          </a>

          <a href="https://www.rijkswaterstaat.nl/verkeer" target="_blank" rel="noopener noreferrer"
             className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex items-center">
            <svg className="w-8 h-8 text-brand-blue mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <div>
              <p className="font-semibold text-gray-900">Rijkswaterstaat</p>
              <p className="text-sm text-gray-600">Wegwerkzaamheden</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}