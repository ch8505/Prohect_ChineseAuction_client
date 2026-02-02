import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Donor, DonorUpsert } from '../models/donor';
@Injectable({
  providedIn: 'root',
})
export class DonorService {
  private readonly BASE_URL = 'https://localhost:7006/api/Donor';

  private http = inject(HttpClient);

  /** ===================== CRUD ===================== */
//  שליפת כל המתנות עבור תורם
getAll(): Observable<Donor[]> {
    return this.http.get<Donor[]>(`${this.BASE_URL}`); 
  }

  //  שליפת מתנה בודדת לפי ID
  // getById(id: number): Observable<Gift> {
  //   return this.http.get<Gift>(`${this.BASE_URL}/${id}`);
  // }
  // !!!רצינו להעביר לתורמים
  //  הוספת מתנה חדשה
  // add(gift: GiftUpsert): Observable<Gift> {
  //   return this.http.post<Gift>(`${this.BASE_URL}/admin/add-to-donor/${gift.donorId}`, gift);
  // }
  //add donor
create(donor: DonorUpsert): Observable<Donor> {
    // שולחים POST לכתובת הבסיס עם הנתונים בגוף הבקשה
    return this.http.post<Donor>(this.BASE_URL, donor);
  }


  //  עדכון תורם קיימת
  update(id: number, donor: DonorUpsert): Observable<Donor> {
    console.log('שולח עדכון לשרת עבור ID:', id, donor);
    return this.http.put<Donor>(`${this.BASE_URL}/${id}`, donor);
  }

  // מחיקת מתנה לפי ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }

}



  



