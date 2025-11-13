import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    // Redux Provider đã được setup ở index.js
    // Không cần AuthProvider và PaymentProvider nữa
    <div className="App">
      {/*Sử dụng AppRoutes để quản lý các route trong ứng dụng*/}
      <AppRoutes />
    </div>
  );
}

export default App;
