

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chat-widget',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './chat-widget.html',
  styleUrl: './chat-widget.scss',
})
export class ChatWidgetComponent {
  private http = inject(HttpClient);
  
  isOpen = false;
  userMessage = '';
  isLoading = false;
  
  messages: Message[] = [
    { sender: 'bot', text: 'היי, אני אלישבע העוזרת האישית שלך 🤖. תרצה לשאול אותי שאלה?' }
  ];

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;

    // 1. הוסף את הודעת המשתמש
    const msg = this.userMessage;
    this.messages.push({ sender: 'user', text: msg });
    this.userMessage = '';
    this.isLoading = true;

    // 2. שלח לשרת
    // וודא שהכתובת תואמת לפורט של השרת שלך
    this.http.post<any>('https://localhost:7006/api/Ai/ask', { userMessage: msg })
      .subscribe({
        next: (res) => {
          this.messages.push({ sender: 'bot', text: res.botReply });
          this.isLoading = false;
          this.scrollToBottom();
        },
        error: (err) => {
          this.messages.push({ sender: 'bot', text: 'אופס, הייתה שגיאה בתקשורת.' });
          this.isLoading = false;
          this.scrollToBottom();
        }
      });
      // בתוך הפונקציה sendMessage:

this.http.post<any>('https://localhost:7006/api/Ai/ask', { userMessage: msg })
  .subscribe({
    next: (res) => {
      // כאן מגיעה התשובה האמיתית מהבינה המלאכותית!
      this.messages.push({ sender: 'bot', text: res.botReply });
      this.isLoading = false;
      this.scrollToBottom();
    },
    error: (err) => {
      console.error(err);
      this.messages.push({ sender: 'bot', text: 'אופס, אלישבע התעייפה קצת אחרי הפרויקט המטורף הזה... נסה שוב עוד רגע 😅' });
      this.isLoading = false;
      this.scrollToBottom();
    }
  });
  }

  scrollToBottom() {
    setTimeout(() => {
      const chatBody = document.querySelector('.chat-body');
      if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
    }, 100);
  }
  
}
