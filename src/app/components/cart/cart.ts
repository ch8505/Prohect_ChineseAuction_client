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
        console.log('Proceeding to checkout with items:', this.cartService.cartItems());
        // הוספת לוגיקה להמשך לתשלום כאן
        alert('תודה על הרכישה! (למעבר לתשלום יש להוסיף לוגיקה מתאימה)');
    }


}
