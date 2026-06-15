import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, finalize, switchMap, of } from 'rxjs';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Footer } from '../footer/footer';

interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
}

interface CoinGeckoSearchResponse {
  coins: {
    id: string;
    name: string;
    api_symbol: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    large: string;
  }[];
}

@Component({
  selector: 'app-crypto',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Sidebar, Footer],
  templateUrl: './crypto.html',
})
export class Crypto implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly destroy$ = new Subject<void>();

  // --- State ---
  readonly coins = signal<CoinMarket[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly currentPage = signal(1);
  readonly pageSize = signal<10 | 25 | 50>(10);

  // --- Derived State ---
  readonly totalPages = computed(() =>
    Math.ceil(this.coins().length / this.pageSize())
  );

  readonly pagedCoins = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.coins().slice(start, start + this.pageSize());
  });

  readonly showingFrom = computed(() =>
    this.coins().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1
  );

  readonly showingTo = computed(() =>
    Math.min(this.currentPage() * this.pageSize(), this.coins().length)
  );

  readonly visiblePages = computed<(number | '...')[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
    if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
  });

  private readonly API_BASE = 'https://api.coingecko.com/api/v3';
  private readonly API_KEY = 'CG-F7Z3SdQwaYghkLkanGXJCH5b';

  ngOnInit(): void {
    this.fetchTopCoins();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Menampilkan 50 Koin Teratas Saat Pertama Kali Load atau Search Kosong
  fetchTopCoins(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.coins.set([]);
    this.currentPage.set(1);

    const params = new URLSearchParams({
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: '50',
      page: '1',
      sparkline: 'false',
      x_cg_demo_api_key: this.API_KEY,
    });

    this.http
      .get<CoinMarket[]>(`${this.API_BASE}/coins/markets?${params}`)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (data) => {
          this.coins.set(data || []);
        },
        error: () => this.handleError(),
      });
  }

  // Logika Pencarian ke Seluruh Database CoinGecko
  onSearch(query: string): void {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      this.fetchTopCoins();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.coins.set([]);
    this.currentPage.set(1);

    // Langkah 1: Cari Koin berdasarkan teks (Fuzzy Search)
    this.http
      .get<CoinGeckoSearchResponse>(`${this.API_BASE}/search?query=${trimmed}&x_cg_demo_api_key=${this.API_KEY}`)
      .pipe(
        switchMap((searchResult) => {
          if (!searchResult || !searchResult.coins || searchResult.coins.length === 0) {
            return of([]);
          }
          
          // Ambil maksimal 50 ID koin teratas dari hasil pencarian untuk di-load detail harganya
          const coinIds = searchResult.coins
            .slice(0, 50)
            .map((c) => c.id)
            .join(',');

          const marketParams = new URLSearchParams({
            vs_currency: 'usd',
            ids: coinIds,
            order: 'market_cap_desc',
            sparkline: 'false',
            x_cg_demo_api_key: this.API_KEY,
          });

          // Langkah 2: Ambil detail market/harga untuk koin-koin tersebut
          return this.http.get<CoinMarket[]>(`${this.API_BASE}/coins/markets?${marketParams}`);
        }),
        takeUntil(this.destroy$),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (marketData) => {
          if (!marketData || marketData.length === 0) {
            this.errorMessage.set(`No results found for "${query}".`);
            return;
          }
          this.coins.set(marketData);
        },
        error: () => this.handleError(),
      });
  }

  private handleError(): void {
    this.errorMessage.set(
      'Failed to load data. CoinGecko rate limit may have been reached.'
    );
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size as 10 | 25 | 50);
    this.currentPage.set(1);
  }

  goToPage(page: number | '...'): void {
    if (page === '...') return;
    const p = Number(page);
    if (p >= 1 && p <= this.totalPages()) {
      this.currentPage.set(p);
    }
  }

  trackByCoin(_: number, coin: CoinMarket): string {
    return coin.id;
  }
}