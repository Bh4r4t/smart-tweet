import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Landing from './Components/Landing';
import Results from './Components/Results';

function App() {
  const [cities, setcities] = useState([])
  const [brands, setbrands] = useState([])
  useEffect(() => {
    fetch('data/cities.json').then(e => {
      return e.json()
    }).then(e => {
      setcities(e);
    })
    fetch('data/brands.json').then(e => {
      return e.json()
    }).then(e => {
      setbrands(e);
    })
  }, []);
  return (
    <div className="App">

      <BrowserRouter>
        <Switch>
          <Route exact path='/results' render={(props) => {
            return <Results cities={cities} brands={brands} />
          }} />
          <Route exact path='/' render={(props) => {
            return <Landing cities={cities} brands={brands} />
          }} />
        </Switch>
      </BrowserRouter>

    </div>
  );
}

export default App;
