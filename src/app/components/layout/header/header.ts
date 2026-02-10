import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../../services/cart/cart-service';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  private router = inject(Router);
  cartService = inject(CartService);
  authService = inject(AuthService);


  isLoggedIn = this.authService.isLoggedIn;
  isAdmin = this.authService.isAdmin;

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}