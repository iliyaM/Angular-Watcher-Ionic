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

@Injectable()
export class AuthProvider {

user: Observable<User>;
userCollection: AngularFirestoreCollection<User>;
userDocument: AngularFirestoreDocument<User>;
userSubscriber: Subscription;

	constructor(public http: HttpClient,private afAuth: AngularFireAuth, private afs: AngularFirestore) {
	// Get auth data
	this.user = this.afAuth.authState.switchMap(user => {
		if(user) {
			return this.afs.doc<User>(`users/${user.uid}/info/${user.uid}`).valueChanges();
		} else {
			return Observable.of(null);
		}
	});
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  //Pass any provider
  private oAuthLogin(provider) { 
    return this.afAuth.auth.signInWithPopup(provider).then((credential) => {
      this.updateUserData(credential.user);
    });
  }

  //Create data from loginProvider and navigate
  private updateUserData(userCredential) {
	
		//Construct user data object
		const data: User = {
		  userId: userCredential.uid,
		  email: userCredential.email,
		  displayName: userCredential.displayName,
		  avatar: 'icon-man',
		}
	
		//Get user document
		this.userDocument = this.afs.doc(`users/${userCredential.uid}/info/${userCredential.uid}`);
	
		//Check if exists.
		this.userSubscriber = this.userDocument.valueChanges().subscribe(res => {
		  if(res == null) {
			console.log('Not User CREATING');
			this.userDocument.set(data);
		  } else {
			console.log('Found Document Exiting');
			return;
		  }
		});
	  }
	
	signOut() {
		this.afAuth.auth.signOut();
	}


}
