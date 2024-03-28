import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userToken: null,
    userData: {
        displayName: null,
        email: null,
        photoURL: null,
        emailVerified: false
    },
    loadingScreen: false,
    panelScreens: [
        {
            url: '/',
            icon: 'ri-movie-2-line',
            title: 'Movies'
        },
        {
            url: '/watchlist',
            icon: 'ri-film-line',
            title: 'My Watchlist'
        }, 
        {
            url: '/discover',
            icon: 'ri-earth-line',
            title: 'Search'
        }
    ],
    leftMenu: false,
    genres: [],
    watchlist: []
}


export const appVars = createSlice({
    name: "AppVars",
    initialState,
    reducers: {
        setUserToken: (state, action) => {
            state.userToken = action.payload
        },
        setUserData: (state, action) => {
            state.userData = action.payload
        },
        setLoadingScreen: (state, action) => {
            state.loadingScreen = action.payload
        },
        toggleLeftMenu: (state, action) => {
            state.leftMenu = !state.leftMenu
        },
        setGenres: (state, action) => {
            state.genres = action.payload
        },
        setWatchlist: (state, action) => {
            state.watchlist = action.payload
        }
    }
})

export const { setUserToken, setUserData, setLoadingScreen, toggleLeftMenu, setGenres, setWatchlist } = appVars.actions
export default appVars.reducer