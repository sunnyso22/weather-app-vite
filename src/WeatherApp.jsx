import React, { useState } from 'react';
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
    const [currentWeather, setCurrentWeather] = useState({
        observationTime: '2019-10-02 22:10:00',
        locationName: '臺北市',
        description: '多雲時晴',
        temperature: 27.5,
        windSpeed: 0.3,
        humid: 0.88,
    })

    const handleClick = () => {
        fetch(
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

            setCurrentWeather({
                observationTime: stationData.ObsTime.DateTime,
                locationName: stationData.StationName,
                description: '多雲時晴',
                temperature: weatherElements.AirTemperature,
                windSpeed: weatherElements.WindSpeed,
                humid: weatherElements.RelativeHumidity,
            });
        });
    };

    return (
        <Container>
            <WeatherCard>
                <Location theme="light">{currentWeather.locationName}</Location>
                <Description>
                    {currentWeather.description}</Description>
                <CurrentWeather>
                    <Temperature>
                    {Math.round(currentWeather.temperature)} <Celsius>°C</Celsius>
                    </Temperature>
                    <Cloudy />
                </CurrentWeather>
                <AirFlow>
                    <AirFlowIcon />
                    {currentWeather.windSpeed} m/h
                </AirFlow>
                <Rain>
                    <RainIcon />
                    {Math.round(currentWeather.humid)} %
                </Rain>
                <Refresh onClick={handleClick}>
                    最後觀測時間：
                    {new Intl.DateTimeFormat('zh-TW', {
                    hour: 'numeric',
                    minute: 'numeric',
                    }).format(new Date(currentWeather.observationTime))}{' '}
                    <RefreshIcon />
                </Refresh>
            </WeatherCard>
        </Container>
    );
};

export default WeatherApp;