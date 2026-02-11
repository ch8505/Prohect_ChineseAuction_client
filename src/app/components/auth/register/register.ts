import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, InputTextModule, PasswordModule, ButtonModule, MessageModule, InputMaskModule],
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
  confirmPassword = '';
  isLoading = signal(false);
  successMessage = signal<string | undefined>(undefined);
  errorMessage = signal<string | undefined>(undefined);

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    if (this.user.password !== this.confirmPassword) {
      this.errorMessage.set('הסיסמאות לא תואמות');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(undefined);
    this.successMessage.set(undefined);

    this.authService.register(this.user).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('הרישום בוצע בהצלחה! מעביר להתחברות...');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading.set(false);
        const message = err.error?.message || 'נסה שוב';
        this.errorMessage.set('שגיאה ברישום: ' + message);
      }
    });
  }
}
