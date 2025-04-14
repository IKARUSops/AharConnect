import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import SignInSide from './sign-in-side/SignInSide';
import Signup from './sign-up/SignUp';  
function App() {
  return (
    <Routes>
      <Route path="/" element={<SignInSide />} />
      {/* <Route path="/about" element={<About />} /> */}
      {/* <Route path="register" element={<Signup />}></Route> */}
      <Route path="/sign-in" element={<SignInSide />} />
      <Route path="/sign-up" element={<Signup />} />
    </Routes>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
