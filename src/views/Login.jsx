import { useState } from 'react';
import authBg from '../assets/authBg.jpg';
import logo from '../assets/logo-text-dark.svg';
import { Link } from 'react-router-dom';
import { auth } from '../services/firebaseConfig';
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence, browserLocalPersistence } from 'firebase/auth';
import * as yup from 'yup';
import { Formik } from 'formik';
import { firebaseNotification } from '../services/firebaseNotifications';
import { useDispatch } from 'react-redux';
import { setLoadingScreen } from '../store/appVars';

const Login = () => {
    const dispatch = useDispatch()
    let loginSchema = yup.object({
        email: yup.string().email('Please enter a valid email.').required('Please enter your email.'),
        password: yup.string().required('Please enter your password.').max(18, 'Your password can\' be more than 18 characters.').min(8, 'Your password is too short.'),
        rememberMe: yup.boolean()
    });
    const [darkMode, setDarkMode] = useState(localStorage.theme == 'dark' ? true : false)

    const signIn = async (email, password, rememberMe) => {
        try {
            const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
            dispatch(setLoadingScreen(true))
            await setPersistence(auth, persistenceType)
            await signInWithEmailAndPassword(auth, email, password)
            dispatch(setLoadingScreen(false))
        } catch (error) {
            firebaseNotification(error.code)
            dispatch(setLoadingScreen(false))
        }
    }

    return (
        <div style={{width: '100%', height: '100vh'}}>
            <section style={{zIndex: 99, position: 'relative'}}>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="mr-2 object-contain" src={logo} alt="logo" style={{width: '200px'}}/>  
                    </a>
                    <div className="w-full bg-white rounded-lg shadow border border-white dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in to your account
                            </h1>
                            <Formik 
                                initialValues={{ email: '', password: '', rememberMe: true }}
                                validationSchema={loginSchema}
                                onSubmit={ values => {
                                    signIn(values.email, values.password, values.rememberMe)
                                }}
                            >
                                {({ handleSubmit, handleChange, values, errors, touched, handleBlur, submitCount }) => (
                                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                        <div>
                                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                            <input value={values.email} onChange={handleChange} onBlur={handleBlur} type="email" name="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="your@mail.com" required/>
                                            {((touched.email || submitCount > 0) && errors.email) ? <small className='text-red-500 absolute'>{errors.email}</small> : <></>}
                                        </div>
                                        <div>
                                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                            <input value={values.password} onChange={handleChange} onBlur={handleBlur} type="password" name="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                                            {((touched.password || submitCount > 0) && errors.password) ? <small className='text-red-500  absolute'>{errors.password}</small> : <></>}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input checked={values.rememberMe} onChange={handleChange} onBlur={handleBlur} name="rememberMe" id='remember' aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"/>
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                                </div>
                                            </div>
                                            <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                                        </div>
                                        <button type="submit" className="w-full text-white bg-[#155e75] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                            Don’t have an account yet? <Link to={'/register'} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                                        </p>
                                    </form>
                                )}
                            </Formik>
                            
                        </div>
                    </div>
                    <div className="w-full bg-white border border-white rounded-lg shadow dark:border md:mt-2 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 py-2 flex items-center justify-between sm:p-8 sm:py-3">
                            <span className='text-gray-900 dark:text-white text-center text-sm opacity-65'>CineStack © 2024</span>
                            <button className='text-black dark:text-white w-8 h-8 rounded-md hover:bg-[rgba(0,0,0,.05)] dark:hover:bg-[#131720] transition-all' onClick={() => {
                                if (localStorage.theme == 'light') {
                                    localStorage.theme = 'dark';
                                    document.documentElement.classList.add('dark');
                                    setDarkMode(true)
                                } else {
                                    localStorage.theme = 'light';
                                    document.documentElement.classList.remove('dark');
                                    setDarkMode(false)
                                }
                            }}>
                                {
                                    darkMode ? <i className="ri-sun-line"></i> : <i className="ri-moon-line"></i>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <img src={authBg} width={'100%'} height={'100vh'} style={{objectFit: 'cover', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 1}}/>
        </div>
    )
}

export default Login