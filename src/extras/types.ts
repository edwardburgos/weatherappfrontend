export type City = {
    name: string;
    country: string;
    flag: string;
    weather: string;
    weatherIcon: string;
    temperature: number;
    windSpeed: number;
    state: string;
}

export type Flags = {
    [key: string]: {default: string}
}

export type MoreInfo = {
    name: string,
    states: string,
    topLevelDomain: string,
    isoCode2: string,
    isoCode3: string,
    numericCode: number,
    dialCode: string,
    capital: string,
    region: string,
    subregion: string,
    population: string,
    demonym: string,
    borders: {name: string, code: string}[],
    currencies: string[],
    languages: string[],
    regionalBlocs: string[]
}

export type AvailableCity = {
    name: string,
    country: string
};

export type Country = {
    code: string,
    name: string
}

export type SearchResult = {
    name: string,
    state: {
        code: string,
        name: string
    },
    country: Country
}

export type ResultProps = {
    searchResult: SearchResult,
    margin: number
}

