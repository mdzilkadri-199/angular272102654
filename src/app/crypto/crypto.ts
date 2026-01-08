import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-crypto',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    Header,Sidebar,Footer],
  templateUrl: './crypto.html'
})
export class Crypto implements OnInit {

  cryptoData: any = null;
  loading: boolean = false;
  errorMessage: string = '';

  private apiKey = '05471f0fbdc345fca87852dc17c2b786';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCrypto('BTC/USD,ETH/USD,DOGE/USD');
  }

  searchCrypto(symbol: string): void {
    if (!symbol || symbol.trim() === '') return;

    const pairs = symbol
      .split(',')
      .map(s => s.trim().toUpperCase())
      .map(s => s.includes('/') ? s : `${s}/USD`)
      .join(',');

    this.fetchCrypto(pairs);
  }

  fetchCrypto(symbol: string): void {
    this.loading = true;
    this.errorMessage = '';
    this.cryptoData = [];

    const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${this.apiKey}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.status === 'error') {
          this.errorMessage = 'Simbol crypto tidak ditemukan.';
        } else {
          if (response.symbol) {
            this.cryptoData.push(response);
          } else {
            this.cryptoData = Object.values(response);
          }
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
