
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import MovieCard2 from '../components/MovieCard2';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';





const MovieSlider = ({ movies, loaded }) => {
    return (
        <Swiper
            modules={[Navigation]}
            breakpoints={{
                640: {
                    slidesPerView: 'auto',
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 'auto',
                    spaceBetween: 15,
                },
                1024: {
                    slidesPerView: 'auto',
                    spaceBetween: 20,
                },
            }}
        >
            {
                loaded ?
                    movies.map((movie) => (
                        <SwiperSlide key={movie.id} className="max-w-[304px] h-[450px] !mr-3" style={{ marginRight: '10px !important' }}>
                            <MovieCard2 movie={movie} />
                        </SwiperSlide>
                    )) :
                    [...Array(20)].map((e, i) => (
                        <SwiperSlide key={i} className="max-w-[304px] h-[450px] !mr-3" style={{ marginRight: '10px !important' }}>
                            <MovieCard2 movie={null} />
                        </SwiperSlide>
                    ))

            }
        </Swiper>
    );
};

export default MovieSlider;