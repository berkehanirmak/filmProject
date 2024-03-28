import { toast } from 'react-toastify';

export const errorToastConfig = {
    type: 'warning',
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
}
export const warningToastConfig = {
    type: 'warning',
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
}
export const successToastConfig = {
    type: 'success',
    position: "top-right",
    autoClose: 6665000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
}

export const firebaseNotification = (errorcode) => {
    switch (errorcode) {
        case 'auth/email-already-in-use':
            toast("Email Already In Use!", errorToastConfig);
            break;
        case 'auth/invalid-credential': 
            toast("Invalid credentials!", errorToastConfig);
            break;
        case 'auth/wrong-password':
            toast("Wrong password. Please try again!", errorToastConfig);
            break;
        case 'auth/user-not-found':
            toast("No user found with this email. Please sign up!", errorToastConfig);
            break;
        case 'auth/too-many-requests':
            toast("Too many unsuccessful login attempts. Please try again later.", warningToastConfig);
            break;
        default:
            toast("An unknown error occurred. Please try again!", errorToastConfig);
            break;
    }
}