import logo from '../assets/logo.svg';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { Link } from 'react-router-dom';

const LeftMenu = () => {
    const userData = useSelector(state => state.appVars.userData)
    const pages = useSelector(state => state.appVars.panelScreens)
    const leftMenu = useSelector(state => state.appVars.leftMenu)
    return (
        <aside id="logo-sidebar" className={(leftMenu ? '' : '-translate-x-full sm:translate-x-0') + " fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"} aria-label="Sidebar">
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800 flex flex-col justify-between">
                <ul className="space-y-2 font-medium">
                    {
                        pages.map(page => <li key={page.url}>
                            <Link to={page.url} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                
                                <i className={page.icon + ' text-xl text-gray-500'}></i>
                                <span className="ms-3">{page.title}</span>
                            </Link>
                        </li>)
                    }
                </ul>
                <span className='text-gray-900 dark:text-white text-center text-sm opacity-65'>CineStack © 2024</span>
            </div>
        </aside>
    )
}
export default LeftMenu;