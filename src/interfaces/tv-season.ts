import { TvEpisode } from './tv-episode';

export class TvSeason {
	id: string;
	name: string;
	release_data: string;
	poster: string;
	overview: string;
	episodes: Array<TvEpisode> = [];
}



/*
 
Season information
release of the season
id of the season
name of the season
image of the season
overview of the season


episodes of the season (in the same call) array

	release date of the episode
	crew of the episodes
	episode number
	id of the episodes
	name of the episdose
	oeverview of the episode.
	image of the episode.


*/