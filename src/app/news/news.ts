import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DatePipe,
    Header,
    Sidebar,
    Footer
  ],
  templateUrl: './news.html',
  styleUrl: './news.css'
})
export class News implements OnInit {

  articles: any[] = [];
  loading: boolean = false;
  error: string = '';


  category: 'crypto' | 'stock' = 'crypto';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getNews();
  }


  get apiUrl(): string {
    if (this.category === 'crypto') {
      return 'https://newsapi.org/v2/everything?q=bitcoin OR crypto OR blockchain&language=en&sortBy=publishedAt&apiKey=58ad5ca474fb4a3da2f0b48545625217';
    }

    return 'https://newsapi.org/v2/everything?q=stock OR saham OR market&language=en&sortBy=publishedAt&apiKey=58ad5ca474fb4a3da2f0b48545625217';
  }


  getNews(): void {
    this.loading = true;
    this.error = '';

    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        this.articles = res.articles || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Gagal memuat berita';
        this.loading = false;
      }
    });
  }

  changeCategory(type: 'crypto' | 'stock'): void {
    this.category = type;
    this.getNews();
  }
}
