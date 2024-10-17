import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import WeatherCard from './WeatherCard';
import useWeatherApi from './useWeatherApi';
import WeatherSetting from './WeatherSetting';
import { findLocation } from './utils';

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

const WeatherApp = () => {
    console.log('--- invoke function component ---');
    
    const [currentTheme, setCurrentTheme] = useState('light');
    const [currentPage, setCurrentPage] = useState('WeatherCard');

    const storageCounty = localStorage.getItem('countyName');

    const [currentCounty, setCurrentCounty] = useState(storageCounty || '臺北市');
    const currentLocation = findLocation(currentCounty) || {}

    const [weatherElements, fetchData] = useWeatherApi(currentLocation);

    useEffect(() => {
        setCurrentTheme(weatherElements.moment === 'day' ? 'light' : 'dark');
    }, [weatherElements.moment]);
    
    useEffect(() => {
        localStorage.setItem('countyName', currentCounty);
    }, [currentCounty]);

    return (
        <ThemeProvider theme={theme[currentTheme]}>
            <Container>
                {console.log('render, isLoading: ', weatherElements.isLoading)}
                {currentPage === "WeatherCard" && (
                    <WeatherCard
                        countyName={currentLocation.countyName}
                        weatherElements={weatherElements}
                        fetchData={fetchData}
                        setCurrentPage={setCurrentPage}
                    />
                )}

                {currentPage === "WeatherSetting" && (
                    <WeatherSetting 
                        countyName={currentLocation.countyName}
                        setCurrentCounty={setCurrentCounty}
                        setCurrentPage={setCurrentPage}
                    />
                )}
            </Container>
        </ThemeProvider>
    )
}

export default WeatherApp;