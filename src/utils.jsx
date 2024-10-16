export const availableLocations= [
    {
        countyName: '臺北市',
        stationName: '臺北',
    },
    {
        countyName: '新北市',
        stationName: '板橋',
    },
    {
        countyName: '桃園市',
        stationName: '新屋',
    },
    {
        countyName: '臺中市',
        stationName: '臺中',
    },
    {
        countyName: '臺南市',
        stationName: '南區中心',
    },
    {
        countyName: '高雄市',
        stationName: '高雄',
    },
    {
        countyName: '基隆市',
        stationName: '基隆',
    },
    {
        countyName: '新竹市',
        stationName: '國三S103K',
    },
    {
        countyName: '嘉義市',
        stationName: '嘉義',
    },
    {
        countyName: '新竹縣',
        stationName: '新竹',
    },
    {
        countyName: '苗栗縣',
        stationName: '國一S123K',
    },
    {
        countyName: '彰化縣',
        stationName: '彰師大',
    },
    {
        countyName: '南投縣',
        stationName: '日月潭',
    },
    {
        countyName: '雲林縣',
        stationName: '雲林',
    },
    {
        countyName: '嘉義縣',
        stationName: '布袋國中',
    },
    {
        countyName: '屏東縣',
        stationName: '恆春',
    },
    {
        countyName: '宜蘭縣',
        stationName: '宜蘭',
    },
    {
        countyName: '花蓮縣',
        stationName: '花蓮',
    },
    {
        countyName: '臺東縣',
        stationName: '臺東',
    },
    {
        countyName: '澎湖縣',
        stationName: '澎湖',
    },
    {
        countyName: '金門縣',
        stationName: '金門',
    },
    {
        countyName: '連江縣',
        stationName: '馬祖',
    },
];

export const findLocation = (countyName) => {
    return availableLocations.find(location => location.countyName === countyName);
};