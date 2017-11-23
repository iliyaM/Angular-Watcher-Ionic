import { User } from './user';

export class Message {
    episodeNumber: number;
    showName: string;
    episodeName: string;
    showId: number;
    linkingWord: string;
    users:Array<User[]>;
}