import { Component, signal } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { Header } from './components/layout/header/header';
import { Cart } from './components/cart/cart';
import { ChatWidgetComponent } from "./components/chat-widget/chat-widget";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Cart, ChatWidgetComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  protected readonly title = signal('ChineseAuction');
}
