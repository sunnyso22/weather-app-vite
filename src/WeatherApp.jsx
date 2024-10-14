import React, { useState, useEffect, useCallback } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import WeatherCard from './WeatherCard';
import useWeatherApi from './useWeatherApi';

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

    const [weatherElements, fetchData] = useWeatherApi();
    const [currentTheme, setCurrentTheme] = useState('light');

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