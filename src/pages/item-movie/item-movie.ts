import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { MovieItem } from '../../interfaces/movie-item';
import { ApiProvider } from '../../providers/api/api';
/**
 * Generated class for the ItemMoviePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-item-movie',
  templateUrl: 'item-movie.html',
})
export class ItemMoviePage {
movieId:number;
subscriber:Subscription;
safeUrlYoutube;
MovieItem:MovieItem;

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider) {
    this.movieId = navParams.get('movieId');
  }

  ionViewDidLoad() {
    this.subscriber = this.api.fetchMovieItem(this.movieId).subscribe(res => {
      this.MovieItem = res;
    });
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }
}
