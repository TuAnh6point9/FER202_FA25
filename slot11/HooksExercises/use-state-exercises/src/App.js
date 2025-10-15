import 'bootstrap/dist/css/bootstrap.min.css';
import CounterComponent from './components/CounterComponents';
import LightSwitch from './components/LightSwitch';
import LoginForm from './components/LoginForm';
import LoginForm2 from './components/LoginForm2';
import SearchItem from './components/SearchItem';
import AccountSearch from './components/AccountSearch';
import RegisterForm from './components/RegisterForm';
function App() {
  return (
   <div>
    <CounterComponent />
    <LightSwitch />
    <LoginForm />
    <LoginForm2 />
    <SearchItem />
    <AccountSearch />
    <RegisterForm />
   </div>
  );
}

export default App;
