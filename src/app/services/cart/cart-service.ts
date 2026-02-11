import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { OrderItemCreateDto, OrderResponseDto } from '../../models/order';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth-service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7006/api/Orders'; 
  authService = inject(AuthService);

  // סיגנלים לניהול המצב
  isCartVisible = signal<boolean>(false);
  cartItems = signal<OrderResponseDto | null>(null);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user.token) {
        this.getMyCart().subscribe();
      } else {
        this.cartItems.set(null);
      }
    });
  }

  // === הנה החלק שהיה חסר וגרם לשגיאה ב-Header ===
  totalItemsCount = computed(() => {
    const cart = this.cartItems();
    if (!cart || !cart.orderItems) return 0;
    return cart.orderItems.reduce((acc, item) => acc + item.quantity, 0);
  });
  // ===============================================

  // טעינת העגלה
  getMyCart(): Observable<OrderResponseDto | null> {
    return this.http.get<OrderResponseDto>(`${this.apiUrl}/my-cart`).pipe(
      tap(cart => this.cartItems.set(cart))
    );
  }

  // מחיקת פריט
  removeOrderItem(orderId: number, orderItemId: number): Observable<void> {
/*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Add items to the cart.
   * @param items - An array of items to add to the cart.
   * @returns An observable that emits the updated cart.
   * @remarks This method adds the items to the cart and updates the cartItems signal.
   * It also sets the isCartVisible signal to true.
   */
/*******  6cc06668-65f8-453a-a0ee-067be9d842e9  *******/    if (!orderId || !orderItemId) {
        console.error('Missing ID for delete:', { orderId, orderItemId });
        return new Observable(); 
    }
    const url = `${this.apiUrl}/${orderId}/items/${orderItemId}`;
    return this.http.delete<void>(url).pipe(
      tap(() => this.getMyCart().subscribe())
    );
  }

  // הוספה לסל
  addToCart(items: OrderItemCreateDto[]): Observable<OrderResponseDto> {
    console.log(items);
    return this.http.post<OrderResponseDto>(`${this.apiUrl}`, items).pipe(
      tap((updatedCart) => {
        this.cartItems.set(updatedCart);
        this.isCartVisible.set(true);
      })
    );
  }

  // הוסף את הפונקציה הזו בתוך מחלקת CartService
updateItemQuantity(giftId: number, change: number): void {
  // יצירת אובייקט עם השינוי המבוקש (1 או -1)
  const updateItem: OrderItemCreateDto = { 
    giftId: giftId, 
    quantity: change 
  };

  // שליחה לשרת - ה-API שלך כבר יודע לבצע += לכמות הקיימת
  this.addToCart([updateItem]).subscribe({
    next: () => console.log('הכמות עודכנה בהצלחה'),
    error: (err) => console.error('שגיאה בעדכון כמות:', err)
  });
}

//add checkout
checkout(id: number): Observable<any> {
  // שולחים PUT עם גוף ריק {} כפי שהשרת מצפה
  return this.http.put<any>(`${this.apiUrl}/${id}/confirm`, {}).pipe(
    tap(() => {
      // ברגע שהצליח - מאפסים את העגלה בזיכרון של האנגולר
      this.cartItems.set(null);
      this.isCartVisible.set(false);
    })
  );
}

}