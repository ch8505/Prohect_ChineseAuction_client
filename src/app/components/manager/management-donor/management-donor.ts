import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { DialogModule } from 'primeng/dialog';
import { DonorService } from '../../../services/donor-service';
import { Donor, DonorUpsert } from '../../../models/donor';
import { DonorForm } from '../donor-form/donor-form';

@Component({
  selector: 'app-management-donor',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, DialogModule, DonorForm],
  templateUrl: './management-donor.html',
  styleUrl: './management-donor.scss',
})
export class ManagementDonor implements OnInit {
  
  private donorService = inject(DonorService);
  
  listOfDonors: Donor[] = [];
  selectedDonor: Donor | null = null;
  displayDialog: boolean = false;

  ngOnInit() {
    this.loadDonors();
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