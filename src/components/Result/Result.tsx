import s from './Result.module.css'
import axios from 'axios';
import { City, ResultProps, Flags } from '../../extras/types';
import { modifyChoosenCities, modifyModalState } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from '../../extras/functions';

export default function Result({ searchResult, margin }: ResultProps) {

  // Redux states
  const choosenCities = useSelector((state: { choosenCities: City[] }) => state.choosenCities)
  const flags = useSelector((state: { flags: Flags }) => state.flags)
  
  // Variables
  const dispatch = useDispatch();

  // Functions

  // This function allows us to add the city to the list
  async function add() {
    try {
      const citieInfo = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchResult.name},${searchResult.state ? searchResult.state.code : ''},${searchResult.country.code}&appid=${process.env.REACT_APP_API_KEY}`)
      const { weather, main, wind } = citieInfo.data
      let currentStorage = JSON.parse(localStorage.getItem('choosenCities') || '[]')
      if (currentStorage.filter((e: string[]) => e[0] === searchResult.name && e[1] === (searchResult.state ? searchResult.state.code : '') && e[2] === searchResult.country.code).length) {
        showMessage(`${searchResult.name}, ${searchResult.state ? `${searchResult.state.name}, ` : ''}${searchResult.country.name} is already in your list`)
      } else {
        localStorage.setItem('choosenCities', JSON.stringify([[searchResult.name, searchResult.state ? searchResult.state.code : '', searchResult.country.code], ...currentStorage]))
        dispatch(modifyChoosenCities([{ name: searchResult.name, country: searchResult.country.name, flag: flags[`${searchResult.country.code.toLowerCase()}.svg`].default, weather: weather[0].description.slice(0, 1).toUpperCase() + weather[0].description.slice(1).toLowerCase(), weatherIcon: `http://openweathermap.org/img/w/${weather[0].icon}.png`, temperature: main.temp, windSpeed: wind.speed, state: searchResult.state ? searchResult.state.name : '' }, ...choosenCities]))
        dispatch(modifyModalState(false))
        showMessage(`${searchResult.name}, ${searchResult.state ? `${searchResult.state.name}, ` : ''}${searchResult.country.name} was added to your list`)
      }
    } catch (e) {
      showMessage('Sorry, an error ocurred')
    }
  }

  return (
    <div className={`${s.container} mb-0 mt-${margin ? '3' : '0'}`}>
      <div className={s.content}>
        <img className={s.countryFlag} src={flags[`${searchResult.country.code.toLowerCase()}.svg`].default} alt='Country flag'></img>
        <div>
          <span className='bold'>{searchResult.name}</span>
          <div>
            {
              searchResult.state ?
                <><span>{`${searchResult.state.name}, `}</span><span>{searchResult.country.name}</span></>
                :
                <><span>{searchResult.country.name}</span></>
            }
          </div>
        </div>
      </div>

      <button className='btn btn-primary w-100' onClick={() => add()}>Add</button>
    </div>

  )
};