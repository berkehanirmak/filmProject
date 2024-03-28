import React, { useEffect, useState } from 'react';
import CircleRating from './CircleRating';
import { useSelector, useDispatch } from "react-redux"
import { updateWatchlist } from "../services/firestoreFunctions"
import { setWatchlist } from "../store/appVars"
import { getMovieDetails } from '../services/tmdbFunctions';
import { successToastConfig } from '../services/firebaseNotifications';
import toaster, { Toaster, useToaster } from 'react-hot-toast';

const MovieCard = ({ movieid }) => {
    const dispatch = useDispatch()
    const [movie, setMovie] = useState(null)

    useEffect(() => {
        (async () => {
            let movie_details = await getMovieDetails(movieid)
            setMovie(movie_details)
        })()
    }, [])

    const genre_data = useSelector(state => state.appVars.genres)
    const watchlist = useSelector(state => state.appVars.watchlist)
    const [ processing, setProcessing ] = useState(false)
    function findGenreNameById(id) {
        const genre = genre_data.find(item => item.id === id);
        return genre ? genre.name : null;
    }
    function getGenreNames(array) {
        return array.map(id => findGenreNameById(id)).filter(name => name !== null).join(', ');
    }
    const toggleFromWatchlist = async (movieid) => {
        setProcessing(true)
        let added = true;
        let _new_watchlist = [...watchlist.watchlist]
        const index = _new_watchlist.indexOf(movieid);
        if (index !== -1) {
            added = false;
            _new_watchlist.splice(index, 1);
        } else {
            // Değer dizide bulunamadı, bu yüzden ekle
            _new_watchlist.push(movieid);
        }
        let message = added ? "The movie is added to your watchlist!" : "The movie is removed from your watchlist."
        toaster.promise(
            (() => {
                return new Promise(async resolve => {
                    let new_watchlist = await updateWatchlist(watchlist.docid, _new_watchlist)
                    dispatch(setWatchlist(new_watchlist))
                    setProcessing(false)
                    resolve(true)
                })
            })(),
            {
                loading: 'Loading',
                success: message,
                error: 'Bir hata oluştu',
            },
            {
                position: 'top-right',
                duration: 2000,
                success: {
                    icon: '🎬'
                },
            }
        );
    }

    return (
        movie ?
        <div className="rounded-xl overflow-hidden h-[330px] w-full bg-normal border border-gray-200  dark:border-gray-700 hover:bg-zoomed transition-all duration-500 group/movie" style={{ background: `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${movie.poster_path})`, backgroundPosition: 'center' }}>
            <div className="flex flex-col flex-auto justify-end h-full p-5 bg-gradient-to-t from-[#1f2937] to-[#13172078] gap-4" >
                <div className='flex flex-col'>
                    <span className='text-white text-xl font-black opacity-70 group-hover/movie:opacity-100 transition-opacity duration-500'>{movie.original_title}</span>
                    <div className='flex items-center gap-2'>
                        <span className='text-white text-md opacity-60'>{(movie.release_date.split('-')[0])}</span>
                        <span className="font-black text-xl">·</span>
                        <span className="font-light text-[15px] text-nowrap overflow-hidden text-ellipsis">{[... movie.genres.map(genre => {return genre.name})].join(', ')}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className="px-[4px] mr-2 opacity-70 border border-white flex items-center">
                            <span className=" font-light text-sm">{movie.adult ? '+18' : 'PG-13'}</span>
                        </div>
                    </div>

                </div>

                <div className='flex items-center justify-between flex-wrap'>
                    <div className="w-12 h-12">
                        <CircleRating rating={movie.vote_average.toFixed(1)}></CircleRating>
                    </div>
                    {
                        !processing ? 
                        <button onClick={() => {toggleFromWatchlist(movie.id)}} type="button" className="py-2 px-4 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-all opacity-70 hover:opacity-100">
                            <i className="ri-play-list-add-line mr-3"></i>
                            { watchlist.watchlist.includes(movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist' }
                        </button> : 
                        <button type="button" className="py-2 px-4 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-all opacity-70 hover:opacity-100">
                            <i className="ri-play-list-add-line mr-3"></i>
                            { watchlist.watchlist.includes(movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist' }
                        </button>
                    }
                </div>
            </div>
        </div> : <div className="bg-white border h-[330px] border-gray-200 dark:bg-gray-800 dark:border-gray-700 animate-pulse rounded-xl overflow-hidden w-full bg-normal hover:bg-zoomed transition-all duration-500"></div>
    );
};

export default MovieCard;