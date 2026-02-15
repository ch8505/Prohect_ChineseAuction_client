

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Gift, GiftUpsert, Category } from '../../../models/gift';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-gift-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputTextModule, InputNumberModule, SelectModule, ButtonModule],
  templateUrl: './gift-form.html',
})
export class GiftFormComponent {

  /* ===== Inputs ===== */
  @Input() giftToEdit: Gift | null = null;
  @Input() categories: Category[] = [];

  /* ===== Outputs ===== */
  @Output() save = new EventEmitter<GiftUpsert>();
  @Output() cancel = new EventEmitter<void>();

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    ticketPrice: new FormControl(0, [Validators.required, Validators.min(0.1), Validators.max(10000)]),
    description: new FormControl(''),
    imageUrl: new FormControl(''),
    categoryId: new FormControl<number | null>(null, Validators.required)
  });


   ngOnChanges(): void {
    if (this.giftToEdit) {
      this.form.patchValue({
        name: this.giftToEdit.name,
        ticketPrice: this.giftToEdit.ticketPrice,
        description: this.giftToEdit.description,
        imageUrl: this.giftToEdit.imageUrl,
        categoryId: this.giftToEdit.categoryId
      });
    } else {
      this.form.reset();
    }
  }







  submit() {
  console.log('סטטוס הטופס:', this.form.status);
  console.log('האם הטופס תקין?', this.form.valid);
  console.log('ערכים בטופס:', this.form.value);
  console.log('שגיאות (אם יש):', this.findInvalidControls()); // פונקציית עזר למטה

  if (this.form.valid) {
    console.log('הגלריה שמעה את האירוע! הנתונים:');
    this.save.emit(this.form.value as GiftUpsert);
  } else {
    this.form.markAllAsTouched(); // צובע באדום את מה שחסר
    alert('הטופס אינו תקין, בדוק שדות חובה');
  }
}

// פונקציית עזר זמנית לניפוי שגיאות - תדביקי אותה בתוך הקלאס
findInvalidControls() {
  // 1. הגדרת מערך ריק שיכיל את שמות השדות הבעייתיים
  const invalid: string[] = [];

  // 2. מעבר על רשימת המפתחות (שמות השדות) של ה-FormGroup
  Object.keys(this.form.controls).forEach(key => {
    
    // 3. שליפת ה-Control (השדה) הספציפי לפי השם שלו (key)
    const control = this.form.get(key);

    // 4. בדיקה: האם השדה קיים והאם הוא לא תקין (לפי ה-Validators שהגדרת)
    if (control && control.invalid) {
      // 5. אם השדה לא תקין, הוספת השם שלו למערך הבעיות
      invalid.push(key);
    }
  });

  // 6. החזרת רשימת השמות הלא תקינים
  return invalid;
}

}

