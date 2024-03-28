import { useState } from 'react';
import authBg from '../assets/authBg.jpg';
import logo from '../assets/logo-text-dark.svg';
import logoDarkText from '../assets/logo-text.svg';
import { Link } from 'react-router-dom';
import { auth } from '../services/firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import * as yup from 'yup';
import { Formik } from 'formik';
import { firebaseNotification } from '../services/firebaseNotifications';
import { useDispatch } from 'react-redux';
import { setLoadingScreen } from '../store/appVars';

const Register = () => {
    const dispatch = useDispatch()
    const [privacyModal, setPrivacyModal] = useState(false);
    const [darkMode, setDarkMode] = useState(localStorage.theme == 'dark' ? true : false)

    let registerSchema = yup.object({
        displayName: yup.string(),
        email: yup.string().email('Please enter a valid email.').required('Please enter your email.'),
        password: yup.string().required('Please enter your password.').max(18, 'Your password can\' be more than 18 characters.').min(8, 'Your password is too short.'),
        passwordConfirm: yup.string().oneOf([yup.ref("password"), null], 'Passwords should match.'),
        agreeToTerms: yup.boolean().oneOf([true], 'You must accept the terms and conditions.')
    });
    const registerToFirebase = async (email, password, displayName) => {
        try {
            dispatch(setLoadingScreen(true))
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if(displayName) await updateProfile(userCredential.user, {
                displayName: displayName
            });
            dispatch(setLoadingScreen(false))
        } catch (error) {
            firebaseNotification(error.code)
            dispatch(setLoadingScreen(false))
        }
    }
    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <section style={{ zIndex: 20, position: 'relative' }}>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="object-contain" src={logo} alt="logo" style={{ width: '200px' }} />
                    </a>
                    <div className="w-full bg-white rounded-lg shadow border border-white dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl flex items-center leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign up to <img className='h-6 ml-2 mr-2' src={darkMode ? logo : logoDarkText}></img> <span className='text-sm mb-2'>©</span>
                            </h1>
                            <Formik 
                                initialValues={{ displayName: '', email: '', password: '', passwordConfirm: '', agreeToTerms: false }}
                                validationSchema={registerSchema}
                                onSubmit={ values => {
                                    registerToFirebase(values.email, values.password, values.displayName)
                                }}
                            >
                                {({ handleSubmit, handleChange, values, errors, touched, handleBlur, submitCount }) => (
                                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                        <div>
                                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name <small>(Optional)</small></label>
                                            <input value={values.displayName} onChange={handleChange} onBlur={handleBlur} type='text' maxLength={32} name="displayName" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe"/>
                                            {((touched.displayName || submitCount > 0) && errors.displayName) ? <small className='text-red-500 absolute'>{errors.displayName}</small> : <></>}
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                            <input value={values.email} onChange={handleChange} onBlur={handleBlur} type="email" name="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
                                            {((touched.email || submitCount > 0) && errors.email) ? <small className='text-red-500 absolute'>{errors.email}</small> : <></>}
                                        </div>
                                        <div>
                                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                            <input value={values.password} onChange={handleChange} onBlur={handleBlur} type="password" name="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                                            {((touched.password || submitCount > 0) && errors.password) ? <small className='text-red-500  absolute'>{errors.password}</small> : <></>}
                                        </div>
                                        <div>
                                            <label htmlFor="passwordConfirm" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                                            <input value={values.passwordConfirm} onChange={handleChange} onBlur={handleBlur} type="password" name="passwordConfirm" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                                            {((touched.passwordConfirm || submitCount > 0) && errors.passwordConfirm) ? <small className='text-red-500 absolute'>{errors.passwordConfirm}</small> : <></>}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input value={values.agreeToTerms} onChange={handleChange} onBlur={handleBlur} id="agreeToTerms" aria-describedby="remeagreeToTermsmber" type="checkbox" name="agreeToTerms" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label htmlFor="agreeToTerms" className="text-gray-500 dark:text-gray-300">I agree the <a onClick={() => setPrivacyModal(true)} className='text-blue-600'>terms and conditions</a>.</label>
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full text-white bg-[#155e75] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                            Do you have an account? <Link to={'/login'} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Log in</Link>
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

            <img src={authBg} width={'100%'} height={'100vh'} style={{ objectFit: 'cover', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />

            {privacyModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            <div className="border-0 rounded-md shadow-lg relative flex flex-col w-full bg-white dark:bg-[#fcfcfc] outline-none focus:outline-none text-black">
                                <div className='p-4'>
                                    <div class="relative mx-auto max-w-[37.5rem] pt-3 text-center pb-0">
                                        <h1 class="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Privacy policy</h1><p class="mt-3 text-base leading-7 text-slate-600">Last updated on November 2, 2021</p>
                                    </div>
                                </div>
                                <div class="mx-auto p-5 rounded-md max-w-[30rem] max-h-[40vh] overflow-y-auto prose-sm prose prose-slate prose-a:font-semibold prose-a:text-sky-500 hover:prose-a:text-sky-600">
                                    <p className='text-sm font-light mb-5'>This privacy policy ("Policy") describes how Tailwind Labs Inc. ("Tailwind", "we", "us" or "our") collects, protects and uses the personally identifiable information ("Personal Information") you ("User", "you" or "your") may provide through the Tailwind UI website (tailwindui.com) or in the course of purchasing any Tailwind UI products (collectively, "Website"). The Policy also describes the choices available to you regarding our use of your Personal Information and how you can access and update this information. This Policy does not apply to the practices of companies that we do not own or control, or to individuals that we do not employ or manage.</p>
                                    <h2 className='text-lg font-bold mb-1'>Collection of personal information</h2>
                                    <p className='text-sm font-light mb-5'>We receive and store any information you knowingly provide to us when you make a purchase through the Website. Currently this is limited to your email address, which is required for you to be able to login to the Website and access any purchased Tailwind UI products.</p>
                                    <h2 className='text-lg font-bold mb-1'>Collection of non-personal information</h2>
                                    <p className='text-sm font-light mb-5'>When you visit the Website our servers automatically record information that your browser sends. This data may include information such as your device's IP address, browser type and version, operating system type and version, language preferences or the webpage you were visiting before you came to our Website, pages of our Website that you visit, the time spent on those pages, information you search for on our Website, access times and dates, and other statistics.</p>
                                    <h2 className='text-lg font-bold mb-1'>Purchases</h2>
                                    <p className='text-sm font-light mb-5'>All purchases made through the Website are processed by a third party payment processor, Paddle (<a href="https://paddle.com">paddle.com</a>). Paddle may ask you for personal and/or non-personal information, such as your name, address, email address, credit card information, or other Personal Information. Paddle has a privacy policy (<a href="https://paddle.com/legal-buyers/">paddle.com/legal-buyers/</a>) that describes their collection and use of personal information. Tailwind does not control Paddle or its collection or use of information. Any questions or concerns about Paddle’s practices should be directed to Paddle.</p>
                                    <p className='text-sm font-light mb-5'>Paddle provides us with certain non-personal information relating to purchases made by visitors to the Website. The non-personal information may include details of the purchase such as the date, amount paid, and product purchased. The non-personal purchase information may be linked to the Personal Information you provide to us (typically limited to your email address, as stated above). Paddle does not supply us with any of your other Personal Information such as your name, street address, or credit card information.</p>
                                    <h2 className='text-lg font-bold mb-1'>Managing personal information</h2>
                                    <p className='text-sm font-light mb-5'>You are able to update your Personal Information in your "Account Settings" on the Website. Currently this is limited to just your email address, as described above. You may also request that we delete your email address, but this will prevent you from accessing the products you have purchased from Tailwind.</p>
                                    <p className='text-sm font-light mb-5'>When you update information, we may maintain a copy of the unrevised information in our records. Some information may remain in our private records after deletion of such information from your account for a retention period. Once the retention period expires, Personal Information shall be deleted. Therefore, the right to access, the right to erasure, your rights to access, add to, and update your information cannot be enforced after the expiration of the retention period.</p>
                                    <p className='text-sm font-light mb-5'>We will retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements. We may use any aggregated data derived from or incorporating your Personal Information after you update or delete it, but not in a manner that would identify you personally.</p>
                                    <h2 className='text-lg font-bold mb-1'>Use and processing of collected information</h2>
                                    <p className='text-sm font-light mb-5'>Any of the information we collect from you may be used to personalize your experience; improve our Website; improve customer service; process transactions; send notification emails such as password reminders, updates, etc; and operate our Website. Non-Personal Information collected is used only to identify potential cases of abuse and establish statistical information regarding Website usage. This statistical information is not otherwise aggregated in such a way that would identify any particular user of the system.</p>
                                    <p className='text-sm font-light mb-5'>We may process Personal Information related to you if one of the following applies: (i) You have given their consent for one or more specific purposes. Note that under some legislations we may be allowed to process information until you object to such processing (by opting out), without having to rely on consent or any other of the following legal bases below. This, however, does not apply, whenever the processing of Personal Information is subject to European data protection law; (ii) Provision of information is necessary for the performance of an agreement with you and/or for any pre-contractual obligations thereof; (ii) Processing is necessary for compliance with a legal obligation to which you are subject; (iv) Processing is related to a task that is carried out in the public interest or in the exercise of official authority vested in us; (v) Processing is necessary for the purposes of the legitimate interests pursued by us or by a third party. In any case, we will be happy to clarify the specific legal basis that applies to the processing, and in particular whether the provision of Personal Data is a statutory or contractual requirement, or a requirement necessary to enter into a contract.</p>
                                    <h2 className='text-lg font-bold mb-1'>Information transfer and storage</h2>
                                    <p className='text-sm font-light mb-5'>Depending on your location, data transfers may involve transferring and storing your information in a country other than your own. You are entitled to learn about the legal basis of information transfers to a country outside the European Union or to any international organization governed by public international law or set up by two or more countries, such as the UN, and about the security measures taken by us to safeguard your information. If any such transfer takes place, you can find out more by checking the relevant sections of this document or inquire with us using the information provided in the Contact section.</p>
                                    <h2 className='text-lg font-bold mb-1'>The rights of users</h2>
                                    <p className='text-sm font-light mb-5'>You may exercise certain rights regarding your information processed by us. In particular, you have the right to do the following: (i) you have the right to withdraw consent where you have previously given your consent to the processing of your information; (ii) you have the right to object to the processing of your information if the processing is carried out on a legal basis other than consent; (iii) you have the right to learn if information is being processed by us, obtain disclosure regarding certain aspects of the processing and obtain a copy of the information undergoing processing; (iv) you have the right to verify the accuracy of your information and ask for it to be updated or corrected; (v) you have the right, under certain circumstances, to restrict the processing of your information, in which case, we will not process your information for any purpose other than storing it; (vi) you have the right, under certain circumstances, to obtain the erasure of your Personal Information from us; (vii) you have the right to receive your information in a structured, commonly used and machine readable format and, if technically feasible, to have it transmitted to another controller without any hindrance. This provision is applicable provided that your information is processed by automated means and that the processing is based on your consent, on a contract which you are part of or on pre-contractual obligations thereof.</p>
                                    <h2 className='text-lg font-bold mb-1'>The right to object to processing</h2>
                                    <p className='text-sm font-light mb-5'>Where Personal Information is processed for a public interest, in the exercise of an official authority vested in us or for the purposes of the legitimate interests pursued by us, you may object to such processing by providing a ground related to your particular situation to justify the objection. You must know that, however, should your Personal Information be processed for direct marketing purposes, you can object to that processing at any time without providing any justification. To learn whether we are processing Personal Information for direct marketing purposes, you may refer to the relevant sections of this document.</p>
                                    <h2 className='text-lg font-bold mb-1'>How to exercise these rights</h2>
                                    <p className='text-sm font-light mb-5'>Any requests to exercise User rights can be directed to the Owner by email at <a href="mailto:support@tailwindui.com">support@tailwindui.com</a>. These requests can be exercised free of charge and will be addressed by the Owner as early as possible and always within one month.</p>
                                    <h2 className='text-lg font-bold mb-1'>Privacy of children</h2>
                                    <p className='text-sm font-light mb-5'>We do not knowingly collect any Personal Information from children under the age of 13. If you are under the age of 13, please do not submit any Personal Information through our Website. We encourage parents and legal guardians to monitor their children's Internet usage and to help enforce this Policy by instructing their children never to provide Personal Information through our Website without their permission. If you have reason to believe that a child under the age of 13 has provided Personal Information to us through our Website, please contact us.</p>
                                    <h2 className='text-lg font-bold mb-1'>Newsletters</h2>
                                    <p className='text-sm font-light mb-5'>We offer electronic newsletters which you may voluntarily subscribe to. You may choose to stop receiving our newsletter or marketing emails by following the unsubscribe instructions included in these emails or by contacting us. However, you will continue to receive essential transactional emails.</p>
                                    <h2 className='text-lg font-bold mb-1'>Cookies</h2>
                                    <p className='text-sm font-light mb-5'>The Website uses "cookies" to help personalize your online experience. A cookie is a text file that is placed on your hard disk by a web page server. Cookies cannot be used to run programs or deliver viruses to your computer. Cookies are uniquely assigned to you, and can only be read by a web server in the domain that issued the cookie to you. We may use cookies to collect, store, and track information for statistical purposes to operate our Website. You have the ability to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer.</p>
                                    <p className='text-sm font-light mb-5'>In addition to using cookies and related technologies as described above, we also may permit certain third-party companies to help us tailor advertising that we think may be of interest to users and to collect and use other data about user activities on the Website. These companies may deliver ads that might also place cookies and otherwise track user behavior.</p>
                                    <h2 className='text-lg font-bold mb-1'>Links to other websites</h2>
                                    <p className='text-sm font-light mb-5'>Our Website contains links to other websites that are not owned or controlled by us. Please be aware that we are not responsible for the privacy practices of such other websites or third parties. We encourage you to be aware when you leave our Website and to read the privacy statements of each and every website that may collect Personal Information.</p>
                                    <p className='text-sm font-light mb-5'>In particular, as noted above, purchases made through the Website are handled by Paddle and all such transactions, including any Personal Information or non-personal information collected by Paddle, are under the control of Paddle. We encourage purchasers to read Paddle’s Privacy Policy (<a href="https://paddle.com/legal-buyers/">paddle.com/legal-buyers/</a>).</p>
                                    <h2 className='text-lg font-bold mb-1'>Information security</h2>
                                    <p className='text-sm font-light mb-5'>We secure information you provide on computer servers in a controlled, secure environment, protected from unauthorized access, use, or disclosure. We maintain reasonable administrative, technical, and physical safeguards in an effort to protect against unauthorized access, use, modification, and disclosure of Personal Information in its control and custody. However, no data transmission over the Internet or wireless network can be guaranteed. Therefore, while we strive to protect your Personal Information, you acknowledge that (i) there are security and privacy limitations of the Internet which are beyond our control; (ii) the security, integrity, and privacy of any and all information and data exchanged between you and our Website cannot be guaranteed; and (iii) any such information and data may be viewed or tampered with in transit by a third-party, despite best efforts.</p>
                                    <h2 className='text-lg font-bold mb-1'>Data breach</h2>
                                    <p className='text-sm font-light mb-5'>In the event we become aware that the security of the Website has been compromised or users’ Personal Information has been disclosed to unrelated third-parties as a result of external activity, including, but not limited to, security attacks or fraud, we reserve the right to take reasonably appropriate measures, including, but not limited to, investigation and reporting, as well as notification to and cooperation with law enforcement authorities. In the event of a data breach, we will make reasonable efforts to notify affected individuals if we believe that there is a reasonable risk of harm to the user as a result of the breach or if notice is otherwise required by law. When we do we will send you an email.</p>
                                    <h2 className='text-lg font-bold mb-1'>Legal disclosure</h2>
                                    <p className='text-sm font-light mb-5'>We will disclose any information we collect, use or receive if required or permitted by law, such as to comply with a subpoena, or similar legal process, and when we believe in good faith that disclosure is necessary to protect our rights, protect your safety or the safety of others, investigate fraud, or respond to a government request. In the event we go through a business transition, such as a merger or acquisition by another company, or sale of all or a portion of its assets, your user account and personal data will likely be among the assets transferred.</p>
                                    <h2 className='text-lg font-bold mb-1'>Changes and amendments</h2>
                                    <p className='text-sm font-light mb-5'>We reserve the right to modify this privacy policy relating to the Website at any time, effective upon posting of an updated version of this Policy on the Website. When we do we will revise the updated date at the bottom of this page. Continued use of the Website after any such changes shall constitute your consent to such changes.</p>
                                    <h2 className='text-lg font-bold mb-1'>Acceptance of this policy</h2>
                                    <p className='text-sm font-light mb-5'>You acknowledge that you have read this Policy and agree to all its terms and conditions. By using the Website you agree to be bound by this Policy. If you do not agree to abide by the terms of this Policy, you are not authorized to use or access the Website.</p>
                                    <h2 className='text-lg font-bold mb-1'>Contacting us</h2>
                                    <p className='text-sm font-light'>If you have any questions about this Policy, please contact us by email at <a href="mailto:support@tailwindui.com">support@tailwindui.com</a>.</p>
                                    
                                </div>
                                <div className='p-4'> 
                                    <button onClick={() => setPrivacyModal(false)} className="w-full text-white bg-[#155e75] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:hover:bg-primary-700 dark:focus:ring-primary-800">I Understand</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

        </div>
    )
}

export default Register