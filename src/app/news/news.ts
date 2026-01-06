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

  private readonly gnewsToken = '458380610d2e61bc440f2380b1512fc6';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getNews();
  }

  
  get apiUrl(): string {
    const query = this.category === 'crypto' 
      ? 'bitcoin OR crypto OR blockchain' 
      : 'stock market OR finance';
    

    return `https://gnews.io/api/v4/search?q=${query}&lang=en&max=10&apikey=${this.gnewsToken}`;
  }

  getNews(): void {
    this.loading = true;
    this.error = '';
    this.articles = []; 
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        this.articles = res.articles || [];
        this.loading = false;
        console.log("Data GNews Berhasil:", res);
      },
      error: (err) => {
        console.error("GNews Error:", err);
        this.error = 'Gagal memuat berita. Pastikan koneksi internet stabil.';
        this.loading = false;
      }
    });
  }

  changeCategory(type: 'crypto' | 'stock'): void {
    if (this.category !== type) {
      this.category = type;
      this.getNews();
    }
  }
}