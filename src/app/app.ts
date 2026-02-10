import { Component, signal } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { Header } from './components/layout/header/header';
import { Cart } from './components/cart/cart';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Cart],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  protected readonly title = signal('ChineseAuction');
}
