import { City, Country, Flags } from '../extras/types'

export function modifyChoosenCities(choosenCities: City[]) {
    return {
        type: 'MODIFY_CHOOSEN_CITIES',
        choosenCities
    }
}

export function setCountries(countries: Country[]) {
    return {
        type: 'SET_COUNTRIES',
        countries
    }
}

export function setFlags(flags: Flags) {
    return {
        type: 'SET_FLAGS',
        flags
    }
}

export function modifyModalState(modalState: boolean ) {
    return {
        type: 'MODIFY_MODAL_STATE',
        modalState
    }
}