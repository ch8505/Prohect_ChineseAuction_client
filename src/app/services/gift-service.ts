// 



import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, Gift, GiftUpsert } from '../models/gift';

@Injectable({
  providedIn: 'root',
})
export class GiftService {

  private readonly BASE_URL = 'https://localhost:7006/api/Gift';

  private http = inject(HttpClient);

  /** ===================== CRUD ===================== */

  /** ===================== USER ===================== */



  // שליפת כל המתנות עבור קטלןג מתנות
  getAllForCatalog(): Observable<Gift[]> {
    return this.http.get<Gift[]>(`${this.BASE_URL}`);
  }

  //שליפת כל המתנות ממוין לפי מחיר עולה
  getAllSortedByPriceAsc(asc: boolean): Observable<Gift[]> {
    return this.http.get<Gift[]>(`${this.BASE_URL}/sort-by-price?asc=${asc}`);
  }

  //שליפת כל המתנות ממוין לפי קטגוריה
  sortByCategory(): Observable<Gift[]> {
    return this.http.get<Gift[]>(`${this.BASE_URL}/sort-by-category`);
  }


  /** ===================== ADMINE ===================== */


  //  שליפת כל המתנות עבור מנהל
  getAll(): Observable<Gift[]> {
    return this.http.get<Gift[]>(`${this.BASE_URL}/admin`);
  }



  //  שליפת מתנה בודדת לפי ID
  getById(id: number): Observable<Gift> {
    return this.http.get<Gift>(`${this.BASE_URL}/${id}`);
  }
  // !!!רצינו להעביר לתורמים
  //  הוספת מתנה חדשה
  // add(gift: GiftUpsert): Observable<Gift> {
  //   return this.http.post<Gift>(`${this.BASE_URL}/admin/add-to-donor/${gift.donorId}`, gift);
  // }

  //  עדכון מתנה קיימת
  update(id: number, gift: GiftUpsert): Observable<Gift> {
    console.log('שולח עדכון לשרת עבור ID:', id, gift);
    return this.http.put<Gift>(`${this.BASE_URL}/${id}`, gift);
  }

  //  מחיקת מתנה לפי ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }
  /** ===================== תוספות של קריאות ===================== */
  //get all catergories

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`https://localhost:7006/api/Category`);
  }
}

