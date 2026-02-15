import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { DialogModule } from 'primeng/dialog';
import { DonorService } from '../../../services/donor-service';
import { Donor, DonorUpsert } from '../../../models/donor';
import { DonorForm } from '../donor-form/donor-form';
import { GiftService } from '../../../services/gift-service';
import { GiftFormComponent } from '../../gift-form/gift-form';
import { Category, GiftSubmission, GiftUpsert } from '../../../models/gift';

@Component({
  selector: 'app-management-donor',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, DialogModule, DonorForm, GiftFormComponent],
  templateUrl: './management-donor.html',
  styleUrl: './management-donor.scss',
})
export class ManagementDonor implements OnInit {

  private donorService = inject(DonorService);

  listOfDonors: Donor[] = [];
  selectedDonor: Donor | null = null;
  displayDialog: boolean = false;
  // מתנה
  displayGiftDialog: boolean = false;
  selectedDonorForGift: Donor | null = null;
  categories: Category[] = [];
  private giftService = inject(GiftService);

  ngOnInit() {
    this.loadDonors();
    this.loadCategories();
  }

  loadCategories() {
    this.giftService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('שגיאה בטעינת קטגוריות:', err)
    });
  }

  // openGiftDialog(donor: Donor) {
  //   this.selectedDonorForGift = donor;
  //   this.displayGiftDialog = true;
  // }

  // addGiftToDonor(gift: GiftUpsert) {
  //   // מוסיף donorId לאובייקט המתנה
  //   const giftWithDonor = { ...gift, donorId: this.selectedDonorForGift?.id };
  //   this.giftService.add(giftWithDonor).subscribe({
  //     next: () => {
  //       this.displayGiftDialog = false;
  //       alert('המתנה נוספה בהצלחה!');
  //     },
  //     error: (err) => {
  //       alert('שגיאה בהוספת מתנה: ' + (err?.error?.message || err.message));
  //     }
  //   });
  // }

  // פונקציה לפתיחת הדיאלוג
  openGiftDialog(donor: Donor) {
    this.selectedDonorForGift = donor;
    this.displayGiftDialog = true;
  }

  // הפונקציה שמקבלת את הנתונים מהטופס
  addGiftToDonor(event: GiftSubmission) {
    const donorId = this.selectedDonorForGift?.id;

    if (!donorId) {
      alert('שגיאה: לא נבחר תורם');
      return;
    }

    // שליחה ל-Service (שכבר תיקנו קודם לתמוך ב-File)
    this.giftService.addGiftToDonor(donorId, event.data, event.file).subscribe({
      next: () => {
        this.displayGiftDialog = false;
        alert('המתנה נוספה בהצלחה לתורם!');
        // אופציונלי: רענון רשימת התורמים או רשימת המתנות שלהם
      },
      error: (err) => {
        console.error('שגיאה בהוספת מתנה:', err);
        alert('שגיאה: ' + (err.error?.message || 'נכשל'));
      }
    });
  }


  loadDonors() {
    this.donorService.getAll().subscribe({
      next: (data) => this.listOfDonors = data,
      error: (err) => console.error('שגיאה בטעינה:', err)
    });
  }

  // פונקציה להוספה חדשה - מאפסת את הבחירה
  openNew() {
    this.selectedDonor = null;
    this.displayDialog = true;
  }

  // פונקציה לעריכה - מגדירה את התורם שנבחר
  onEdit(donor: Donor) {
    this.selectedDonor = donor;
    this.displayDialog = true;
  }

  // פונקציה חכמה שמחליטה אם לעדכן או ליצור
  saveDonor(donorData: DonorUpsert) {
    if (this.selectedDonor && this.selectedDonor.id) {
      // === עדכון קיים ===
      this.donorService.update(this.selectedDonor.id, donorData).subscribe({
        next: () => {
          this.loadDonors();
          this.displayDialog = false;
        },
        error: (err) => console.error('שגיאה בעדכון:', err)
      });
    } else {
      // === יצירה חדשה ===
      // ודאי שב-DonorService יש לך פונקציית create שמקבלת DonorUpsert
      this.donorService.create(donorData).subscribe({
        next: () => {
          this.loadDonors();
          this.displayDialog = false;
        },
        error: (err) => console.error('שגיאה ביצירה:', err)
      });
    }
  }

  delete(id: number) {
    if (confirm('למחוק?')) {
      this.donorService.delete(id).subscribe(() => this.loadDonors());
    }
  }

}