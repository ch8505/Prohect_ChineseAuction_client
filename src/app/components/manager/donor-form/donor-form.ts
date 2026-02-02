import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Donor, DonorUpsert } from '../../../models/donor';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-donor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './donor-form.html',
  styles: [`
    .form-container { padding: 1rem; direction: rtl; }
    .form-field { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .form-actions { display: flex; gap: 1rem; margin-top: 2rem; }
    .error-msg { color: red; font-size: 0.875rem; }
    label { font-weight: bold; }
  `]
})
export class DonorForm implements OnChanges {

  /* ===== Inputs: יכול להיות null במקרה של הוספה חדשה ===== */
  @Input() donorToEdit: Donor | null = null;

  /* ===== Outputs ===== */
  @Output() save = new EventEmitter<DonorUpsert>();
  @Output() cancel = new EventEmitter<void>();

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9-]*$')])
  });

  ngOnChanges(changes: SimpleChanges): void {
    // אם נכנס תורם לעריכה - מלא את הטופס
    if (this.donorToEdit) {
      this.form.patchValue({
        name: this.donorToEdit.name,
        email: this.donorToEdit.email,
        phone: this.donorToEdit.phone
      });
    } else {
      // אם אין תורם (הוספה חדשה) - אפס את הטופס
      this.form.reset();
    }
  }

  submit() {
    if (this.form.valid) {
      const formValue: DonorUpsert = {
        name: this.form.controls.name.value!,
        email: this.form.controls.email.value!,
        phone: this.form.controls.phone.value!
      };
      this.save.emit(formValue);
    } else {
      this.form.markAllAsTouched();
    }
  }
}