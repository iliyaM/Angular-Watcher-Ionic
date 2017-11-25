import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TvItem } from '../../interfaces/tv-item';
import { ApiProvider } from '../../providers/api/api';

//rxjs
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import { DbProvider } from '../../providers/db/db';

import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { AuthProvider } from '../../providers/auth/auth';

import * as moment  from 'moment';
import { ProfilePage } from '../profile/profile';

/**
 * Generated class for the ItemTvPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-item-tv',
  templateUrl: 'item-tv.html',
})
export class ItemTvPage {

showId:number;
tvItem:TvItem;
seasonInfo = null;

//Subsctions function vars
subscriber:Subscription;
user;
finalEpisodeSubscription:Subscription;

// Poster sized of easier use
imageSrc:string = `https://image.tmdb.org/t/p/`;
posterSizes = {
	super_small: 'w92',
	small: 'w154',
	small_medium: 'w185',
	medium: 'w342',
	large: 'w500',
	huge: 'w780',
	original: 'original'
}

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider, private db: DbProvider, public toastCtrl: ToastController, public auth: AuthProvider) {
	this.auth.user.subscribe(res => {
		this.user = res;
	});

    this.showId = navParams.get('showId');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemTvPage');
    console.log(this.showId);
    this.subscriber = this.api.fetchTvItem(this.showId).subscribe(res => this.tvItem = res);
  }

  selectSeason(seasonNumber) {
    this.api.fetchSeasonEpisodes(this.showId,seasonNumber).subscribe(res=> {
      this.seasonInfo = res;
		});
		
    setTimeout(function() {
      document.getElementById('season').scrollIntoView();
    }, 200);
  }

  followInit() {

	//Check if use loggen in
	if(this.user == null) {
		let toast = this.toastCtrl.create({
			message: 'You must be a logged in to use this feature',
			duration: 6000,
			position: 'middle',
			showCloseButton: true,
			closeButtonText: 'Ok',
			dismissOnPageChange: true,
			cssClass: "notLoggedIn",
		});
		toast.present();
		return;

	} else {

	//Check status of tvShow
	if(this.tvItem.status === "Ended") {

		let toast = this.toastCtrl.create({
			message: 'Sorry this series is over. you cannot subsribe to ended series.',
			duration: 6000,
			position: 'middle',
			showCloseButton: true,
			closeButtonText: 'Ok',
			dismissOnPageChange: true,
			cssClass: "endedSeries"
		});
		toast.present();
		return;
	}
		this.getEpisode(this.user);
	}

  }

  //Grab Series information
  getEpisode(user) {
	let episodeData = {
		episodesReleaseDate: null,
		episodeNumber: null,
		name: null,
	}

    let today = moment();
    // Grab final season number and id
    let finalSeason = this.tvItem.seasons[this.tvItem.seasons.length -1].season_number;
	let seasonId = this.tvItem.seasons[this.tvItem.seasons.length -1].id;
	
    //Query api for episode realease date.
    this.finalEpisodeSubscription = this.api.findFinalEpisode(this.tvItem.id, finalSeason).subscribe(res => {

		let date = res.episodes[0]['air_date'];


		for(var i =0; i < res.episodes.length; i ++) {
			
			console.log('Loop in Runing')
			//If all is the same day of relase the first on and the last one.
			if( res.episodes[0]['air_date'] == res.episodes[res.episodes.length - 1]['air_date']) {

				// Set Episode Release date to 0
				episodeData.episodesReleaseDate = 0; 

				console.log('Found BingeWatching Series');

				//Binge watching toast message
				let toast = this.toastCtrl.create({
					message:	`Yey binge watching series!
									All the episodes have been released at once!
									The series will still be added to your profile page for statistics. 
								`,
					duration: 6000,
					position: 'middle',
					showCloseButton: true,
					closeButtonText: 'Ok',
					dismissOnPageChange: true,
					cssClass: "bingeWatching"
				});
				toast.present();
				break;
			}

			// Check last item if its out yet.
			if( moment( res.episodes[res.episodes.length - 1]['air_date'] ) < today ) {
				console.log('Last episode has been released')

				//All episodes have been released
				let toast = this.toastCtrl.create({
					message:	`Unfortunately this season is over.. Or we dont have information about upcoming episodes.
								You can check the season info and see for yourself.
								The show will still be add to your profile page.
								`,
					duration: 6000,
					position: 'middle',
					showCloseButton: true,
					closeButtonText: 'Ok',
					dismissOnPageChange: true,
					cssClass: "seasonOver"
				});
				toast.present();

				break;
			}

			//If episode releases today
			if( moment(res.episodes[i]['air_date']).startOf('day').isSame(today.startOf('day')) ) {
				episodeData.episodesReleaseDate = res.episodes[i]['air_date'];
				episodeData.episodeNumber = res.episodes[i]['episode_number'],
				episodeData.name = res.episodes[i]['name'];
				console.log('Found today')
				break;
			}

			//If today is after episode release and before the next episode release. this is the one.
			if( moment(res.episodes[i]['air_date']) > today  && moment(res.episodes[i]['air_date']) < moment(res.episodes[i]['air_date']).add(7, 'days') ) {
				console.log('Taking episode for this week')
				episodeData.episodesReleaseDate = res.episodes[i]['air_date'];
				episodeData.episodeNumber = res.episodes[i]['episode_number'],
				episodeData.name = res.episodes[i]['name'];
				console.log(res.episodes[i]['air_date'])
				break;
			}
		}

		//Construct data object for firestore
		const data = {
			userId: user.userId,
			seasonId: seasonId,
			showName: this.tvItem.title,
			phoneNumber: user.phoneNumber,
			email: user.email,
			type: 'tvShow',
			showId: this.tvItem.id,
			userName: user.displayName,
			episode: episodeData,
		}

		let toast = this.toastCtrl.create({
			message:	`Series has been added to your personal profile page. 
						you will be notified via Email on upcoming episodes`,
			duration: 6000,
			position: 'top',
			showCloseButton: true,
			closeButtonText: 'Ok',
			dismissOnPageChange: true,
			cssClass: "subscribeSucess"
		});
		toast.present();

		//Go populate Db
		this.db.populateFirestore(data);
	});
	return;
  }

  OnDestroy () {
		this.subscriber.unsubscribe();
		this.finalEpisodeSubscription.unsubscribe();
	}
	
	navigateToProfilePage() {
		this.navCtrl.push(ProfilePage);
	}

}
