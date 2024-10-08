import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import CloudyIcon from './images/day-cloudy.svg?react';
import RainIcon from './images/rain.svg?react';
import AirFlowIcon from './images/airflow.svg?react';
import RefreshIcon from './images/refresh.svg?react';

const Container = styled.div`
    background-color: #ededed;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const WeatherCard = styled.div`
    position: relative;
    min-width: 360px;
    box-shadow: 0 1px 3px 0 #999999;
    background-color: #f9f9f9;
    box-sizing: border-box;
    padding: 30px 15px;
`;

const Location = styled.div`
    font-size: 28px;
    color: ${props => props.theme === 'dark' ? '#dadada' : '#212121'};
    margin-bottom: 20px;
`;

const Description = styled.div`
    font-size: 16px;
    color: #828282;
    margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
`;

const Temperature = styled.div`
    color: #757575;
    font-size: 96px;
    font-weight: 300;
    display: flex;
`;

const Celsius = styled.div`
    font-weight: normal;
    font-size: 42px;
`;

const AirFlow = styled.div`
    display: flex;
    align-items: center;
    font-size: 16x;
    font-weight: 300;
    color: #828282;
    margin-bottom: 20px;

    svg {
        width: 25px;
        height: auto;
        margin-right: 30px;
    }
`;

const Rain = styled.div`
    display: flex;
    align-items: center;
    font-size: 16x;
    font-weight: 300;
    color: #828282;

    svg {
        width: 25px;
        height: auto;
        margin-right: 30px;
    }
`;

const Cloudy = styled(CloudyIcon)`
    flex-basis: 30%;
`;

const Refresh = styled.div`
    position: absolute;
    right: 15px;
    bottom: 15px;
    font-size: 12px;
    display: inline-flex;
    align-items: flex-end;
    color: #828282;

    svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    }
`;

const WeatherApp = () => {
    //console.log('--- invoke function component ---');

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
    })

    useEffect(() => {
        //console.log('execute function in useEffect');
        const fetchData = async () => {
            const [currentWeather, weatherForecast] = await Promise.all([
                fetchCurrentWeather(),
                fetchWeatherForecast(),
            ])

            setWeatherElements({
                ...currentWeather,
                ...weatherForecast,
            })
        }

        fetchData()
    }, [])

    const fetchCurrentWeather = () => {
        return fetch(
        'https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWA-4A0FAECA-F06E-4219-9093-4F4A90A2395B&StationName=臺北'
        )
        .then((response) => response.json())
        .then((data) => {
            const stationData = data.records.Station[0];
            
            const weatherElements = {
                "AirTemperature": stationData.WeatherElement.AirTemperature,
                "WindSpeed": stationData.WeatherElement.WindSpeed,
                "RelativeHumidity" : stationData.WeatherElement.RelativeHumidity,
            }

            return{
                observationTime: stationData.ObsTime.DateTime,
                locationName: stationData.StationName,
                temperature: weatherElements.AirTemperature,
                windSpeed: weatherElements.WindSpeed,
                humid: weatherElements.RelativeHumidity,
            }
        })
    }

    const fetchWeatherForecast = () => {
        return fetch(
            'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-4A0FAECA-F06E-4219-9093-4F4A90A2395B&locationName=臺北市'
        )
        .then((response) => response.json())
        .then((data) => {
            const locationData = data.records.location[0];
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

    return (
        <Container>
            {/* {console.log('render')} */}
            <WeatherCard>
                <Location theme="light">{weatherElements.locationName}</Location>
                <Description>
                    {weatherElements.description} {weatherElements.comfortability}</Description>
                <CurrentWeather>
                    <Temperature>
                    {Math.round(weatherElements.temperature)} <Celsius>°C</Celsius>
                    </Temperature>
                    <Cloudy />
                </CurrentWeather>
                <AirFlow>
                    <AirFlowIcon />
                    {weatherElements.windSpeed} m/h
                </AirFlow>
                <Rain>
                    <RainIcon />
                    {Math.round(weatherElements.rainPossibility)} %
                </Rain>
                <Refresh 
                    onClick={() => {
                        fetchCurrentWeather()
                        fetchWeatherForecast()
                    }}
                >
                    最後觀測時間：
                    {new Intl.DateTimeFormat('zh-TW', {
                    hour: 'numeric',
                    minute: 'numeric',
                    }).format(new Date(weatherElements.observationTime))}{' '}
                    <RefreshIcon />
                </Refresh>
            </WeatherCard>
        </Container>
    )
}

export default WeatherApp;