import React, { useEffect, useState } from 'react';
import s from './App.module.css';
import SearchBar from './components/SearchBar/SearchBar';
import Card from './components/Card/Card';
import axios, { CancelToken } from 'axios';
import loadingGif from './img/others/loadingGif.gif';
import { City, Flags, FullCity } from './extras/types'
import { modifyChoosenCities, setCountries, setFlags } from './actions';
import { useDispatch, useSelector } from 'react-redux';
import noResults from './img/others/noResults.svg'

export default function App() {

  // Redux states
  const choosenCities = useSelector((state: { choosenCities: City[] }) => state.choosenCities)
  const flags = useSelector((state: { flags: Flags }) => state.flags)

  // Own states
  const [loading, setLoading] = useState<boolean>(true);

  // Variables
  const dispatch = useDispatch();


  function getCurrentLocation(images: Flags, cancelToken: CancelToken | null) {
    if (navigator.geolocation) {
      // This line opens the location popup if user has not allows us but do not open it if user has blocked or allowed us before
      navigator.geolocation.getCurrentPosition(function (position) {
        // This code is executed if the used allows us to know his location or if he has allowed us before
        async function getLocation() {
          const locationInfo = await axios.get(`https://api.opencagedata.com/geocode/v1/json?key=${process.env.REACT_APP_OPENCAGEDATA_API_KEY}&q=${position.coords.latitude}%2C+${position.coords.longitude}&pretty=1&no_annotations=1`, cancelToken ? { cancelToken } : undefined)
          const { city, country_code, state } = locationInfo.data.results[0].components
          const stateCode = await axios.get(`${process.env.REACT_APP_BACKEND}/cityHasState?city=${city}&stateName=${state}&countryCode=${country_code.toUpperCase()}`, cancelToken ? { cancelToken } : undefined)
          const weatherInfo = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},${(stateCode.data.stateCode).toString().length && /^[A-Z]+$/.test(stateCode.data.stateCode) ? stateCode.data.stateCode : ''},${country_code.toUpperCase()}&appid=${process.env.REACT_APP_API_KEY}`, cancelToken ? { cancelToken } : undefined)
          const { weather, main, wind } = weatherInfo.data
          dispatch(modifyChoosenCities([{ name: city, country: stateCode.data.countryName, flag: images[`${country_code.toLowerCase()}.svg`].default, weather: weather[0].description.slice(0, 1).toUpperCase() + weather[0].description.slice(1).toLowerCase(), weatherIcon: `https://openweathermap.org/img/w/${weather[0].icon}.png`, temperature: main.temp, windSpeed: wind.speed, state: (stateCode.data.stateCode).toString().length && /^[A-Z]+$/.test(stateCode.data.stateCode) ? state : '' }]));
          localStorage.setItem('choosenCities', JSON.stringify([[city, (stateCode.data.stateCode).toString().length && /^[A-Z]+$/.test(stateCode.data.stateCode) ? stateCode.data.stateCode : '', country_code.toUpperCase()]]));
        }
        getLocation()
      });
    }
  }
  // Hooks

  // This hook set the user location and countries 
  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    let images: Flags = {};
    require.context('./img/svg', false, /\.(svg)$/).keys().forEach((item, index) => { images[item.replace('./', '')] = require.context('./img/svg', false, /\.(svg)$/)(item) });
    dispatch(setFlags(images))
    async function getInfo() {
      try {
        if (!localStorage.getItem("choosenCities")) {
          // If geolocation is supported by the user's browser
          getCurrentLocation(images, source.token)
        } else {
          let localChoosenCities: City[] = []
          const local: string[] = JSON.parse(localStorage.getItem("choosenCities") || '[]').map((e: string[]) => JSON.stringify(e))
          let set = new Set(local).values();
          const localItems: string[][] = Array.from(set).map((e:string) => JSON.parse(e))
          let cities: Promise<{ data: FullCity }>[] = []
          let names: Promise<{ data: { countryName: string, stateName: string } }>[] = []
          localItems.forEach((e: string[]) => {
            cities.push(axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${e[0]},${e[1]},${e[2]}&appid=${process.env.REACT_APP_API_KEY}`, { cancelToken: source.token }));
            names.push(axios.get(`${process.env.REACT_APP_BACKEND}/stateCountryName?countryCode=${e[2]}&stateCode=${e[1]}`, { cancelToken: source.token }));
          })
          let promises: [Promise<{ data: FullCity }[]>, Promise<{data: { countryName: string, stateName: string }}[]>] = [Promise.all(cities), Promise.all(names)]
          let resolvedPromises = await Promise.all(promises)
          localChoosenCities = resolvedPromises[0].map((e, index) => {
            const { weather, main, wind } = e.data
            return { name: localItems[index][0], country: resolvedPromises[1][index].data.countryName, flag: images[`${localItems[index][2].toLowerCase()}.svg`].default, weather: weather[0].description.slice(0, 1).toUpperCase() + weather[0].description.slice(1).toLowerCase(), weatherIcon: `https://openweathermap.org/img/w/${weather[0].icon}.png`, temperature: main.temp, windSpeed: wind.speed, state: resolvedPromises[1][index].data.stateName };
          })
          dispatch(modifyChoosenCities(localChoosenCities))
          localStorage.setItem('choosenCities', JSON.stringify(localItems))
        }

        // Get countries
        const countries = await axios.get(`${process.env.REACT_APP_BACKEND}/countries`, { cancelToken: source.token })
        dispatch(setCountries(countries.data))

        // The loading state change
        setLoading(false)
      } catch (e) {
        if (e instanceof Error) {
          if (e.message !== "Unmounted") return;
        }
      }
    }
    getInfo();
    return () => source.cancel("Unmounted");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  return (
    <>
      {
        loading ?
          <div className={s.container}>
            <div className={s.content}>
              <img className={s.loading} src={loadingGif} alt='loadingGif'></img>
            </div>
          </div>
          :
          <div className={s.appContainer}>
            <SearchBar></SearchBar>
            <div className={s.searchContent}>
              <div className={s.cardsContainer}>
                {
                  choosenCities.length ?
                    <>
                      {
                        choosenCities.map((e: City, index) =>
                          <Card key={index} name={e.name} country={e.country} flag={e.flag} weather={e.weather} weatherIcon={e.weatherIcon} temperature={e.temperature} windSpeed={e.windSpeed} state={e.state}></Card>
                        )
                      }
                    </>
                    :
                    <>
                      <img className={s.emptyVector} src={noResults} alt='Empty vector'></img>
                      <p className={s.noCities}>Your city list is empty</p>
                      <button className='btn btn-primary' onClick={() => getCurrentLocation(flags, null)}>Add the city where I am located</button>
                    </>
                }
              </div>
            </div>
          </div>
      }
    </>
  )
}