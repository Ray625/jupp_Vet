import "normalize.css"; // Reset CSS
import { AuthProvider } from "./contexts/AuthContext";
import { DeviceProvider } from "./contexts/DeviceContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginLayout from "./pages/layout/LoginLayout";
import LoginPage from "./pages/login/LoginPage";
import SignupPage from "./pages/login/SignupPage";
import ForgetPassPage from "./pages/login/ForgetPassPage";
import HomePageLayout from "./pages/layout/HomePageLayout";
import HomePage from "./pages/homepage/HomePage";
import BookingPage from "./pages/booking/BookingPage";
import PhotoPage from "./pages/photo/PhotoPage";
import UserPageLayout from "./pages/layout/UserPageLayout";
import { UserInfo, PetsInfo, Record, Password } from "./components/user/user";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <DeviceProvider>
          <AuthProvider>
            <ThemeProvider>
              <Routes>
                <Route path="/" element={<LoginLayout />}>
                  <Route path="login" element={<LoginPage />} />
                  <Route path="signup" element={<SignupPage />} />
                  <Route path="forget-pass" element={<ForgetPassPage />} />
                </Route>
                <Route path="/" element={<HomePageLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="booking" element={<BookingPage />} />
                  <Route path="photo" element={<PhotoPage />} />
                  <Route path="user" element={<UserPageLayout />}>
                    <Route index element={<UserInfo />} />
                    <Route path="pets" element={<PetsInfo />} />
                    <Route path="records" element={<Record />} />
                    <Route path="password" element={<Password />} />
                  </Route>
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
