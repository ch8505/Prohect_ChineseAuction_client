import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftService } from '../../services/gift-service';
import { Gift } from '../../models/gift';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SelectChangeEvent } from 'primeng/select';
import { CartService } from '../../services/cart/cart-service';
import { OrderItemCreateDto } from '../../models/order';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-gift-catalog',
  imports: [CommonModule, CardModule, ButtonModule, TagModule, FormsModule, InputTextModule, SelectModule,ToastModule],
  templateUrl: './gift-catalog.html',
  styleUrl: './gift-catalog.scss',
})
export class GiftCatalog {

  // 
  private giftService = inject(GiftService);
  private cartService = inject(CartService);



  gifts = signal<Gift[]>([]);
  searchTerm = signal<string>('');

  sortOptions = [
    { label: 'מהזול ליקר', value: true },  // ישלח true לפונקציה
    { label: 'מהיקר לזול', value: false } // ישלח false לפונקציה
  ];

  // סיגנל מחושב שמסנן את הרשימה באופן אוטומטי
  filteredGifts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.gifts().filter(gift =>
      gift.name.toLowerCase().includes(term) ||
      gift.categoryName.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.giftService.getAllForCatalog().subscribe({
      next: (data) => {
        this.gifts.set(data);
        console.log('מתנות נטענו:', data); // לבדיקה שהנתונים הגיעו
      },
      error: (err) => console.error('לא הצליח לטעון מתנות', err)
    });
  }
  // שימי לב לטיפוס של event: DropdownChangeEvent
  onSortPrice(event: SelectChangeEvent) {
    const asc = event.value;
    this.giftService.getAllSortedByPriceAsc(asc).subscribe({
      next: (data) => this.gifts.set(data),
      error: (err) => console.error('Error:', err)
    });
  }

  // פונקציית מיון לפי קטגוריה (קוראת לשרת)
  onSortCategory() {
    this.giftService.sortByCategory().subscribe({
      next: (data) => {
        this.gifts.set(data);
        console.log('מתנות ממוינות לפי קטגוריה:', data);
      },
      error: (err) => console.error('שגיאה במיון קטגוריה:', err)
    });
  }

  resetFilters() {
    this.searchTerm.set('');
    this.giftService.getAllForCatalog().subscribe({
      next: (data) => this.gifts.set(data),
      error: (err) => console.error('Error:', err)
    });
  }

  // פונקציה להוספת מתנה לעגלה
  addToCart(gift: Gift) {
    this.cartService.addToCart([{ giftId: gift.id, quantity: 1 }]).subscribe({
      next: () => {
        console.log('Gift added to cart:', gift);
      },
      error: (err) => {
        console.log('Error adding gift to cart:', gift);
        console.error('Error adding gift to cart:', err);
      }
    });
  }
isUserLoggedIn(): boolean {
 
  return !!localStorage.getItem('token'); 
}

}


