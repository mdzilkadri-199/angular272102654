import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";
import { Footer } from "../footer/footer";

interface FlightInfo {
  airline: string;
  departureTime: string;
  arrivalTime: string;
  originCode: string;
  destinationCode: string;
  duration: string;
  price: number;
}

@Component({
  selector: 'app-travel',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Sidebar, Footer],
  templateUrl: './travel.html'
})
export class Travel {
  loading: boolean = false;
  flightData: FlightInfo[] = [];

  private apiKey = 'ef6795651a66d715dd89c6e138083f2e'; 
  private apiUrl = 'https://api.aviationstack.com/v1/flights';

  private cityToIataMap: { [key: string]: string } = {
    'PONTIANAK': 'PNK',
    'JAKARTA': 'CGK',
    'BALI': 'DPS',
    'DENPASAR': 'DPS',
    'SURABAYA': 'SUB',
    'BANDUNG': 'BDO',
    'MEDAN': 'KNO',
    'MAKASSAR': 'UPG',
    'YOGYAKARTA': 'YIA',
    'SINGAPURA': 'SIN',
    'SINGAPORE': 'SIN',
    'TOKYO': 'NRT',
    'JEPANG': 'NRT'
  };

  constructor(private http: HttpClient) {}

  // Sekarang fungsi ini hanya menerima 2 parameter: origin dan destination
  searchFlights(origin: string, destination: string) {
    if (!origin || !destination) {
      alert('Mohon isi kota/bandara asal dan tujuan!');
      return;
    }

    this.loading = true;
    this.flightData = [];

    const rawOrigin = origin.toUpperCase().trim();
    const rawDest = destination.toUpperCase().trim();

    const originIata = this.cityToIataMap[rawOrigin] || rawOrigin;
    const destIata = this.cityToIataMap[rawDest] || rawDest;

    if (originIata.length !== 3 || destIata.length !== 3) {
      this.loading = false;
      alert(`Lokasi tidak dikenali! Masukkan nama kota besar (Contoh: Pontianak, Jakarta) atau 3 huruf kode IATA resmi.`);
      return;
    }

    const fullUrl = `${this.apiUrl}?access_key=${this.apiKey}&dep_iata=${originIata}`;

    this.http.get<any>(fullUrl).subscribe({
      next: (response) => {
        this.loading = false;

        if (!response.data || response.data.length === 0) {
          alert(`Tidak ada jadwal penerbangan aktif dari ${originIata} hari ini.`);
          return;
        }

        const matchedFlights = response.data.filter((flight: any) => {
          return flight.arrival.iata === destIata || 
                 (flight.arrival.airport && flight.arrival.airport.toUpperCase().includes(destIata));
        });

        if (matchedFlights.length === 0) {
          alert(`Jadwal penerbangan langsung dari ${originIata} menuju ${destIata} tidak ditemukan untuk hari ini.`);
          return;
        }

        this.flightData = matchedFlights.map((flight: any) => {
          const depTime = flight.departure.scheduled ? flight.departure.scheduled.substring(11, 16) : '00:00';
          const arrTime = flight.arrival.scheduled ? flight.arrival.scheduled.substring(11, 16) : '00:00';

          return {
            airline: flight.airline.name || 'Generic Airline',
            departureTime: depTime,
            arrivalTime: arrTime,
            originCode: flight.departure.iata || originIata,
            destinationCode: flight.arrival.iata || destIata,
            duration: '1j 45m',
            price: this.generatePriceEstimate(flight.airline.name)
          };
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('API Error:', err);
        alert('Gagal mengambil data dari server API!');
      }
    });
  }

  private generatePriceEstimate(airlineName: string): number {
    if (!airlineName) return 750000;
    const name = airlineName.toLowerCase();
    if (name.includes('garuda')) return 1580000;
    if (name.includes('batik')) return 1120000;
    if (name.includes('citilink')) return 940000;
    if (name.includes('lion')) return 850000;
    if (name.includes('airasia')) return 790000;
    return 890000;
  }
}