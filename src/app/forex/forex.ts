import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";
import { Footer } from "../footer/footer";
import { HttpClient } from '@angular/common/http';
import { formatNumber } from '@angular/common';

declare const $ : any; 

@Component({
  selector: 'app-forex',
  standalone: true,
  imports: [Header, Sidebar, Footer],
  templateUrl: './forex.html',
  styleUrl: './forex.css',
})
export class Forex implements AfterViewInit {
cryptoData: any;
searchCrypto(arg0: string) {
throw new Error('Method not implemented.');
}

  private_table1 : any;
  _table1: any;

  constructor(private renderer: Renderer2, private httpClient: HttpClient){}

  ngAfterViewInit(): void {
    this.renderer.removeClass(document.body,"sidebar-open");
     this.renderer.addClass(document.body,"sidebar-close");
      this.renderer.addClass(document.body,"sidebar-collapsed");

      this._table1 = $("#table1").DataTable({
        "columnDefs": [
          {
            "target" : 3,
            "className" : 'text-right'
          }
        ]
      });

      this.bindTable1();
  }

  bindTable1(): void {
    console.log("bindTable1()");
    // url to fetch exchange rates
    const ratesUrl = "https://openexchangerates.org/api/latest.json?app_id=3acf3c7c97f54565aeb5448892254d36";
    // url to fetch currency names
    const currenciesUrl = "https://openexchangerates.org/api/currencies.json";

    this.httpClient.get(currenciesUrl).subscribe((currencies: any) =>{
      this.httpClient.get(ratesUrl).subscribe((data: any) =>{
          const refreshDate = new Date(data.timestamp * 1000);
        $("#tanggal").html(
            "Data per tanggal " + this.formatDate(refreshDate)
       );
        const rates = data.rates;
        let index = 1;
        for(const currency in rates){
          const currencyName = currencies[currency];
          const rate = rates.IDR / rates [currency];
          const formatRate = formatNumber(rate, "en-US", '1.2-2');
          const row= [index++, currency, currencyName, formatRate];
          this._table1.row.add(row);
        }
         this._table1.draw(false);  
      });
    });
  }
  formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  return ` ${dd}-${mm}-${yyyy} Pukul ${hh}:${min} (local)`;
}


}
