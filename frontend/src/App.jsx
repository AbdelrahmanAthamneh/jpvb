import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Layout from "./components/Layout";
import VocabularyPage from "./pages/VocabularyPage";
import KanaPage from "./pages/KanaPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import { ThemeProvider } from "./components/ThemeProvider";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ChangePasswordPage from "./pages/ChangePassword";
import RegisterPage from "./pages/RegisterPage";
import { checkAuth, checkGuest } from "./utils/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <VocabularyPage />,
        loader: checkAuth,
      },
      {
        path: "kana",
        element: <KanaPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
        loader: checkGuest,
      },
      {
        path: "register",
        element: <RegisterPage />,
        loader: checkGuest,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/change-password",
        element: <ChangePasswordPage />,
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
