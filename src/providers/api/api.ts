import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

//Rxjs
import { Observable } from 'rxjs/Observable';


import 'rxjs/add/operator/map';
import * as Rx from "rxjs/Rx";

//Interfaces
import { TvShow } from '../../interfaces/tv-show';
import { Movie } from '../../interfaces/movie';
import { MovieItem } from '../../interfaces/movie-item';
import { TvItem } from '../../interfaces/tv-item';
import { TvSeasonInfo } from '../../interfaces/tv-season-information';
import { TvSeason } from '../../interfaces/tv-season';
import { TvEpisode } from '../../interfaces/tv-episode';
import { TvCreators } from '../../interfaces/tv-creators';
import { MediaItem } from '../../interfaces/media_item';

@Injectable()
export class ApiProvider {

  private base_url:string = 'https://api.themoviedb.org/3';
  private apikey: string = '?api_key=ebbcc2bbea6a3127c6715e6d4e044f66';

  constructor(public http: Http) { }

  /*
   * Initial Page load Batch call for popular on tv and movie
  */
  getTopTen() {
    return Rx.Observable.forkJoin(
        this.http.get(`${this.base_url}/tv/popular${this.apikey}&language=en-US&page=1&`).map((res:Response) => res.json()),
        this.http.get(`${this.base_url}/movie/now_playing${this.apikey}&language=en-US&page=1&`).map((res:Response) => res.json())
      )
  }

  /*
   * Extract Information from popular tv and movie and return
  */
  getTvCustomData(data) {
    let object:Array<TvShow> = [];

    data.forEach(result => {

      let custom = {
        title: result.name,
        vote_count : result.vote_count,
        posters :  result.poster_path,
        overview : result.overview,
        genre_ids :  result.genre_ids,
        id :  result.id,
        release_date : result.first_air_date,
      }
      object.push(custom)
    });
    return object;
  }

  getMovieCustomData(data) {
     let object:Array<Movie> = [];

     data.forEach(result => {
       let custom = {
         title: result.title,
         vote_count : result.vote_count,
         posters :  result.poster_path,
         overview : result.overview,
         genre_ids :  result.genre_ids,
         id :  result.id,
         release_date : result.release_date,
       }
       object.push(custom)
     });
     return object;
  }
  fetchTvItem(itemId) {

		let data = this.http.get(`${this.base_url}/tv/${itemId}${this.apikey}&language=en-US&page=1&`).map(res => res.json());
		let mainObject = new TvItem();

		data.forEach(res => {
			mainObject.id =  res.id;
			mainObject.title =  res.name;
			mainObject.poster =  res.backdrop_path;
			mainObject.first_air_date =  res.first_air_date;
			mainObject.number_of_seasons =  res.number_of_seasons;
			mainObject.number_of_episodes =  res.number_of_episodes;
			mainObject.overview =  res.overview;
			mainObject.status =  res.status;


			mainObject.genres.push(res.genres);


			//Construct Seasons
			res.seasons.forEach(season =>{
			let object = new TvSeasonInfo();

			object.id = season.id;
			object.season_number = season.season_number;
			object.episode_count = season.episode_count;
			object.poster = season.poster_path;
			
			mainObject.seasons.push(object)
			});

			//Construct Creators
			res.created_by.forEach(creators => {
			let Creators = new TvCreators();

			Creators.creator_id =  creators.id;
			Creators.name =  creators.name;
			Creators.profile_poster =  creators.profile_path;

			mainObject.creators.push(Creators)
			});
		});

		//Create observable from consctucted data
		let observable = Observable.create(observer => {
			observer.next(mainObject);
			observer.complete(console.log('Observerble TvItem completed'));
			observer.error(new Error("error TvItem"));
		});

		return observable;
	}
    
	fetchMovieItem(movieId) {
		let movie = new MovieItem();

		let data = this.http.get(`${this.base_url}/movie/${movieId}${this.apikey}&append_to_response=videos,images&include_image_language=en`).map(res => res.json());

		data.forEach(result => {
			movie.backdrop = result.backdrop_path;
			movie.release_date = result.release_date;
			movie.main_image = result.poster_path;
			movie.title = result.title;
			movie.vote_count = result.vote_count;
			movie.status = result.status;
			movie.id = result.id;
			movie.overview = result.overview;

			result.images.posters.forEach(poster => {
			movie.images.push(poster.file_path);
			});

			result.videos.results.forEach(video => {
			let videoItem = {
				key: video.key,
				name: video.name,
			};
			movie.videos.push(videoItem);
			});
		});

		//Create custom observable and subscribe in component.
		let observable = Observable.create(observer => {
			observer.next(movie);
			observer.complete(console.log('Movie Completed'));
			observer.error(new Error("error"));
		});

		return observable;
	}

		/*
	* Get episodes to related season by item-id and season n
	* Extracting information from data
	* Creating custom observable and returning
	*/
	fetchSeasonEpisodes(itemId, number) {
	let season =  new TvSeason();

	let data = this.http.get(`${this.base_url}/tv/${itemId}/season/${number}${this.apikey}&language=en-US&page=1&`).map(res => res.json());
	data.forEach(res => {
		season.id = res.id;
		season.name = res.name;
		season.release_data = res.air_date;
		season.poster = res.poster_path;
		season.overview = res.overview;

		res.episodes.forEach(res => {
		let episode = new TvEpisode();

		episode.id = res.id,
		episode.name  = res.name,
		episode.release_date  = res.air_date,
		episode.poster  = res.still_path,
		episode.overview = res.overview,
		episode.number = res.episode_number;

		season.episodes.push(episode);
		});
	});

	//Create custom observable and subscribe in component.
	let observable = Observable.create(observer => {
		observer.next(season);
		observer.complete(console.log('completed'));
		observer.error(new Error("error"));
	});

	return observable;
	}

	/**
	 * Query api based on type. return back and create obserable with image handling.
	 */
	search(queryString:string) {
	let array:Array<MediaItem>=[];
	let data:Observable<any> = this.http.get(`${this.base_url}/search/multi${this.apikey}&language=en-US&query=${queryString}`).map(res => res.json());
	data.forEach(object => {
		object.results.forEach(data => {
		if(data.media_type == "person") {
			return
		} else {
			let object = new MediaItem();
			
			if(data.name) {
			object.name = data.name;
			}
			else if(data.title) {
			object.name = data.title;
			}

			object.poster_path = data.poster_path;
			object.media_type = data.media_type;
			object.id = data.id;
			array.push(object);
		}

		
		});
	});

	//Create custom observable and subscribe in component.
	let observable = Observable.create(observer => {
		observer.next(array);
		observer.complete(console.log('completed'));
		observer.error(new Error("error"));
	});

	return observable;
	}


	//FindFinalEpisode
	findFinalEpisode(itemid, seasonNumber) {
	let data = this.http.get(`${this.base_url}/tv/${itemid}/season/${seasonNumber}${this.apikey}&language=en-US&page=1&`).map(res => res.json())
	return data;
	}

	//Find genres by list of TV items

	getGenres(idsArray) {
	let customChartData = {
		labels: [],
		data: [0,0,0,0,0,0,0,0,0,0,0],
	};

	for(let i = 0; i < idsArray.length; i++) {
		let data = this.http.get(`${this.base_url}/tv/${idsArray[i]}${this.apikey}&language=en-US&page=1&`).map(res => res.json());

		data.forEach(result => {
		result.genres.forEach(genre => {

			console.log(genre.name)

			if(customChartData.data[customChartData.labels.indexOf(genre.name)] == null ) {
			customChartData.labels.push(genre.name);
			console.log('No index of that name. CREATING');
			}

			customChartData.data[customChartData.labels.indexOf(genre.name)] ++ ;

		});
		});
	}

	console.log(customChartData.labels);

	//Create custom observable and subscribe in component.
	let observable = Observable.create(observer => {
		observer.next(customChartData);
		observer.complete(console.log('completed'));
		observer.error(new Error("error"));
	});

	return observable;
	}



}
