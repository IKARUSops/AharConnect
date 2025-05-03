import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import SignInSide from './sign-in-side/SignInSide';
import Signup from './sign-up/SignUp';  
import CustomNavbar from "./common-components/CustomNavbar";
import Expenses from './Sprints/Sprint-1/Expenses/Expenses';
import MenuEditDashboard from './Sprints/Sprint-1/Menu/Menu';

function App() {
  return (
    <>  
    <CustomNavbar />

    <Routes>
      <Route path="/" element={<SignInSide />} />
      {/* <Route path="/about" element={<About />} /> */}
      {/* <Route path="register" element={<Signup />}></Route> */}
      <Route path="/sign-in" element={<SignInSide />} />
      <Route path="/sign-up" element={<Signup />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/menu-edit" element={<MenuEditDashboard />} />
      {/* <Route path="/sign-up" element={<SignUp />} /> */}
      {/* <Route path="/sign-in" element={<SignInSide />} /> */}
      {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      {/* <Route path="/profile" element={<Profile />} /> */}
      {/* <Route path="/settings" element={<Settings />} /> */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
    </>
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
