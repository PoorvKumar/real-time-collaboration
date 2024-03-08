import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import MultiplayerBoard from './pages/MultiplayerBoard';
import { useAuthenticate } from './context/AuthContext';
import Landing from './pages/Landing';
import Signin from './pages/Signin';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/Loader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashLayout from './layouts/DashLayout';
import Test from "./pages/Test";
import MultiplayerCanvas from "./pages/MultiplayerCanvas";

function App() {

  const { isAuthenticated, loading } = useAuthenticate();

  if (loading) {
    return <>
      <Loader />
      <ToastContainer autoClose={5000} closeOnClick draggable />
    </>;
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<SignUp />} />
          {isAuthenticated ? (
            <Route path='/' element={<DashLayout />}>
              <Route index element={<Dashboard />} />
            </Route>
          ) : (
            <Route path='/' element={<Landing />} />
          )}
          {/* <Route path='/' element={isAuthenticated ? <Dashboard /> : <Landing />} /> */}
          {/* <Route path='/board/:boardId' element={<MultiplayerBoard />} /> */}
          <Route element={<ProtectedRoute />}>
            <Route path='/board/:boardId' element={<MultiplayerBoard />} />
            <Route path='/workspace/:workspaceId' element={<MultiplayerCanvas />} />
            <Route path='/test' element={<Test />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer autoClose={5000} closeOnClick draggable />
    </>
  )
}

export default App;
