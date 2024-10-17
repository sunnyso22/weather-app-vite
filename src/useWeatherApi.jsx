import { useState, useEffect, useCallback } from 'react';

const fetchCurrentWeather = (stationName) => {
    return fetch(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWA-4A0FAECA-F06E-4219-9093-4F4A90A2395B&StationName=${stationName}`)
    .then((response) => response.json())
    .then((data) => {
        const stationData = data.records.Station[0];
        
        const weatherElements = {
            AirTemperature: stationData.WeatherElement.AirTemperature,
            WindSpeed: stationData.WeatherElement.WindSpeed,
            RelativeHumidity: stationData.WeatherElement.RelativeHumidity,
        }

        return{
            observationTime: stationData.ObsTime.DateTime,
            locationName: stationData.GeoInfo.CountyName,
            temperature: weatherElements.AirTemperature,
            windSpeed: weatherElements.WindSpeed,
            humid: weatherElements.RelativeHumidity,
        }
    })
}

const fetchWeatherForecast = (countyName) => {
    return fetch(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-4A0FAECA-F06E-4219-9093-4F4A90A2395B&locationName=${countyName}`)
    .then((response) => response.json())
    .then((data) => {
        const locationData = data.records.location[0]

        const weatherElements = locationData.weatherElement.reduce(
            (neededElements, item) => {
                if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
                    neededElements[item.elementName] = item.time[0].parameter;
                }
            return neededElements;
            }, {}
        )

        return {
            description: weatherElements.Wx.parameterName,
            weatherCode: weatherElements.Wx.parameterValue,
            rainPossibility: weatherElements.PoP.parameterName,
            comfortability: weatherElements.CI.parameterName,
        }
    })
}

const getMoment = (countyName, nowTimestamp) => {
    const now = new Date()
    const nowDate = Intl.DateTimeFormat('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
    .format(now)
    .replace(/\//g, '-')

    return fetch(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=CWA-4A0FAECA-F06E-4219-9093-4F4A90A2395B&CountyName=${countyName}&Date=${nowDate}&parameter=SunRiseTime,SunSetTime`)
    .then((response) => response.json())
    .then((data) => {
        const sunriseAndSunsetData = data.records.locations.location[0]

        const sunriseTimestamp = new Date(`${sunriseAndSunsetData.time[0].Date} ${sunriseAndSunsetData.time[0].SunRiseTime}`).getTime()
        const sunsetTimestamp = new Date(`${sunriseAndSunsetData.time[0].Date} ${sunriseAndSunsetData.time[0].SunSetTime}`).getTime()

        return sunriseTimestamp <= nowTimestamp && nowTimestamp <= sunsetTimestamp ? 
        {moment: "day"} : {moment : "night"}
    })
}

const useWeatherApi = (currentLocation) => {
    const { stationName, countyName } = currentLocation

    const [weatherElements, setWeatherElements] = useState({
        observationTime: new Date(),
        locationName: '',
        humid: 0,
        temperature: 0,
        windSpeed: 0,
        description: '',
        weatherCode: 0,
        rainPossibility: 0,
        comfortability: '',
        moment: '',
        isLoading: true,
    })

    const fetchData = useCallback(() => {
        const fetchingData = async () => {
            const [currentWeather, weatherForecast, moment] = await Promise.all([
                fetchCurrentWeather(stationName),
                fetchWeatherForecast(countyName),
                getMoment(countyName, Date.now())
            ])

            setWeatherElements({
                ...currentWeather,
                ...weatherForecast,
                ...moment,
                isLoading: false,
            })
        }

        setWeatherElements((prevState) => (
            {
                ...prevState,
                isLoading: true,
            }
        ))

        fetchingData()
    }, [stationName, countyName])

    useEffect(() => {
        console.log('execute function in useEffect');
        fetchData()
    }, [fetchData])

    return [weatherElements, fetchData]
}

export default useWeatherApi