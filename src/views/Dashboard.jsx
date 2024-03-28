import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'
import { setWatchlist } from '../store/appVars';
import { auth } from '../services/firebaseConfig';
import { useSelector } from 'react-redux';
import { deleteUser } from "firebase/auth";
import Header from '../components/Header';
import LeftMenu from '../components/LeftMenu';
import { Outlet } from 'react-router-dom';
import { getCollectionList } from '../services/firestoreFunctions';

const Dashboard = () => {
    const dispatch = useDispatch();
    const [watchlistLoaded, setWatchlistLoaded] = useState(false)
    const userInfo = useSelector(state => state.appVars.userData)
    const logout = () => {
        auth.signOut()
    }

    const deleteAccount = () => {
        const user = auth.currentUser;
        deleteUser(user).then(() => {
            console.log("User deleted successfully");
        }).catch((error) => {
            console.error("Error deleting user:", error);
        });
    }

    useEffect(() => { 
        (async () => {
            let watchlist = await getCollectionList()
            dispatch(setWatchlist(watchlist))
            setWatchlistLoaded(true)
        })()
    }, [])

    return (
        watchlistLoaded ? <>
            <Header />
            <LeftMenu />
            <div className="p-4 sm:ml-64 min-h-[100vh]">
                <div className="p-2 mt-14">
                    <Outlet></Outlet>
                </div>
            </div>
        </> : <></>
    )
}

export default Dashboard

