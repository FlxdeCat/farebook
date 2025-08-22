import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/loginPage/loginPage';
import RegisterPage from './pages/registerPage/registerPage';
import ForgotPage from './pages/forgotPage/forgotPage';
import ActivatePage from './pages/activatePage/activatePage';
import HomePage from './pages/homePage/homePage';
import ResetPage from './pages/resetPage/resetPage';
import './App.css';
import ProfilePage from './pages/profilePage/profilePage';
import FriendPage from './pages/friendPage/friendPage';
import HomeGroupPage from './pages/homeGroupPage/homeGroupPage';
import CreateGroupPage from './pages/createGroupPage/createGroupPage';
import GroupPage from './pages/groupPage/groupPage';
import SearchGroupPage from './pages/searchGroupPage/searchGroupPage';

const client = new ApolloClient({
  uri: "http://localhost:8080/query",
  cache: new InMemoryCache(),
});

function App() {

  const theme = localStorage.getItem("theme")
  if (theme === null) {
    localStorage.setItem("theme", "light")
    document.documentElement.setAttribute("data-theme", "light")
  }
  else {
    document.documentElement.setAttribute("data-theme", theme)
  }

  const changeTheme = () => {
    const dataTheme = document.documentElement.getAttribute("data-theme")
    const newTheme = (dataTheme == "light") ? "dark" : "light"
    localStorage.setItem("theme", newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
    return newTheme
  }

  return (
    <ApolloProvider client={client}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />}></Route>
            <Route path="/register" element={<RegisterPage />}></Route>
            <Route path="/forgot" element={<ForgotPage />}></Route>
            <Route path="/activate/:usr" element={<ActivatePage />}></Route>
            <Route path="/reset/:usr" element={<ResetPage />}></Route>
            <Route path="/home" element={<HomePage changeTheme={changeTheme} />}></Route>
            <Route path="/friend" element={<FriendPage changeTheme={changeTheme} />}></Route>
            <Route path="/profile/:id" element={<ProfilePage changeTheme={changeTheme} />}></Route>
            <Route path="/group" element={<HomeGroupPage changeTheme={changeTheme} />}></Route>
            <Route path="/group/:id" element={<GroupPage changeTheme={changeTheme} />}></Route>
            <Route path="/group/search/:search" element={<SearchGroupPage changeTheme={changeTheme} />}></Route>
            <Route path="/group/create" element={<CreateGroupPage changeTheme={changeTheme} />}></Route>
          </Routes>
        </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
