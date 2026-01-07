import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- 1. חייב להיות כאן!
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  credentials = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
  this.authService.login(this.credentials).subscribe({
    next: (response) => {
      console.log('תשובת השרת:', response); // נראה מה קיבלנו
      alert('מחובר!');
      this.router.navigate(['/gifts']);
    },
    error: (err) => {
      // הדפסת השגיאה המלאה לקונסול (F12)
      console.error('השגיאה המלאה:', err);
      
      if (err.status === 200) {
        alert('השרת החזיר תשובה תקינה (200), אבל אנגולר נכשל בקריאתה (Parsing Error)');
      } else {
        alert('שגיאה במספר: ' + err.status);
      }
    }
  });
}
}