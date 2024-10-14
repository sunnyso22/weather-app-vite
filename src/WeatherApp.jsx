import React, { useState, useEffect, useCallback } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import WeatherCard from './WeatherCard';

const theme = {
    light: {
        backgroundColor: '#ededed',
        foregroundColor: '#f9f9f9',
        boxShadow: '0 1px 3px 0 #999999',
        titleColor: '#212121',
        temperatureColor: '#757575',
        textColor: '#828282',
    },
    dark: {
        backgroundColor: '#1F2022',
        foregroundColor: '#121416',
        boxShadow:
        '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
        titleColor: '#f9f9fa',
        temperatureColor: '#dddddd',
        textColor: '#cccccc',
    },
};

const Container = styled.div`
    background-color: ${({ theme }) => theme.backgroundColor};
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const fetchCurrentWeather = () => {
    return fetch('https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWA-4A0FAECA-F06E-4219-9093-4F4A90A2395B&StationName=臺北')
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

const fetchWeatherForecast = () => {
    return fetch('https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-4A0FAECA-F06E-4219-9093-4F4A90A2395B&locationName=臺北市')
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

const getMoment = (locationName, nowTimestamp) => {
    const now = new Date()
    const nowDate = Intl.DateTimeFormat('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
    .format(now)
    .replace(/\//g, '-')

    return fetch("https://opendata.cwa.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=CWA-4A0FAECA-F06E-4219-9093-4F4A90A2395B&CountyName="+locationName+"&Date="+nowDate+"&parameter=SunRiseTime,SunSetTime")
    .then((response) => response.json())
    .then((data) => {
        const sunriseAndSunsetData = data.records.locations.location[0]

        const sunriseTimestamp = new Date(`${sunriseAndSunsetData.time[0].Date} ${sunriseAndSunsetData.time[0].SunRiseTime}`).getTime()
        const sunsetTimestamp = new Date(`${sunriseAndSunsetData.time[0].Date} ${sunriseAndSunsetData.time[0].SunSetTime}`).getTime()

        return sunriseTimestamp <= nowTimestamp && nowTimestamp <= sunsetTimestamp ? 
        {moment: "day"} : {moment : "night"}
    })
}

const WeatherApp = () => {
    console.log('--- invoke function component ---');

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

    const [currentTheme, setCurrentTheme] = useState('light');

    const fetchData = useCallback(() => {
        const fetchingData = async () => {
            const [currentWeather, weatherForecast, moment] = await Promise.all([
                fetchCurrentWeather(),
                fetchWeatherForecast(),
                getMoment(weatherElements.locationName, Date.now())
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
    }, [])

    useEffect(() => {
        console.log('execute function in useEffect');
        fetchData()
    }, [fetchData])

    useEffect(() => {
        setCurrentTheme(weatherElements.moment === 'day' ? 'light' : 'dark');
    }, [weatherElements.moment]);
    
    return (
        <ThemeProvider theme={theme[currentTheme]}>
            <Container>
                {console.log('render, isLoading: ', weatherElements.isLoading)}
                <WeatherCard 
                    weatherElements={weatherElements}
                    fetchData={fetchData}
                />
            </Container>
        </ThemeProvider>
    )
}

export default WeatherApp;