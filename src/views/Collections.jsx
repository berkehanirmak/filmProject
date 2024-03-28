import { useSelector } from "react-redux"
import MovieCard from "../components/MovieCard"

const Collections = () => {
    const watchlist = useSelector(state => state.appVars.watchlist)
    return  <div className="flex flex-col pb-10">
                <span className="font-bold text-lg text-black dark:text-white mb-4">MY WATCHLIST {watchlist.watchlist.length > 0 ? <small className="font-normal"> ({watchlist.watchlist.length})</small> : <></>}</span>
                {
                    watchlist.watchlist.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gridAutoFlow: 'dense'}}>
                        {
                            watchlist.watchlist.map(movieid => {
                                return <MovieCard key={movieid} movieid={movieid}/>
                            })
                        }
                    </div>
                    :
                    <div className="min-h-[500px] text-black p-6 text-center dark:text-white rounded-xl border-[2px] border-dashed h-[300px] border-gray-200  dark:border-gray-700 flex items-center justify-center flex-col">
                        <i class="ri-movie-2-line text-[50px] opacity-60"></i>
                        <span className=" opacity-60">Start adding movies to your watchlist!</span>
                    </div>

                }
                
            </div>
}
export default Collections