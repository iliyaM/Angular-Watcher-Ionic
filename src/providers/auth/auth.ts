import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

//Firebase
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';

//rxjs
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../interfaces/user';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

@Injectable()
export class AuthProvider {

user: Observable<User>;
userCollection: AngularFirestoreCollection<User>;
userDocument: AngularFirestoreDocument<User>;
userSubscriber: Subscription;

	constructor(public http: HttpClient,private afAuth: AngularFireAuth, private afs: AngularFirestore, public toastCtrl: ToastController) {
		//Get auth data
		this.user = this.afAuth.authState.switchMap(user => {
			if(user) {
				this.updateUserData(user);
				return this.afs.doc<User>(`users/${user.uid}/info/${user.uid}`).valueChanges();
			} else {
				return Observable.of(null);
			}
		});
	}

	GimmeSomeCoffe(user) {
		console.log('Gimme Some Coffe');
		console.log(user);

		// this.afs.doc<User>(`users/${user.uid}/info/${user.uid}`).valueChanges().subscribe(res => {
		// 	if(res == null) {
		// 		//Go create a man a document in this biatch!
		// 		this.updateUserData(user);
		// 	} else {
		// 		// Allready has a record here
		// 		let toast = this.toastCtrl.create({
		// 			message: `MR ${user.displayName} Welcome back. we missed you...`,
		// 			duration: 5000
		// 		});
		// 		toast.present();
		
		// 	}
		// });
	}

	googleLogin() {
		const provider = new firebase.auth.GoogleAuthProvider();
		this.afAuth.auth.signInWithRedirect(provider).then(function() {
			// Never called because of page redirect
			// Instead, use onAuthStateChanged() to detect successful authentication
		  }).catch(function(error) {
			console.error("Authentication failed:", error);
		});
	}

	//Create data from loginProvider and navigate
	private updateUserData(userCredential) {

		//Get a refrence to the document
		this.userDocument = this.afs.doc(`users/${userCredential.uid}/info/${userCredential.uid}`);

		this.userDocument.valueChanges().subscribe(res => {

			//Can a man get a document around here?!
			if(res == null) {
				//Construct user data object
				const data: User = {
					userId: userCredential.uid,
					email: userCredential.email,
					displayName: userCredential.displayName,
					avatar: 'icon-man',
				}

				this.userDocument.set(data);

				// Make a toast for our new guest.
				let toast = this.toastCtrl.create({
					message: `I see you new around here ${data.displayName} taking you baking information it will only take a second...`,
					duration: 6000
				});
				toast.present();

			} else {
				// Allready has a record here
				let toast = this.toastCtrl.create({
					message: `MR ${userCredential.displayName} Welcome back. we missed you...`,
					duration: 6000
				});
				toast.present();
			}
		});
	}
	
	signOut() {
		this.afAuth.auth.signOut();
	}


}
