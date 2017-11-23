import { TvSeasonInfo } from './tv-season-information';
import { TvCreators } from './tv-creators';

export class TvItem {
	id: number;
	title: string;
	poster: string;
	first_air_date: string;
	number_of_seasons: number;
	number_of_episodes: number;
	overview: string;
	status: string;
	seasons:Array<TvSeasonInfo> = [];
	creators:Array<TvCreators> = [];
	genres:Array<object> = [];
}