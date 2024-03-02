// App.js
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import {
  RouterProvider,
  ScrollRestoration,
  createBrowserRouter,
} from 'react-router-dom';
import './App.css';
import PrivateRoute from './PrivateRoute/PrivateRoute';
import Sgraphics from './ServicePlan/Sgraphics';
import Preloader from './components/Preloader'; // Import your Preloader component
import BookOrder from './pages/BookOrder';
import CustomPlan from './pages/CustomPlan';
import Home from './pages/Home';
import Login from './pages/Login';
import Main from './pages/Main';
import Price from './pages/Price';
import Basic from './plans/Basic';
import Company from './plans/Company';
import Enterprise from './plans/Enterprise';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/home',
    element: (
      <PrivateRoute>
        <Main />
      </PrivateRoute>
    ),
    children: [
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/home/price',
        element: <Price />,
      },
      {
        path: '/home/price/:id',
        element: <Basic />,
      },
      {
        path: '/home/book',
        element: <BookOrder />,
      },
      {
        path: '/home/company',
        element: <Company />,
      },
      {
        path: '/home/enterprise',
        element: <Enterprise />,
      },
      {
        path: '/home/customplan',
        element: <CustomPlan />,
      },
      {
        path: '/home/:title',
        element: <Sgraphics />,
      },
    ],
  },
]);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay to showcase the preloader
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <RouterProvider router={router}>
          <Home />
          <Toaster />
          <ScrollRestoration />
        </RouterProvider>
      )}
    </>
  );
}

export default App;
