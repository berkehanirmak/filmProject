import logoDark from '../assets/logo-text-dark.svg';
import logoWhite from '../assets/logo-text.svg';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useState, useEffect, useRef } from 'react';
import { auth } from '../services/firebaseConfig';
import { toggleLeftMenu } from '../store/appVars';
import { useDispatch } from 'react-redux';

const Header = () => {
    const dispatch = useDispatch()
    const userData = useSelector(state => state.appVars.userData)
    const [darkMode, setDarkMode] = useState(localStorage.theme == 'dark' ? true : false)
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            // Component unmount edildiğinde event listener'ı kaldırın
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const logout = () => {
        auth.signOut()
    }


    return (
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start rtl:justify-end">
                        <button className='sm:hidden mr-3 text-black dark:text-white w-8 h-8 rounded-md hover:bg-[rgba(0,0,0,.05)] dark:hover:bg-[#131720] transition-all' onClick={() => {dispatch(toggleLeftMenu())}}>
                            <i className="ri-menu-2-line"></i>
                        </button>
                        <img className="object-contain" src={darkMode ? logoDark : logoWhite} alt="logo" style={{ width: '120px' }} />
                    </div>
                    <div className='flex items-center'>
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
                        <div className="flex items-center">
                            <div className="flex items-center ms-3 relative" ref={menuRef}>
                                <div>
                                    <button type="button" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="false" onClick={toggleMenu}>
                                        <span className="sr-only">Open user menu</span>
                                        <img className="w-8 h-8 rounded-full" src="https://wallpapers.com/images/high/netflix-profile-pictures-1000-x-1000-w3lqr61qe57e9yt8.webp" alt="user photo" />
                                    </button>
                                </div>
                                {menuOpen && (
                                    <div className="z-50 border-[1px] border-gray-200 dark:border-gray-700 absolute right-[0px] top-[44px] text-base list-none bg-white divide-y divide-gray-100 shadow dark:bg-gray-800 dark:divide-gray-600">
                                        <div className="px-4 py-3" role="none">
                                            <p className="text-sm text-gray-900 dark:text-white" role="none">
                                                {userData.displayName || 'John Doe'}
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                                                {userData.email}
                                            </p>
                                        </div>
                                        <ul className="py-1" role="none">
                                            <li>
                                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Edit Profile</a>
                                            </li>
                                            <li>
                                                <a onClick={logout} className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100 dark:text-red-500 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Sign out</a>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                                
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </nav>
    )
}
export default Header;