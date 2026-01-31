import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftService } from '../../services/gift-service';
import { Gift } from '../../models/gift';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-gift-catalog',
  imports: [CommonModule, CardModule, ButtonModule, TagModule,FormsModule, InputTextModule],
  templateUrl: './gift-catalog.html',
  styleUrl: './gift-catalog.scss',
})
export class GiftCatalog {

  // 
  private giftService = inject(GiftService);


  gifts = signal<Gift[]>([]);
  searchTerm = signal<string>('');


  // סיגנל מחושב שמסנן את הרשימה באופן אוטומטי
  filteredGifts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.gifts().filter(gift => 
      gift.name.toLowerCase().includes(term) || 
      gift.categoryName.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.giftService.getAll().subscribe({
      next: (data) => {
        this.gifts.set(data);
        console.log('מתנות נטענו:', data); // לבדיקה שהנתונים הגיעו
      },
      error: (err) => console.error('לא הצליח לטעון מתנות', err)
    });
  }

  addToCart(gift: Gift) {
    console.log('Adding to cart:', gift);
    // הוספת לוגיקה להוספה לעגלה כאן
  }

}
