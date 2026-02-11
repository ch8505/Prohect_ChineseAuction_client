import { Component, inject, OnInit, signal } from '@angular/core';
import { CartService } from '../../services/cart/cart-service';
import { ButtonModule } from 'primeng/button';
import { OrderResponseDto } from '../../models/order';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-cart',
    imports: [CommonModule, DrawerModule, ButtonModule],
    templateUrl: './cart.html',
    styleUrl: './cart.scss',
})
export class Cart  {

    cartService = inject(CartService);

    // ngOnInit(): void {
    //     // טעינה ראשונית של העגלה כשהאפליקציה עולה
    //     this.cartService.getMyCart().subscribe();
    // }

    //פונקציה לפתיחת וסגירת העגלה
    toggleCart() {
        this.cartService.isCartVisible.update(prev => !prev);
        if (this.cartService.isCartVisible()) {
            this.cartService.getMyCart().subscribe();
        }
    }

checkout() {
  const currentCart = this.cartService.cartItems();
  
  // בדיקה שיש ID תקין (השתמשי ב-$any אם יש בעיית אותיות גדולות/קטנות)
  const orderId = currentCart?.id || (currentCart as any)?.Id;

  if (!orderId) {
    console.error('לא נמצא ID להזמנה');
    return;
  }

  this.cartService.checkout(orderId).subscribe({
    next: (response) => {
      // response.message יכיל את "הרכישה בוצעה בהצלחה!" מהשרת
      alert(response.message || 'הרכישה בוצעה בהצלחה!');
    },
    error: (err) => {
      console.error('שגיאה באישור ההזמנה:', err);
      // אם השרת זרק throw new InvalidOperationException, זה יגיע לכאן
      alert('ארעה שגיאה: ' + (err.error?.message || 'לא ניתן לאשר את ההזמנה'));
    }
  });
}


}
