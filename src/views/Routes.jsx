import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'

import Login from './Login'
import Register from './Register'
import Dashboard from './Dashboard'

import Movies from './Movies';
import Collections from './Collections';
import Discover from './Discover';

function CheckNavigationGuard({ children, route }) {
    const userToken = useSelector(state => state.appVars.userToken)
    switch (route) {
        case '/':
            return userToken ? children : <Navigate to="/login" />;
            break;
        case '/login':
            return !userToken ? children : <Navigate to="/" />;
            break;
        case '/register':
            return !userToken ? children : <Navigate to="/" />;
            break;
        default:
            break;
    }
}

const AppRoutes = () => {
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <Routes location={location}>
            <Route path="/login" element={<CheckNavigationGuard route={'/login'}><Login /></CheckNavigationGuard>} />
            <Route path="/register" element={<CheckNavigationGuard route={'/register'}><Register /></CheckNavigationGuard>} />
            <Route path="/" element={<CheckNavigationGuard route={'/'}><Dashboard /></CheckNavigationGuard>}>
                <Route path="/" element={<Movies/>}/>
                <Route path="/watchlist" element={<Collections/>}/>
                <Route path="/discover" element={<Discover/>}/>
            </Route>
        </Routes>
    );
};

export default AppRoutes;