import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'

import DayThunderstorm from './images/day-thunderstorm.svg?react';
import DayClear from './images/day-clear.svg?react';
import DayCloudyFog from './images/day-cloudy-fog.svg?react';
import DayCloudy from './images/day-cloudy.svg?react';
import DayFog from './images/day-fog.svg?react';
import DayPartiallyClearWithRain from './images/day-partially-clear-with-rain.svg?react';
import DaySnowing from './images/day-snowing.svg?react';
import NightThunderstorm from './images/night-thunderstorm.svg?react';
import NightClear from './images/night-clear.svg?react';
import NightCloudyFog from './images/night-cloudy-fog.svg?react';
import NightCloudy from './images/night-cloudy.svg?react';
import NightFog from './images/night-fog.svg?react';
import NightPartiallyClearWithRain from './images/night-partially-clear-with-rain.svg?react';
import NightSnowing from './images/night-snowing.svg?react';

const IconContainer = styled.div`
    flex-basis: 30%;

    svg {
        max-height: 110px;
    }
`;

const weatherTypes = {
    isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
    isClear: [1],
    isCloudyFog: [25, 26, 27, 28],
    isCloudy: [2, 3, 4, 5, 6, 7],
    isFog: [24],
    isPartiallyClearWithRain: [
      8, 9, 10, 11, 12,
      13, 14, 19, 20, 29, 30,
      31, 32, 38, 39,
    ],
    isSnowing: [23, 37, 42],
}

const weatherIcons = {
    day: {
      isThunderstorm: <DayThunderstorm />,
      isClear: <DayClear />,
      isCloudyFog: <DayCloudyFog />,
      isCloudy: <DayCloudy />,
      isFog: <DayFog />,
      isPartiallyClearWithRain: <DayPartiallyClearWithRain />,
      isSnowing: <DaySnowing />,
    },
    night: {
      isThunderstorm: <NightThunderstorm />,
      isClear: <NightClear />,
      isCloudyFog: <NightCloudyFog />,
      isCloudy: <NightCloudy />,
      isFog: <NightFog />,
      isPartiallyClearWithRain: <NightPartiallyClearWithRain />,
      isSnowing: <NightSnowing />,
    },
  }

const weatherCode2Type = (weatherCode) => {
    const [weatherType] =
        Object.entries(weatherTypes).find(([weatherType, weatherCodes]) =>
            weatherCodes.includes(Number(weatherCode))
        ) || []

    return weatherType
}

const WeatherIcon = ({currentWeatherCode, moment}) => {

    const [currentWeatherIcon, setCurrentWeatherIcon] = useState("isClear")

    const theWeatherIcon = useMemo(() => 
        weatherCode2Type(currentWeatherCode), [currentWeatherCode]
    )

    useEffect(() => {
        setCurrentWeatherIcon(theWeatherIcon);
    }, [theWeatherIcon])

    return (
        <IconContainer>
            {weatherIcons[moment][currentWeatherIcon]}
        </IconContainer>
    );
}

export default WeatherIcon