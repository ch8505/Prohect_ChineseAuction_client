
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category, Gift, GiftUpsert } from '../../../models/gift';
import { GiftService } from '../../../services/gift-service';
import { LotterySerice } from '../../../services/lottery-serice';
import { GiftFormComponent } from '../../gift-form/gift-form';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';



@Component({
  selector: 'app-gift-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule, GiftFormComponent, ButtonModule, DialogModule, TableModule],
  templateUrl: './gift-gallery.html',
  styleUrl: './gift-gallery.scss',
})
export class GiftGallery implements OnInit {


  categories: Category[] = []; // משתנה לשמירת הקטגוריות

  ngOnInit() {
    this.loadGifts();
    this.loadCategories(); // <--- קריאה חדשה
  }
  private giftService = inject(GiftService);
  private lotteryService = inject(LotterySerice);


  listOfGifts: Gift[] = [];
  selectedGift: Gift | null = null;
  displayDialog: boolean = false;

  //get all categories
  loadCategories() {
    this.giftService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('קטגוריות נטענו:', data); // לבדיקה שהנתונים הגיעו
      },
      error: (err) => console.error('לא הצליח לטעון קטגוריות', err)
    });
  }


  //get all gifts
  loadGifts() {
    this.giftService.getAll().subscribe({
      next: data => {
        this.listOfGifts = data;
        console.log('מתנות נטענו:', data); // לבדיקה שהנתונים הגיעו
      },
      error: err => console.error('Failed to load gifts', err)
    });
  }

  //להוסיף מתנה
  onAdd() {
    this.selectedGift = null; // מאפסים את המתנה כדי שהטופס ייפתח ריק
    this.displayDialog = true;
  }
  // open dialog to edit gift
  onEdit(gift: Gift) {
    this.selectedGift = gift;
    this.displayDialog = true;
  }

  lottery(giftId: number) {
    console.log("פונקציית הגרלה מניהול מתנות");
    if (confirm('האם אתה בטוח שברצונך להגריל מתנה זו?')) {
      this.lotteryService.drawByGiftId(giftId).subscribe(() => {
        this.listOfGifts = this.listOfGifts.filter(g => g.id !== giftId); ///לבדוק אם צריך לרענן
      });
    }
  }

  // עדכון פונקציית השמירה
  onSaveGift(giftData: GiftUpsert) {
    if (this.selectedGift) {
      // עדכון מתנה קיימת
      this.giftService.update(this.selectedGift.id, giftData).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => console.error('שגיאה בעדכון', err)
      });
    } else {
      // הוספת מתנה חדשה - שימוש ב-BASE_URL בשרת שלך

      // this.giftService.add(giftData).subscribe({
      //     next: () => this.handleSuccess(),
      //     error: (err) => console.error('שגיאה בהוספה', err)
      // });
    }
  }
  private handleSuccess() {
    this.loadGifts();
    this.closeDialog();
  }

  closeDialog() {
    this.displayDialog = false;
    this.selectedGift = null;
  }
  //delete gift
  delete(id: number) {
    if (confirm('האם אתה בטוח שברצונך למחוק?')) {
      this.giftService.delete(id).subscribe(() => {
        this.listOfGifts = this.listOfGifts.filter(g => g.id !== id);
      });
    }
  }
}




