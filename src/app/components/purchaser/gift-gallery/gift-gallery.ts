

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category, Gift, GiftUpsert } from '../../../models/gift';
import { GiftService } from '../../../services/gift-service';
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

  readonly IMAGE_BASE_URL = 'https://localhost:7006/';

  donorId = signal<number>(1); //זמי!!!
  categories: Category[] = []; // משתנה לשמירת הקטגוריות

  ngOnInit() {
    this.loadGifts();
    this.loadCategories(); // <--- קריאה חדשה
  }
  private giftService = inject(GiftService);
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
  onAdd() {
    this.selectedGift = null; // מאפסים את המתנה כדי שהטופס ייפתח ריק
    this.displayDialog = true;
  }

  // open dialog to edit gift
  onEdit(gift: Gift) {
    this.selectedGift = { ...gift };
    this.displayDialog = true;
  }

  // עדכון פונקציית השמירה
  // onSaveGift(giftData: GiftUpsert) {
  //     if (this.selectedGift) {
  //         // עדכון מתנה קיימת
  //         this.giftService.update(this.selectedGift.id, giftData).subscribe({
  //             next: () => this.handleSuccess(),
  //             error: (err) => console.error('שגיאה בעדכון', err)
  //         });
  //     } else {
  //         // הוספת מתנה חדשה - שימוש ב-BASE_URL בשרת שלך

  //         // this.giftService.add(giftData).subscribe({
  //         //     next: () => this.handleSuccess(),
  //         //     error: (err) => console.error('שגיאה בהוספה', err)
  //         // });
  //     }
  // }

  // gift-gallery.ts (או איפה שהפונקציה נמצאת)

  onSaveGift(event: { data: GiftUpsert; file: File | null }) {
    const currentDonorId = this.donorId();

    if (this.selectedGift) {
      // לוגיקה לעדכון מתנה קיימת (צריך להוסיף פונקציה כזו ב-Service שתומכת ב-FormData)
      this.giftService.updateWithFile(this.selectedGift.id, event.data, event.file).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => console.error(err)
      });
    } else {
      // הוספה
      this.giftService.addGiftToDonor(currentDonorId, event.data, event.file).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => console.error(err)
      });
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




