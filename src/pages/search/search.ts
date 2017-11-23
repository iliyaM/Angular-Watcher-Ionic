import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ApiProvider } from '../../providers/api/api';
import { ProfilePage } from '../profile/profile';
import { MediaItem } from '../../interfaces/media_item';
import { ItemTvPage } from '../item-tv/item-tv';
import { ItemMoviePage } from '../item-movie/item-movie';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
myInput;
results:Array<MediaItem>;
menuSwitcher:boolean = false;
noSearch:boolean;

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, private api: ApiProvider) {
  }

	onInput(event) {
		if(this.myInput == '') {
			this.noSearch = true;
		} else {
			this.noSearch = false;
			this.api.search(this.myInput).subscribe(res => this.results = res);
		}

	}

	navigateToMedia(mediaType, id) {
		if(mediaType == 'movie') {
			this.navCtrl.push(ItemMoviePage, {
				movieId: id
			});
		} else {
			this.navCtrl.push(ItemTvPage, {
				showId: id
			});
		}
	}

	//Profile navigation
	navigateToProfilePage() {
		this.navCtrl.push(ProfilePage);
	}
}


