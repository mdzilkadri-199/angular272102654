import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";
import { Footer } from "../footer/footer";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-saham',
  standalone: true,
  imports: [ CommonModule, HttpClientModule, RouterModule, Header, Sidebar, Footer],
  templateUrl: './saham.html',
  styleUrls: ['./saham.css']
})
export class Saham implements OnInit {

  stockData: any = null;
  loading = false;
  errorMessage = '';

  private apiKey = '05471f0fbdc345fca87852dc17c2b786';
  private baseUrl = 'https://api.twelvedata.com/quote';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchStock('NVDA');
  }

  searchStock(symbol: string): void {
    if (!symbol || !symbol.trim()) return;
    this.fetchStock(symbol.trim().toUpperCase());
  }

  fetchStock(symbol: string): void {
    this.loading = true;
    this.errorMessage = '';
    this.stockData = null;

    const url = `${this.baseUrl}?symbol=${symbol}&apikey=${this.apiKey}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res.status === 'error') {
          this.errorMessage = `Saham '${symbol}' tidak ditemukan.`;
        } else {
          this.stockData = res;
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Gagal terhubung ke API.';
        this.loading = false;
      }
    });
  }
}
