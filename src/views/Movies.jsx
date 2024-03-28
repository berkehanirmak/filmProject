// Movies.js
import React, { useEffect, useState } from 'react';
import Trending from '../components/Trending';
import MovieCard2 from '../components/MovieCard2';
import MovieSlider from '../components/MovieSlider';
import { getCategoryList, getMovieListByCategory } from '../services/tmdbFunctions';
import { useDispatch } from 'react-redux';
import { setGenres } from '../store/appVars';

const Movies = () => {
    const dispatch = useDispatch()
    const [dramaMovies, setDramaMovies] = useState([]);
    const [dramaMoviesLoaded, setDramaMoviesLoaded] = useState(false)

    const [comedyMovies, setComedyMovies] = useState([]);
    const [comedyMoviesLoaded, setComedyMoviesLoaded] = useState(false)

    const [horrorMovies, setHorrorMovies] = useState([]);
    const [horrorMoviesLoaded, setHorrorMoviesLoaded] = useState(false)


    useEffect(() => {
        (async () => {
            let genre_data = await getCategoryList()
            dispatch(setGenres(genre_data))
            let drama_movies = await getMovieListByCategory(18);
            setDramaMovies(drama_movies);
            setDramaMoviesLoaded(true);

            let comedy_movies = await getMovieListByCategory(35);
            setComedyMovies(comedy_movies);
            setComedyMoviesLoaded(true)

            let horror_movies = await getMovieListByCategory(27);
            setHorrorMovies(horror_movies);
            setHorrorMoviesLoaded(true)
        })();
    }, []);

    return (
        <div className="flex flex-col pb-10">
            <span className="font-bold text-lg text-black dark:text-white">TRENDING</span>
            <Trending></Trending>
            <span className="font-bold text-lg text-black dark:text-white mt-8 mb-4">DRAMA</span>
            <div className='max-w-full overflow-hidden relative'>
                <MovieSlider movies={dramaMovies} loaded={dramaMoviesLoaded} />
            </div>
            <span className="font-bold text-lg text-black dark:text-white mt-8 mb-4">COMEDY</span>
            <div className='max-w-full overflow-hidden relative'>
                <MovieSlider movies={comedyMovies} loaded={comedyMoviesLoaded} />
            </div>
            <span className="font-bold text-lg text-black dark:text-white mt-8 mb-4">HORROR</span>
            <div className='max-w-full overflow-hidden relative'>
                <MovieSlider movies={horrorMovies} loaded={horrorMoviesLoaded} />
            </div>
            

        </div>
    );
};

export default Movies;

