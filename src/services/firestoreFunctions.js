import { collection, query, where, getDocs, doc, updateDoc, setDoc, addDoc } from "firebase/firestore";
import { auth, db } from '../services/firebaseConfig';

export const getCollectionList = () => {
    return new Promise(async (resolve) => {
        const watchlistsRef = collection(db, 'watchlists');
        const q = query(watchlistsRef, where("user", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        let result = null;
        querySnapshot.forEach((doc) => {
            result = { watchlist: JSON.parse(doc.data().movies), docid: doc.id }
        });
        if(!result) {
            // Kullanıcı ilk defa oturum açtıysa ve databasede watchlist kaydı yoksa yeni bir tane oluştur
            await addDoc(collection(db, "watchlists"), {
                movies: "[]",
                user: auth.currentUser.uid
            });
            const q = query(watchlistsRef, where("user", "==", auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                result = { watchlist: JSON.parse(doc.data().movies), docid: doc.id }
            });   
        }
        resolve(result)
    })
}

export const updateWatchlist = (docid, watchlist) => {
    return new Promise(async (resolve) => {
        const docRef = doc(db, "watchlists", docid);
        await updateDoc(docRef, {
            movies: JSON.stringify(watchlist)
        });
        resolve({ watchlist: watchlist, docid: docid })
    })
}