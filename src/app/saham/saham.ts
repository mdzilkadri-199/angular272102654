import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";
import { Footer } from "../footer/footer";

declare var $: any;

@Component({
  selector: 'app-saham',
  standalone: true,
  imports: [CommonModule,HttpClientModule,RouterModule,Header, Sidebar, Footer ],
  templateUrl: './saham.html',
  styleUrls: ['./saham.css']
})
export class Saham implements OnInit, AfterViewInit {

  stockData: any = null;
  loading: boolean = false;
  errorMessage: string = '';
  moduleName: string = 'saham';


  private apiKey = '05471f0fbdc345fca87852dc17c2b786';
  private baseUrl = 'https://api.twelvedata.com/quote';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDataSaham('NVDA');
  }

  ngAfterViewInit(): void {
    this.initDataTable();
  }

  // Search saham
  searchStock(symbol: string): void {
    if (!symbol || symbol.trim() === '') return;
    this.fetchDataSaham(symbol.toUpperCase().trim());
  }

  fetchDataSaham(symbol: string): void {
    this.loading = true;
    this.errorMessage = '';
    this.stockData = null;

    const url = `${this.baseUrl}?symbol=${symbol}&apikey=${this.apiKey}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.status === 'error' || response.code === 400) {
          this.errorMessage = `Simbol '${symbol}' tidak ditemukan atau akses ditolak.`;
        } else {
          this.stockData = response;
        }
        this.loading = false;
        this.initDataTable();
      },
      error: () => {
        this.errorMessage = 'Terjadi kesalahan koneksi ke server API.';
        this.loading = false;
      }
    });
  }

 
  initDataTable(): void {
    setTimeout(() => {
      const table = $('#tableSaham');

      if ($.fn.DataTable.isDataTable(table)) {
        table.DataTable().destroy();
      }

      table.DataTable({
        paging: false,
        lengthChange: false,
        searching: false,
        ordering: true,
        info: true,
        autoWidth: false,
        responsive: true
      });
    }, 100);
  }
}
