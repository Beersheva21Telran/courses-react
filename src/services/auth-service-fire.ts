import AuthService from "./auth-service";
import {getAuth, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {authState} from 'rxfire/auth';
import {from, Observable} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import { LoginData } from "../models/common/login-data";
import { nonAuthorizedUser, UserData } from "../models/common/user-data";
import { collectionData } from "rxfire/firestore";
import appFire from "../config/fire-config";
import { collection, CollectionReference, doc, DocumentReference, DocumentSnapshot, getDoc, getFirestore } from "firebase/firestore";
export default class AuthServiceFire implements AuthService {
    private authFire = getAuth(appFire);
    private collectionAuth: CollectionReference;
    constructor(private collectionAdministrators: string) {
        this.collectionAuth = collection(getFirestore(appFire), this.collectionAdministrators);
    };
    async isAdmin(id?: string): Promise<boolean> {
        if (!id) {
            return false;
        }

        const docRef: DocumentReference = doc(this.collectionAuth, id);
        const docSnap: DocumentSnapshot = await getDoc(docRef);

        return docSnap.exists();
    }

    getUserData(): Observable<UserData> {
        return authState(this.authFire)
            .pipe ( mergeMap(user => from(this.isAdmin(user?.uid))
                .pipe(map((isAdmin) => {
                    if (!!user) {
                        return {
                            username: user.uid,
                            displayName: user.displayName ?? user.email!,
                            isAdmin: isAdmin
                        };
                    }

                    return nonAuthorizedUser;
                }))
            ));
    }
    login(loginData: LoginData): Promise<boolean> {
        return signInWithEmailAndPassword(this.authFire, loginData.email, loginData.password)
        .then(()=>true).catch(()=>false);
    }
    logout(): Promise<boolean> {
        return signOut(this.authFire).then(()=>true).catch(()=>false);
    }
    
}