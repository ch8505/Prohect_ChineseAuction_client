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
@Component({
  selector: 'app-gift-catalog',
  imports: [CommonModule, CardModule, ButtonModule, TagModule, FormsModule, InputTextModule, SelectModule],
  templateUrl: './gift-catalog.html',
  styleUrl: './gift-catalog.scss',
})
export class GiftCatalog {

  // 
  private giftService = inject(GiftService);


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

  addToCart(gift: Gift) {
    console.log('Adding to cart:', gift);
    // הוספת לוגיקה להוספה לעגלה כאן
  }

}
