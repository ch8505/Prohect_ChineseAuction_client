import { Gift } from './gift';
import { User } from './user';

export interface Winner {
    id: number;
    giftId: number;
    gift: Gift;
    userId: number;
    user: User;
}

//פרטי המשתמש הזוכה למתנה ספיצפית- האוביקט שחוזר 
export interface WinnerByGift {
    giftId: number;
    giftName: string;
    winnerUserId: Gift;
    winnerName:string;
    winnerEmail: string;
    totalTickets: User;
    drawDate:Date;
}

