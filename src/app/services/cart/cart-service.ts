// import { HttpClient } from '@angular/common/http';
// import { computed, inject, Injectable, signal } from '@angular/core';
// import { OrderItemCreateDto, OrderItemResponseDto, OrderResponseDto } from '../../models/order';
// import { map, Observable, tap } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class CartService {

//   private http = inject(HttpClient);
//   private apiUrl = 'https://localhost:7006/api/Orders';


//   isCartVisible = signal<boolean>(false);   // סיגנל לשליטה על נראות העגלה מכל מקום באפליקציה
//   cartItems = signal<OrderResponseDto | null>(null);  // אחסון פריטי העגלה

//   // cartItems = signal<OrderResponseDto[]>([]);

//   // constructor() {
//   //   // ברגע שהאפליקציה עולה, אם המשתמש מחובר - נביא את העגלה
//   //   this.loadCart();
//   // }

//   constructor() {
//     const token = localStorage.getItem('token');
//     console.log('CartService נוצר! האם יש טוקן?', !!token); // בדיקה

//     if (token) {
//       this.getMyCart().subscribe({
//         next: (res) => console.log('הצלחה בטעינת עגלה:', res),
//         error: (err) => console.error('שגיאה בטעינת עגלה:', err)
//       });
//     }
//     else {
//       console.log('אין טוקן, לא נטען עגלה');
//     }
//   }

//   // סיגנל מחושב לכמות הפריטים - יתעדכן לבד כשהעגלה משתנה
//   totalItemsCount = computed(() => {
//     const cart = this.cartItems();
//     if (!cart || !cart.orderItems) return 0;
//     return cart.orderItems.reduce((acc, item) => acc + item.quantity, 0);
//   });


//   // פונקציה מרכזית לטעינת העגלה
//   loadCart() {
//     if (localStorage.getItem('token')) {
//       this.http.get<OrderResponseDto>(`${this.apiUrl}/my-cart`).subscribe({
//         next: (cart) => this.cartItems.set(cart),
//         error: (err) => console.error('Failed to load cart', err)
//       });
//     } else {
//       this.cartItems.set(null); // איפוס אם אין טוקן
//       alert('משתמש לא מחובר, לא ניתן לטעון עגלה');
//     }
//   }

//   // פונקציה לקבלת העגלה שלי מהשרת
//   getMyCart(): Observable<OrderResponseDto> {
//     return this.http.get<OrderResponseDto>(`${this.apiUrl}/my-cart`).pipe(
//       tap(cart => this.cartItems.set(cart))
//     );
//   }

//   // פונקציה להוספת פריטים לעגלה
//   addToCart(items: OrderItemCreateDto[]): Observable<OrderResponseDto> {
//     return this.http.post<OrderResponseDto>(`${this.apiUrl}`, items).pipe(
//       tap((updatedCart) => {
//         // 1. מעדכנים את הסיגנל עם הנתונים החדשים שהשרת החזיר
//         this.cartItems.set(updatedCart);
//         // 2. פותחים את העגלה אוטומטית
//         this.isCartVisible.set(true);
//       })
//     );
//   }

//   // addToCart(items: OrderItemCreateDto[]): Observable<OrderResponseDto[]> {
//   //   console.log('מנסה  לשלוח לשרת:', items);
//   //   return this.http.post<OrderResponseDto[]>(`${this.apiUrl}`, items).pipe(
//   //     tap(() => this.getMyCart().subscribe())
//   //   );
//   // }

// }


import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { OrderItemCreateDto, OrderResponseDto } from '../../models/order';
import { map, Observable, tap } from 'rxjs';
import { AuthService } from '../auth-service';


@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7006/api/Orders';

  authService = inject(AuthService)

  isCartVisible = signal<boolean>(false);
  cartItems = signal<OrderResponseDto | null>(null);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser(); // מאזין לשינויים במצב המשתמש

      if (user.token) {
        this.getMyCart().subscribe();  // אם יש טוקן (משתמש התחבר עכשיו או היה מחובר) - טען עגלה

      } else {
        this.cartItems.set(null);  // אם אין טוקן (לוגאוט) - נקה את העגלה מהמסך מיידית
      }
    });
  }

  totalItemsCount = computed(() => {
    const cart = this.cartItems();
    if (!cart || !cart.orderItems) return 0;
    return cart.orderItems.reduce((acc, item) => acc + item.quantity, 0);
  });

  // ה-Observable עכשיו מחזיר אובייקט בודד ישירות
  getMyCart(): Observable<OrderResponseDto | null> {
    return this.http.get<OrderResponseDto>(`${this.apiUrl}/my-cart`).pipe(
      tap(cart => this.cartItems.set(cart))
    );
  }

  // פונקציית עזר ל-Header
  loadCart() {
    this.getMyCart().subscribe();
  }

  // פונקציה להוספת פריטים לעגלה
  addToCart(items: OrderItemCreateDto[]): Observable<OrderResponseDto> {
    return this.http.post<OrderResponseDto>(`${this.apiUrl}`, items).pipe(
      tap((updatedCart) => {
        this.cartItems.set(updatedCart);
        this.isCartVisible.set(true);
      })
    );
  }
}