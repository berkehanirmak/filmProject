import { useEffect, useState, useRef } from "react"
import { getTrendingMovies } from "../services/tmdbFunctions"
import CircleRating from "../components/CircleRating"
import { useDispatch, useSelector } from "react-redux"
import { updateWatchlist } from "../services/firestoreFunctions"
import { setWatchlist } from "../store/appVars"
import { successToastConfig } from '../services/firebaseNotifications';
import toaster, { Toaster, useToaster } from 'react-hot-toast';

const Trending = () => {
    const dispatch = useDispatch()
    const genre_data = useSelector(state => state.appVars.genres)
    const watchlist = useSelector(state => state.appVars.watchlist)
    const [trends, setTrends] = useState([])
    const [index, setIndex] = useState(0)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [componentReady, setComponentReadt] = useState(false)
    const sliderRef = useRef(null)
    const [sliderWidth, setSliderWidth] = useState(0)

    const [processing, setProcessing] = useState(false)

    const handleResize = () => {
        setSliderWidth(sliderRef.current.clientWidth)
        setWindowWidth(window.innerWidth);
    };
    useEffect(() => {
        (async () => {
            let movies = await getTrendingMovies()
            setTrends(movies)
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
                setComponentReadt(true)
            }, 100);
        })()
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [])

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



    return (trends.length > 0 ? <div className="flex flex-col">
        <div className="w-full min-h-[300px] transition-all rounded-2xl shadow-[rgba(0,0,0,.1)] shadow mt-4 overflow-hidden border border-gray-200 dark:border-gray-700" style={{ background: `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${trends[index].backdrop_path})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: componentReady ? '1' : '0' }}>
            <div className="flex flex-col" style={{ backgroundImage: 'linear-gradient(to right, rgb(35 42 57) calc(50vw - 510px), rgb(49 63 89 / 84%) 50%, rgb(34 38 46 / 84%) 100%)' }}>
                <div className="w-full h-full min-h-[300px] flex items-center p-6 pb-0 gap-6">
                    <div className="hidden md:flex h-100 w-6 items-center justify-center">
                        <button onClick={() => setIndex(index == 0 ? (trends.length - 1) : (index - 1))} className="text-white hover:text-black transition-all bg-[rgba(255,255,255,.05)] hover:bg-[rgba(255,255,255,1)] min-w-8 h-8 rounded-full flex items-center justify-center">
                            <i className="ri-arrow-left-s-line font-black text-xl"></i>
                        </button>
                    </div>
                    <div className="flex overflow-hidden flex-auto" ref={sliderRef}>
                        <div className="flex flex-auto transition-all duration-700 ease-in-out" style={{ transform: 'translateX(-' + (index * sliderWidth) + 'px)' }}>
                            {
                                [...trends].map(movie =>
                                    <div key={movie.id} className="flex items-center overflow-hidden" style={{ width: sliderWidth + 'px' }}>
                                        <div className="flex items-center max-w-[1200px]">
                                            <div className="rounded-lg min-w-[300px] h-[450px] hidden lg:block" style={{ background: `url(https://image.tmdb.org/t/p/w600_and_h900_bestv2/${movie.poster_path})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                                            <div className="flex flex-col gap-4 px-4 md:px-6 lg:px-12">
                                                <div className="flex items-end gap-4 flex-wrap">
                                                    <span className="font-bold text-2xl md:text-3xl lg:text-5xl text-white">{movie.title}<span className="text-xl md:text-2xl ml-4 lg:text-3xl font-light text-white">({movie.release_date.split('-')[0]})</span></span>

                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <div className="px-[4px] mr-2 opacity-70 border border-white flex items-center">
                                                        <span className=" font-light text-sm">{movie.adult ? '+18' : 'PG-13'}</span>
                                                    </div>
                                                    <span className="font-light text-[15px]">{movie.release_date.replaceAll('-', '/')}</span>
                                                    <span className="font-black text-xl">·</span>
                                                    <span className="font-light text-[15px]">{getGenreNames(movie.genre_ids)}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12">
                                                        <CircleRating rating={movie.vote_average.toFixed(1)}></CircleRating>
                                                    </div>
                                                    {
                                                        !processing ?
                                                            <button onClick={() => { toggleFromWatchlist(movie.id) }} type="button" className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-all opacity-70 hover:opacity-100">
                                                                <i className="ri-play-list-add-line mr-3"></i>
                                                                {watchlist.watchlist.includes(movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                                                            </button> :
                                                            <button type="button" className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-all opacity-70 hover:opacity-100">
                                                                <i className="ri-play-list-add-line mr-3"></i>
                                                                {watchlist.watchlist.includes(movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                                                            </button>
                                                    }

                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[17px]" style={{ letterSpacing: '1px' }}>OVERVIEW</span>
                                                    <p className="text-sm mt-1 font-light">
                                                        {movie.overview}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="hidden md:flex h-100 w-6 items-center justify-center">
                        <button onClick={() => setIndex(index >= (trends.length - 1) ? 0 : (index + 1))} className="text-white hover:text-black transition-all bg-[rgba(255,255,255,.05)] hover:bg-[rgba(255,255,255,1)] min-w-8 h-8 rounded-full flex items-center justify-center">
                            <i className="ri-arrow-right-s-line font-black text-xl"></i>
                        </button>
                    </div>
                </div>
                <div className="w-full flex items-center justify-center text-white py-2">
                    <div className="flex items-center justify-center gap-1 text-xs">
                        {
                            trends.map((movie, circleIndex) => {
                                return <div key={circleIndex} className="opacity-50 hover:opacity-100 transition-all" onClick={() => setIndex(circleIndex)}>
                                    {
                                        circleIndex == index ? <i className="ri-circle-fill"></i> : <i className="ri-circle-line"></i>
                                    }
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>

        </div>
    </div> : <></>)
}
export default Trending