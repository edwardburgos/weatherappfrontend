import { useState } from 'react';
import s from './Card.module.css'
import { City, Flags, MoreInfo } from '../../extras/types'
import temperatureIcon from '../../img/others/temperature.svg';
import windSpeedIcon from '../../img/others/windSpeed.png';
import closeCircleOutline from "../../img/icons/close-circle-outline.svg";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { modifyChoosenCities } from '../../actions';
import { Modal } from 'react-bootstrap';
import { showMessage } from '../../extras/functions';

export default function Card({ name, country, flag, weather, weatherIcon, temperature, windSpeed, state }: City) {

  // Redux states
  const choosenCities = useSelector((state: { choosenCities: City[] }) => state.choosenCities)
  const flags = useSelector((state: { flags: Flags }) => state.flags)

  // Own states
  const [modalState, setModalState] = useState(false)
  const [moreInfo, setMoreInfo] = useState<MoreInfo>({
    name: "", states: "", topLevelDomain: "", isoCode2: "", isoCode3: "",
    numericCode: 0, dialCode: "", capital: "", region: "", subregion: "", population: "", demonym: "", borders: [{ name: "", code: "us" }],
    currencies: [""], languages: [""], regionalBlocs: [""]
  })
  
  // Variables
  const dispatch = useDispatch();
  
  // Functions
  
  // This function allows us to remove a city from the list
  async function deleteCity() {
    let localItems = JSON.parse(localStorage.getItem("choosenCities") || '[]')
    const stateCountryCode = await axios.get(`http://localhost:3001/stateCountryCode?stateName=${state}&countryName=${country}`);
    localItems = localItems.filter((e: string[]) => !(e[0] === name && e[1] === stateCountryCode.data.stateCode && e[2] === stateCountryCode.data.countryCode))
    localStorage.setItem('choosenCities', JSON.stringify(localItems))
    dispatch(modifyChoosenCities(choosenCities.filter((e: City) => !(e.name === name && e.country === country && e.state === state))))
  }

  // This function allows us to show addicional information of the country
  async function showMore() {
    try {
      const additionalInfo = await axios.get(`http://localhost:3001/moreCountryInfo?countryName=${country}`);
      setMoreInfo(additionalInfo.data)
      setModalState(true)
    } catch (e) {
      showMessage('Sorry, an error ocurred')
    }
  }

  return (
    <>
      <div className={s.card}>
        <img src={closeCircleOutline} className={s.iconDumb} onClick={() => deleteCity()} alt='Remove city'/>
        <div className='w-100'>
          <h2 className='text-center mb-0'>{name}</h2>
          <div className={`${s.infoSection} mt-3 mb-0`}>
            <div className={s.iconContainer}>
              <img className={s.countryFlag} src={flag} alt='Country flag'></img>
            </div>
            <div className={s.detailsContainer}>
              <label className='bold'>Location</label>
              <div>
                {state ? <span>{`${state}, `}</span> : null}
                <span className='customLink' onClick={() => showMore()} >{country}</span>
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

      <Modal
        show={modalState}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => setModalState(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {moreInfo.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={s.modalBody}>
          <img className={s.countryFlagBig} src={flag} alt='Country flag'></img>
          <div className='mb-0 mt-0'><span className='bold'>Name: </span><span>{moreInfo.name}</span></div>
          {moreInfo.capital ? <div className='mb-0 mt-2'><span className='bold'>Capital: </span><span>{moreInfo.capital}</span></div> : null}
          {moreInfo.states ? <div className='mb-0 mt-2'><span className='bold'>Total states: </span><span>{moreInfo.states}</span></div> : null}
          {moreInfo.region ? <div><span className='bold'>Region: </span><span>{moreInfo.region}</span></div> : null}
          {moreInfo.subregion ? <div className='mb-0 mt-2'><span className='bold'>Subregion: </span><span>{moreInfo.subregion}</span></div> : null}
          {moreInfo.borders ? <div className='mb-0 mt-2'><span className='bold'>Borders: </span><ul className={s.ul}>{moreInfo.borders.map((e, index) => <li key={index}><img src={flags[`${e.code.toLowerCase()}.svg`].default} className={s.borderFlag} alt='Country flag' />{e.name}</li>)}</ul></div> : null}
          {moreInfo.population ? <div className='mb-0 mt-2'><span className='bold'>Population: </span><span>{moreInfo.population}</span></div> : null}
          {moreInfo.demonym ? <div className='mb-0 mt-2'><span className='bold'>Demonym: </span><span>{moreInfo.demonym}</span></div> : null}
          {moreInfo.languages ? <div className='mb-0 mt-2'><span className='bold'>Languages: </span><ul className={s.ul}>{moreInfo.languages.map((e, index) => <li key={index}>{e}</li>)}</ul></div> : null}
          {moreInfo.currencies ? <div className='mb-0 mt-2'><span className='bold'>Currencies: </span><ul className={s.ul}>{moreInfo.currencies.map((e, index) => <li key={index}>{e}</li>)}</ul></div> : null}
          {moreInfo.regionalBlocs ? <div className='mb-0 mt-2'><span className='bold'>Regional Blocs: </span><ul className={s.ul}>{moreInfo.regionalBlocs.map((e, index) => <li key={index}>{e}</li>)}</ul></div> : null}
          {moreInfo.isoCode2 ? <div><span className='bold'>ISO Code 2: </span><span>{moreInfo.isoCode2}</span></div> : null}
          {moreInfo.isoCode3 ? <div><span className='bold'>ISO Code 3: </span><span>{moreInfo.isoCode3}</span></div> : null}
          {moreInfo.numericCode ? <div><span className='bold'>Numeric Code: </span><span>{moreInfo.numericCode}</span></div> : null}
          {moreInfo.dialCode ? <div className='mb-0 mt-2'><span className='bold'>Dial Code: </span><span>{moreInfo.dialCode}</span></div> : null}
          {moreInfo.topLevelDomain ? <div className='mb-0 mt-2'><span className='bold'>Top Level Domain: </span><span>{moreInfo.topLevelDomain}</span></div> : null}
        </Modal.Body>
      </Modal>
    </>
  )
};