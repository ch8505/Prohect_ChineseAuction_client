import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- 1. הייבוא החשוב
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-register',
  standalone: true,
  // 2. כאן אנחנו מחברים את הטפסים לקומפוננטה:
  imports: [CommonModule, FormsModule], 
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    phone: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  // הפונקציה ריקה מסוגריים כי היא לוקחת את המידע מ-this.user
  onRegister() {
    this.authService.register(this.user).subscribe({
      next: () => {
        alert('הרישום בוצע בהצלחה! מעביר להתחברות...');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // הצגת השגיאה למקרה שהאימייל כבר קיים למשל
        alert('שגיאה ברישום: ' + (err.error?.message || 'נסה שוב'));
      }
    });
  }
}
