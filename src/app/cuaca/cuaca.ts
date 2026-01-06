import { AfterViewInit, Component, Renderer2, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";
import { Footer } from "../footer/footer";
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet'; 

declare const $: any;
declare const moment: any;

@Component({
  selector: 'app-cuaca',
  standalone: true,
  imports: [Sidebar, Header, Footer, RouterModule, CommonModule],
  templateUrl: './cuaca.html',
  styleUrl: './cuaca.css',
})
export class Cuaca implements AfterViewInit {

  private table1: any;
  private map: any; 
  currentWeather: any; 
  cityData: any; 
  todayDate: string = ''; 

  constructor(
    private renderer: Renderer2,
    private http: HttpClient,
    private cdr: ChangeDetectorRef 
  ) {
    this.renderer.removeClass(document.body, "sidebar-open");
    this.renderer.addClass(document.body, "sidebar-closed");
  }
  
  ngAfterViewInit(): void {
    this.table1 = $("#table1").DataTable({
      columnDefs: [
        {
          targets: 0,
          renderer: function (data: string) {
            const waktu = moment(data + " UTC");
            const html = waktu.local().format("YYYY-MM-DD") + "<br/>" + waktu.local().format("HH:mm") + " WIB";
            return html;
          },
        }, {
          targets: [1],
          render: function (data: string) {
            return "<img src='" + data + "' style='filter: drop-shadow(5px 5px 10px rgba(0,0,0,0.7));'/>";
          }
        }, {
          targets: [2],
          render: function (data: string) {
            const array = data.split("||");
            const cuaca = array[0];
            const description = array[1];
            const html = "<strong>" + cuaca + "</strong> <br/>" + description;
            return html;
          },
        },
      ],
    });

    
    setTimeout(() => {
      this.initEmptyMap();
    }, 300);
  }

  getData(city: string): void {
    city = encodeURIComponent(city);

    this.http
      .get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=cbaff35df44e1bde78a8b3601001418c`)
      .subscribe((data: any) => {
        let list = data.list;

        this.cityData = data.city;

        this.currentWeather = list[0];

        this.todayDate = moment(this.currentWeather.dt_txt + " UTC").local().format("MMM DD, HH:mm");

        this.cdr.detectChanges();

        this.updateMap(this.cityData.coord.lat, this.cityData.coord.lon);

        this.table1.clear();

        list.forEach((element: any) => {
          const weather = element.weather[0];
          const iconUrl = "https://openweathermap.org/img/wn/" + weather.icon + "@2x.png";
          const cuacaDeskripsi = weather.main + " || " + weather.description;

          const main = element.main;
          const tempMin = this.kelvinToCelcius(main.temp_min);
          const tempMax = this.kelvinToCelcius(main.temp_max);

          const humidity = main.humidity;          
          const windSpeed = element.wind.speed;   
          const tempHtml = `
            <strong>${tempMin}°C / ${tempMax}°C</strong><br/>
            <small><i class="fas fa-tint"></i>  ${humidity}%</small><br/>
            <small><i class="fas fa-wind"></i>  ${windSpeed} m/s</small>
          `;

          const row = [element.dt_txt, iconUrl, cuacaDeskripsi, tempHtml];
          this.table1.row.add(row);
        });
        this.table1.draw(false);

      }, (error: any) => {
        alert(error.error?.message);
        this.table1.clear();
        this.table1.draw(false);
      });
  }

  kelvinToCelcius(kelvin: any): any {
    let celcius = kelvin - 273.15;
    celcius = Math.round(celcius * 100) / 100; 
    return celcius;
  }

  handleEnter(event: any) {
    const cityName = event.target.value?.trim();

    if (!cityName) {
      this.table1.clear();
      this.table1.draw(false);
      return; 
    }
    this.getData(cityName);
  }

  //  METHOD TAMBAHAN UNTUK TEMPLATE
  getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  getWindDirection(deg: number): string {
    if (deg >= 337.5 || deg < 22.5) return 'N';
    if (deg < 67.5) return 'NE';
    if (deg < 112.5) return 'E';
    if (deg < 157.5) return 'SE';
    if (deg < 202.5) return 'S';
    if (deg < 247.5) return 'SW';
    if (deg < 292.5) return 'W';
    return 'NW';
  }


  private initEmptyMap(): void {
    if (typeof L === 'undefined') {
      console.error('Leaflet tidak ditemukan!');
      return;
    }

    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) {
      console.error('Container peta tidak ditemukan!');
      return;
    }

    if (this.map) {
      this.map.remove();
    }

   
    this.map = L.map('map-container').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(this.map);
  }


  private updateMap(lat: number, lon: number): void {
    if (!this.map) {
      
      this.map = L.map('map-container').setView([lat, lon], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(this.map);
    } else {
      
      this.map.setView([lat, lon], 13);

     
      this.map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          this.map.removeLayer(layer);
        }
      });
    }

   
    L.marker([lat, lon])
      .addTo(this.map)
      .bindPopup(`${this.cityData.name}, ${this.cityData.country}`)
      .openPopup();
  }
}