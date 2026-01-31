import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button'; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  private router = inject(Router);

  // הגדרת סיגנלים עם ערך ראשוני מה-LocalStorage
  isLoggedIn = signal<boolean>(false);
  isAdmin = signal<boolean>(false);

  ngOnInit() {
    this.updateStatus();
    
    // מאזין לשינויים ב-Storage (עוזר אם הלוגין קורה בטאב אחר או דרך סרוויס)
    window.addEventListener('storage', () => this.updateStatus());
    
    // בדיקה תקופתית קצרה לגיבוי (אופציונלי, מבטיח רינדור במידה והלוגין באותו דף)
    setInterval(() => this.updateStatus(), 500);
  }

  updateStatus() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    // עדכון ערכי הסיגנלים
    this.isLoggedIn.set(!!token);
    this.isAdmin.set(role === 'Admin');
  }

  logout() {
    localStorage.clear();
    this.updateStatus(); // מעדכן את הסיגנלים מיד
    this.router.navigate(['/login']);
  }
}