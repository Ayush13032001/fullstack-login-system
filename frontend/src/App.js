import {Navigate, Route , Routes} from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Temp from './pages/Temp';
import { useState } from 'react';
import RefreshHandler from './RefreshHandler';






function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const PrivateRoute = ({element}) => {
    return isAuthenticated ? element :<Navigate to ="/login"/>
  }

  return (
    <div className='App'>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated}/>
      <Routes> 
        <Route path='/' element = {<Navigate to ="/login" />} />
        <Route path='/home' element = {<PrivateRoute element = {<Temp />}  />} />
        <Route path='/login' element = {<Login />} />
        <Route path='/signup' element = {<Signup/>} />


      </Routes>
    </div>

  );
}

export default App;
