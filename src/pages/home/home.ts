import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Subscription } from 'rxjs/Subscription';

//Providers
import { ApiProvider } from '../../providers/api/api';

//pages
import { ItemTvPage } from '../item-tv/item-tv';
import { ItemMoviePage } from '../item-movie/item-movie';
import { ProfilePage } from '../profile/profile';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
tvList;
movieList;
mediaListSubscription:Subscription;

posterSizes = {
  super_small: 'w92',
  small: 'w154',
  small_medium: 'w185',
  medium: 'w342',
  large: 'w500',
  huge: 'w780',
  original: 'original'
}

imageSrc:string = `https://image.tmdb.org/t/p/${this.posterSizes.small}`;

  constructor(public navCtrl: NavController, public api: ApiProvider, public auth: AuthProvider) { 
    this.mediaListSubscription = this.api.getTopTen().subscribe(data => {
      this.tvList = this.api.getTvCustomData(data[0].results);
      this.movieList = this.api.getMovieCustomData(data[1].results);
    });
  }

  ngOnDestroy() {
    this.mediaListSubscription.unsubscribe();
  }

  navigateToTvItem(showId) {
    this.navCtrl.push(ItemTvPage, {
      showId: showId
    });
  }

  navigateToMovieItem(movieId) {
    this.navCtrl.push(ItemMoviePage, {
      movieId: movieId
    });
  }

  navigateToProfilePage() {
		this.navCtrl.push(ProfilePage);
	}

}
