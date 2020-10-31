import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const CountrySelector = ({ data, show }) => (
  <div>
    <span>{data.name}</span>
    <button onClick={() => show(data.name.toLowerCase(), data.capital)} className="countrySelector">
      Show
    </button>
  </div>
);

const Country = ({ countryData, weatherData }) => {
  return (
    <div className="countryContainer">
      <h1>{countryData.name}</h1>
      <div>
        <span className="countryDataLabel">Capital:</span>
        <span>{countryData.capital}</span>
      </div>
      <div>
        <span className="countryDataLabel">Population:</span>
        <span>{countryData.population}</span>
      </div>
      <div>
        <h2>Languages</h2>
        <ul>
          {countryData.languages.map((lang) => (
            <li key={lang.name}>{lang.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <img src={countryData.flag} alt="flag" className="countryFlag"></img>
      </div>
      {Object.keys(weatherData).length > 0 && !weatherData.hasOwnProperty("error") ? (
        <div>
          <h2>Weather in {countryData.capital}</h2>
          <div>
            <span className="countryDataLabel">Temperature:</span>
            <span>{weatherData.current.temperature} ℃</span>
          </div>
          <div>
            <img src={weatherData.current.weather_icons[0]} alt="weather" className="weatherIcon"></img>
          </div>
          <div>
            <span className="countryDataLabel">Wind:</span>
            <span>{weatherData.current.wind_speed} km/h</span>
            <span className="dataLabel">direction</span>
            <span>{weatherData.current.wind_dir}</span>
          </div>
        </div>
      ) : (
        <p>No weather data</p>
      )}
    </div>
  );
};

function App() {
  const [filter, setFilter] = useState("");
  const [countries, setCountries] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [currentCountry, setCurrentCountry] = useState("");

  const filterOnChange = (event) => {
    const wideFilter = countries.filter((country) => (country.name.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1 ? true : false));

    if (wideFilter.length === 1 && currentCountry !== wideFilter[0].name.toLowerCase()) {
      getWeahterData(wideFilter[0].capital);
      setCurrentCountry(wideFilter[0].name.toLowerCase());
    }

    setFilter(event.target.value);
  };

  const setCountry = (name, capital) => {
    if (currentCountry !== name.toLowerCase()) {
      getWeahterData(capital);
      setCurrentCountry(name.toLowerCase());
    }

    setFilter(name.toLowerCase());
  };

  const getWeahterData = (capital) => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_WEATHER_API_KEY}&query=${capital}`)
      .then((response) => {
        setWeatherData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCountries = () => {
    if (countries.length > 0 && filter !== "") {
      const filtered = countries.filter((country) => (country.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1 ? true : false));
      if (filtered.length > 10) {
        return <p>Too many matches, specify another filter</p>;
      } else if (filtered.length <= 10 && filtered.length > 1) {
        const narrowFilter = countries.filter((country) => (country.name.toLowerCase() === filter.toLowerCase() ? true : false));
        if (narrowFilter.length === 1) {
          return <Country key={narrowFilter[0].alpha2Code} countryData={narrowFilter[0]} weatherData={weatherData}></Country>;
        } else {
          return filtered.map((country) => <CountrySelector key={country.alpha2Code} data={country} show={setCountry}></CountrySelector>);
        }
      } else if (filtered.length === 1) {
        return <Country key={filtered[0].alpha2Code} countryData={filtered[0]} weatherData={weatherData}></Country>;
      } else {
        return <p>No matches</p>;
      }
    }
  };

  useEffect(() => {
    axios
      .get(`https://restcountries.eu/rest/v2/all`)
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        alert("Error getting data");
      });
  }, []);

  return (
    <div>
      <div id="countryFilterContainer">
        <span>Find countries</span>
        <input id="countryInput" onChange={filterOnChange} value={filter}></input>
      </div>
      <div>{getCountries()}</div>
    </div>
  );
}

export default App;
