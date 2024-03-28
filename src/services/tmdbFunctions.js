const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const getTrendingMovies = () => {
    return new Promise(resolve => {
        const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOGJhODZhYmVkYWQ5NTZhN2ZhYTk0ZDY5ZWU0ZmRjMCIsInN1YiI6IjY1OWQ5MDZmMWQ3OGYyMDBlZjk0NzdkYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N-nT1kXDMDVuvIxoRxaJzyje0kuKyR_mqGGEqn0mCug'
            }};
        fetch(url, options)
        .then(res => res.json())
        .then(json => {
            resolve(json.results)
        })
        .catch(err => console.error('error:' + err));
    })
}

export const getCategoryList = () => {
    return new Promise(resolve => {
        const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOGJhODZhYmVkYWQ5NTZhN2ZhYTk0ZDY5ZWU0ZmRjMCIsInN1YiI6IjY1OWQ5MDZmMWQ3OGYyMDBlZjk0NzdkYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N-nT1kXDMDVuvIxoRxaJzyje0kuKyR_mqGGEqn0mCug'
            }};
        fetch(url, options)
        .then(res => res.json())
        .then(json => {
            resolve(json.genres)
        })
        .catch(err => console.error('error:' + err));
    })
}

export const getMovieListByCategory = (category_id) => {
    return new Promise(resolve => {
        const url = `https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${category_id}`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOGJhODZhYmVkYWQ5NTZhN2ZhYTk0ZDY5ZWU0ZmRjMCIsInN1YiI6IjY1OWQ5MDZmMWQ3OGYyMDBlZjk0NzdkYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N-nT1kXDMDVuvIxoRxaJzyje0kuKyR_mqGGEqn0mCug'
            }};
        fetch(url, options)
        .then(res => res.json())
        .then(json => resolve(json.results))
        .catch(err => console.error('error:' + err));
    })
}

export const getMovieDetails = (category_id) => {
    return new Promise(resolve => {
        const url = `https://api.themoviedb.org/3/movie/${category_id}?language=en-US`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOGJhODZhYmVkYWQ5NTZhN2ZhYTk0ZDY5ZWU0ZmRjMCIsInN1YiI6IjY1OWQ5MDZmMWQ3OGYyMDBlZjk0NzdkYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N-nT1kXDMDVuvIxoRxaJzyje0kuKyR_mqGGEqn0mCug'
            }};
        fetch(url, options)
        .then(res => res.json())
        .then(json => resolve(json))
        .catch(err => console.error('error:' + err));
    })
}

