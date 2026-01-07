import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GiftGallery } from './components/purchaser/gift-gallery/gift-gallery';
import { LoginComponent } from "./components/auth/login/login";
import { RegisterComponent } from "./components/auth/register/register";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GiftGallery, LoginComponent, RegisterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ChineseAuction');
}
