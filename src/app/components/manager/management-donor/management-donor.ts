import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms'; // חובה בשביל ngModel
import { InputTextModule } from 'primeng/inputtext'; // עיצוב אינפוטים
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { DonorService } from '../../../services/donor-service';
import { Donor, DonorUpsert } from '../../../models/donor';
import { DonorForm } from '../donor-form/donor-form';

@Component({
  selector: 'app-management-donor',
  standalone: true,
  // הוספתי את המודולים החדשים כאן למטה:
  imports: [CommonModule, ButtonModule, TableModule, DialogModule, DonorForm, FormsModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './management-donor.html',
  styleUrl: './management-donor.scss',
})
export class ManagementDonor implements OnInit {
  
  private donorService = inject(DonorService);
  
  listOfDonors: Donor[] = [];
  selectedDonor: Donor | null = null;
  displayDialog: boolean = false;

  // משתנים לחיפוש
  searchName: string = '';
  searchEmail: string = '';

  ngOnInit() {
    this.loadDonors();
  }

  loadDonors() {
    this.donorService.getAll().subscribe({
      next: (data) => this.listOfDonors = data,
      error: (err) => console.error('שגיאה בטעינה:', err)
    });
  }

  // === פונקציית החיפוש החדשה ===
  performSearch() {
    // אם שדה השם מלא - חפש לפי שם
    if (this.searchName && this.searchName.trim() !== '') {
      this.donorService.searchByName(this.searchName).subscribe({
        next: (data) => this.listOfDonors = data,
        error: (err) => console.error('שגיאה בחיפוש שם:', err)
      });
    } 
    // אחרת, אם שדה האימייל מלא - חפש לפי אימייל
    else if (this.searchEmail && this.searchEmail.trim() !== '') {
      this.donorService.searchByEmail(this.searchEmail).subscribe({
        next: (data) => this.listOfDonors = data,
        error: (err) => console.error('שגיאה בחיפוש אימייל:', err)
      });
    } 
    // אם שניהם ריקים - טען את הכל מחדש
    else {
      this.loadDonors();
    }
  }

  // איפוס החיפוש
  clearSearch() {
    this.searchName = '';
    this.searchEmail = '';
    this.loadDonors();
  }

  // ... שאר הפונקציות הקיימות (openNew, onEdit, saveDonor, delete) נשארות אותו דבר ...
  openNew() {
    this.selectedDonor = null;
    this.displayDialog = true;
  }

  onEdit(donor: Donor) {
    this.selectedDonor = donor; 
    this.displayDialog = true;
  }

  saveDonor(donorData: DonorUpsert) {
    if (this.selectedDonor && this.selectedDonor.id) {
      this.donorService.update(this.selectedDonor.id, donorData).subscribe({
        next: () => {
          this.loadDonors();
          this.displayDialog = false;
        },
        error: (err) => console.error('שגיאה בעדכון:', err)
      });
    } else {
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