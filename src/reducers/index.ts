import { City, Country, Flags } from '../extras/types';

const initialState = {
  choosenCities: new Array<City>(),
  countries: new Array<Country>(),
  flags: {},
  modalState: false
}

export default function reducer(state = initialState, action: { type: string, choosenCities: City[], countries: Country[], flags: Flags, modalState: boolean}) {
  switch (action.type) {
    case 'MODIFY_CHOOSEN_CITIES':
      return {
        ...state,
        choosenCities: action.choosenCities
      }
    case 'SET_COUNTRIES':
      return {
        ...state,
        countries: action.countries
      }
    case 'SET_FLAGS':
      return {
        ...state,
        flags: action.flags
      }
    case 'MODIFY_MODAL_STATE':
      return {
        ...state,
        modalState: action.modalState
      }
    default:
      return { ...state }
  }
}