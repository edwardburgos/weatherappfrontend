import s from './Card.module.css'
import { City } from '../../extras/types'
import temperatureIcon from '../../img/others/temperature.svg';
import windSpeedIcon from '../../img/others/windSpeed.png';
import closeCircleOutline from "../../img/icons/close-circle-outline.svg";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { modifyChoosenCities } from '../../actions';

export default function Card({ name, country, flag, weather, weatherIcon, temperature, windSpeed, state }: City) {

  // Redux states
  const choosenCities = useSelector((state: { choosenCities: City[] }) => state.choosenCities)
  
  // Variables
  const dispatch = useDispatch();
  
  // Functions
  
  // This function allows us to remove a city from the list
  async function deleteCity() {
    let localItems = JSON.parse(localStorage.getItem("choosenCities") || '[]')
    const stateCountryCode = await axios.get(`https://edwardweatherapp.herokuapp.com/stateCountryCode?stateName=${state}&countryName=${country}`);
    localItems = localItems.filter((e: string[]) => !(e[0] === name && e[1] === stateCountryCode.data.stateCode && e[2] === stateCountryCode.data.countryCode))
    localStorage.setItem('choosenCities', JSON.stringify(localItems))
    dispatch(modifyChoosenCities(choosenCities.filter((e: City) => !(e.name === name && e.country === country && e.state === state))))
  }

  return (
    <>
      <div className={s.card}>
        <img src={closeCircleOutline} className={s.iconDumb} onClick={() => deleteCity()} alt='Remove city'/>
        <div className='w-100'>
          <h2 className={s.cardTitle}>{name}</h2>
          <div className={`${s.infoSection} mt-3 mb-0`}>
            <div className={s.iconContainer}>
              <img className={s.countryFlag} src={flag} alt='Country flag'></img>
            </div>
            <div className={s.detailsContainer}>
              <label className='bold'>Location</label>
              <div>
                {state ? <span>{`${state}, `}</span> : null}
                <span>{country}</span>
              </div>
            </div>
          </div>
          <div className={`${s.infoSection} mt-3 mb-0`}>
            <div className={s.iconContainer}>
              <img className={s.icon} src={weatherIcon} alt='Weather representation'></img>
            </div>
            <div className={s.detailsContainer}>
              <label className='bold'>Weather</label>
              <p className='mb-0'>{weather}</p>
            </div>
          </div>
          <div className={`${s.infoSection} mt-3 mb-0`}>
            <div className={s.iconContainer}>
              <img className={s.icon} src={temperatureIcon} alt='Temperature'></img>
            </div>
            <div className={s.detailsContainer}>
              <label className='bold'>Temperature</label>
              <p className='mb-0'>{`${temperature} K | ${Math.round(((((temperature - 273.15) * 1.8) + 32) + Number.EPSILON) * 100) / 100} °F | ${Math.round((temperature - 273.15) * 100) / 100} °C`}</p>
            </div>
          </div>
          <div className={`${s.infoSection} mt-3 mb-0`}>
            <div className={s.iconContainer}>
              <img className={s.icon} src={windSpeedIcon} alt='Wind speed'></img>
            </div>
            <div className={s.detailsContainer}>
              <label className='bold'>Wind speed</label>
              <p className='mb-0'>{windSpeed} meter/sec</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};