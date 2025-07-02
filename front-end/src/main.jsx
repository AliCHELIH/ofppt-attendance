import ReactDOM from 'react-dom/client';
import App from './App';
import ComponentContext from './config/context/ComponentContext';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ComponentContext>
      <App />
    </ComponentContext>
  </BrowserRouter>
);
