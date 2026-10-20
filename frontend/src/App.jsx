import {Routes,Route} from 'react-router-dom';
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";
import SetPassword from "./pages/SetPassword.jsx";
import Admin from './pages/Admin.jsx';
import { ForgotPassword } from './pages/ForgotPassword.jsx';


function App() {
  return (
    <>
    <Header />
    <Routes>
      <Route path ="/" element={<Home />}/>
      <Route path ="/login" element={<Login />}/>
      <Route path ="/signup" element={<Signup />}/>
      <Route path ="/user/credentials" element={<Profile />}/>
      <Route path="/set-password/:setUpToken" element={<SetPassword />} />
      <Route path = "/admin" element={<Admin />} />
      <Route path = "/forgot-password/:resetToken" element={<ForgotPassword />} />
    </Routes>
    <Footer />
    </>
  )
}

export default App;