import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WinnerByGift } from '../models/winner';

@Injectable({
  providedIn: 'root',
})
export class LotterySerice {

  private readonly BASE_URL = 'https://localhost:7006/api/Lottery/draw';

  private http = inject(HttpClient);

  drawByGiftId(id: number): Observable<WinnerByGift> {
    return this.http.get<WinnerByGift>(`${this.BASE_URL}/${id}`);
  }
  
}
