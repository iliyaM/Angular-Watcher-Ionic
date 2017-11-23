import { Movie } from './movie';

export class MovieItem extends Movie {
    videos: Array<object> = [];
    images: Array<string> = [];
    status: string;
    main_image: string;
    backdrop: string;
}


