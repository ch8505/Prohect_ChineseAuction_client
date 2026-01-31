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

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    // ודאי שהשדות תואמים ל-LoginRequestDto בשרת
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('התחברות הצליחה, התקבל טוקן:', response.token);
        this.router.navigate(['/gallery']);
      },
      error: (err) => {
        console.error('פרטי שגיאת 401:', err.error); 
        alert('התחברות נכשלה: ' + (err.error?.message || 'בדוק את המייל והסיסמה'));
      }
    });
  }
}