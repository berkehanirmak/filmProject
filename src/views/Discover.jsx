import { useEffect } from "react"

const Discover = () => {
    return <div className="flex flex-col pb-10">
        <span className="font-bold text-lg text-black dark:text-white mb-4">MY WATCHLIST</span>
        <div className="min-h-[500px] text-black p-6 text-center dark:text-white rounded-xl border-[2px] border-dashed h-[300px] border-gray-200  dark:border-gray-700 flex items-center justify-center flex-col">
            <i className="ri-earth-line text-[50px] opacity-60"></i>
            <span className=" opacity-60">COMING SOON</span>
        </div>
    </div>
}
export default Discover