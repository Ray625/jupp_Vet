import "./styles/style.scss";
import "normalize.css"; // Reset CSS
// import './App.css'
import { AuthProvider } from "./contexts/AuthContext";
import { DeviceProvider } from "./contexts/DeviceContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginLayout from "./pages/layout/login_layout";
import LoginPage from "./pages/login/loginpage";
import SignupPage from "./pages/login/signuppage";
import ForgetPassPage from "./pages/login/forgetpasspage";
import Layout from "./pages/layout/homepage_layout";
import HomePage from "./pages/homepage/homepage";
import BookingPage from "./pages/booking/bookingpage";
import PhotoPage from "./pages/photo/photopage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <DeviceProvider>
          <AuthProvider>
            <ThemeProvider>
              <Routes>
                <Route path="/" element={<LoginLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forget-pass" element={<ForgetPassPage />} />
                </Route>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="/booking" element={<BookingPage />} />
                  <Route path="/photo" element={<PhotoPage />} />
                </Route>
              </Routes>
            </ThemeProvider>
          </AuthProvider>
        </DeviceProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
