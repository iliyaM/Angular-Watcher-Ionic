import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

//Interfaces Classes
import { Message } from '../../interfaces/message';
import { User } from '../../interfaces/user';


//FireBase
import { AuthProvider } from '../auth/auth';
import { ApiProvider } from '../api/api';

interface OnStage {
  showId: number,
  type: string,
  episodesReleaseDate: Array<number>,
}

interface Subscriber {
  name: string,
  userId: number,
  email: string,
}


@Injectable()
export class DbProvider {

messageRef: Subscription;
subscriptionsList: Subscription;

  constructor(private afs: AngularFirestore, public authService: AuthProvider, private api:ApiProvider) { }
	//Handles on follow and pupulates 3 collections ONstage User and Subscriptions
	populateFirestore(data) {
		// Subsctiptions collections handles tv shows by id and user that subscribed to is for notifications.
		const subscriptionsDoc: AngularFirestoreDocument<Subscriber> = this.afs.doc(`subscriptions/tv-shows/${data.showId}/${data.userId}`);
		const subscriber = {
			name: data.userName,
			userId: data.userId,
			email: data.email,
		}

		//OnStage collections handles everyday queries to see what episode is on stage and status of upcoming episodes related to that show.
		const onStageDoc: AngularFirestoreDocument<OnStage> = this.afs.doc(`onStage/tv-shows/followed/${data.showName}`);
		const newOnStageShow = {
			showId: data.showId,
			showName: data.showName,
			type: data.type,
			episodesReleaseDate: data.episode.episodesReleaseDate,
			episodeNumber: data.episode.episodeNumber,
			episodeName: data.episode.name,
		}

		//User collections subscriptions handles for profile page to show what shows specific user is subscribed to.
		const userSubs: AngularFirestoreDocument<any> = this.afs.doc(`users/${data.userId}/subscriptions/${data.showName}`);
		const newSubscriptionForUser = {
			showName: data.showName,
			showId: data.showId,
		}

		//Set to DB
		subscriptionsDoc.set(subscriber);
		onStageDoc.set(newOnStageShow);
		userSubs.set(newSubscriptionForUser);

		return;
	}


	updateUser(avatar:string, userId:string, displayName:string){
		let data = {
			avatar: avatar,
			displayName: displayName,
		}
		let user = this.afs.doc(`users/${userId}/info/${userId}`); //Where to update
		user.update(data);
	}
	

	//Get subscription list.
	getMySubscriptions() {
		let api: Subscription;
		let data:Array<object> = [];

		this.authService.user.subscribe(res => {
			if(res != null) {
				this.subscriptionsList = this.afs.collection(`users/${res.userId}/subscriptions`, ref => { return ref.where('showId', '>', 0) } ).valueChanges().subscribe(res => {
			data.length = 0;
			
					res.forEach(result => {
						api = this.api.fetchTvItem(result['showId']).subscribe(res => {
				data.push(res);
						});
					});
		
				});
			} else {
				console.log('no user')
			}
	});
		return data;
	}

	removeSubscription(userId, showName, showId) {
		this.afs.doc(`subscriptions/tv-shows/${showId}/${userId}`).delete();
		this.afs.doc(`users/${userId}/subscriptions/${showName}`).delete();
	}

	getUserInfo(userId) {
		return this.afs.doc(`users/${userId}/info/${userId}`).valueChanges();
	}

	destroyMessage() {
		this.messageRef.unsubscribe();
	}

	getUserGenres(userId) {
		return this.afs.collection(`users/${userId}/subscriptions`, ref => { return ref.where('showId', '>', 0) } ).valueChanges();
	}
}
