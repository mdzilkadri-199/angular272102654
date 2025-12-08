import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";
import { Footer } from "../footer/footer";
import { HttpClient } from '@angular/common/http';
import { formatCurrency } from '@angular/common';

declare const $ : any; 

@Component({
  selector: 'app-forex',
  standalone: true,
  imports: [Header, Sidebar, Footer],
  templateUrl: './forex.html',
  styleUrl: './forex.css',
})
export class Forex implements AfterViewInit {

  private_table1 : any;
  _table1: any;

  constructor(private renderer: Renderer2, private httpClient: HttpClient){}

  ngAfterViewInit(): void {
    this.renderer.removeClass(document.body,"sidebar-open");
     this.renderer.addClass(document.body,"sidebar-close");
      this.renderer.addClass(document.body,"sidebar-collapsed");

      this._table1 = $("#table1").DataTable({
        "columDefs": [
          {
            "target" : 3,
            "className" : "text-rigth"
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

    // fetch the currency names
    this.httpClient.get(currenciesUrl).subscribe((currencies: any) =>{
      // fetch the exchange rates
      this.httpClient.get(ratesUrl).subscribe((data: any) =>{
        const rates = data.rates;
        let index = 1;

        // iterate over the rates and add the rows to the table
        for(const currency in rates){
          // get the currency name from the api
          const currencyName = currencies[currency];

          // calculate the rate for the specific currency
          const rate = rates.IDR / rates [currency];
          const formatRate = formatCurrency(rate, "en-US","", currency );

          // add the row with the index,symbol, currency name, and formatted rate
          const row= [index++, currency, currencyName, formatRate];
          this._table1.row.add(row);
          this._table1.draw(false);
          
        }
      });
    });
  }

}
