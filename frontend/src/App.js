import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Landing from './Components/Landing';
import Results from './Components/Results';

function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Switch>
          <Route exact path='/results' component={Results} />
          <Route path='/' component={Landing} />
        </Switch>
      </BrowserRouter>

    </div>
  );
}

export default App;
