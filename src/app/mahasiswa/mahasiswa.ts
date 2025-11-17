import { AfterViewInit, Component } from '@angular/core';
import { Footer } from "../footer/footer";
import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";
import { HttpClient } from '@angular/common/http';

declare const $: any;

@Component({
  selector: 'app-mahasiswa',
  imports: [Footer, Header, Sidebar],
  templateUrl: './mahasiswa.html',
  styleUrl: './mahasiswa.css',
})
export class Mahasiswa implements AfterViewInit{
  data: any;
  table1: any;

  constructor(private httpClient: HttpClient){}

    ngAfterViewInit(): void {
      this.table1=$("#table1").DataTable();
      this.bindMahasiswa();
    }
  bindMahasiswa() {
    this.httpClient.get("https://stmikpontianak.cloud/011100862/tampilMahasiswa.php").subscribe((data:any)=>{
      console.table(data);
      this.table1.clear();
      
      data.forEach((element:any) => {
        var tempatTanggalLahir = element.TempatLahir + ","+element.TanggalLahir;

        const jenisKelaminFormatted= element.JenisKelamin + ""+(
          (element.JenisKelamin=="perempuan" || element.JenisKelamin=="perempuan")?
          "<i class='fas fas-venus text-danger'></i>":
          (element.JenisKelamin !="undifined")?
          "<i class='fas fa-mars text-primary'></i>" :""
        );

        var row=[
          element.NIM, element.Nama,
          jenisKelaminFormatted,
          tempatTanggalLahir,
          element.JP,
          element.Alamat,
          element.StatusNikah,
          element.TahunMasuk
        ]
        
        this.table1.row.add(row);
      });
      this.table1.draw(false);
    });
  }
  }


 