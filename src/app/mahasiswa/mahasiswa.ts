import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";
import { Footer } from "../footer/footer";

declare const $: any;

@Component({
  selector: 'app-mahasiswa',
  standalone: true,
  imports: [Header, Sidebar, Footer],
  templateUrl: './mahasiswa.html',
  styleUrls: ['./mahasiswa.css']
})
export class Mahasiswa implements AfterViewInit {

  table1: any;

  constructor(private http: HttpClient, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.renderer.removeClass(document.body, 'sidebar-open');
    this.renderer.addClass(document.body, 'sidebar-closed');
    this.renderer.addClass(document.body, 'sidebar-collapse');

    this.bindMahasiswa();
  }

  bindMahasiswa(): void {
    this.http.get("https://stmikpontianak.cloud/011100862/tampilMahasiswa.php")
      .subscribe((data: any) => {

        if (!this.table1) {
          this.table1 = $('#datatable-mahasiswa').DataTable({
            responsive: true,
            lengthChange: true,
            autoWidth: false
          });
        } else {
          this.table1.clear();
        }

        data.forEach((mhs: any) => {
          const tempatTanggalLahir = `${mhs.TempatLahir}, ${mhs.TanggalLahir}`;

          const jenisKelaminFormatted = `
            ${mhs.JenisKelamin}
            ${
              mhs.JenisKelamin.toLowerCase() === 'perempuan'
                ? "<i class='fas fa-venus text-danger'></i>"
                : "<i class='fas fa-mars text-primary'></i>"
            }
          `;

          this.table1.row.add([
            mhs.NIM,
            mhs.Nama,
            jenisKelaminFormatted,
            tempatTanggalLahir,
            mhs.JP,
            mhs.Alamat,
            mhs.StatusNikah,
            mhs.TahunMasuk
          ]);
        });

        this.table1.draw();
      });
  }

  postRecord(): void {

    var alamat = $("#alamatText").val();
    var jenisKelamin = $("#jenisKelaminSelect").val()?.toString().trim();
    var jp = $("#jpSelect").val();
    var nama = $("#namaText").val();
    var nim = $("#nimText").val();
    var statusNikah = $("#statusNikahSelect").val();
    var tahunMasuk = $("#tahunMasukText").val();
    var tanggalLahir = $("#tanggalLahirText").val();
    var tempatLahir = $("#tempatLahirText").val();

    // VALIDASI
    if (!nim || !nama || !tempatLahir || !tanggalLahir || !alamat || !tahunMasuk) {
      alert("Semua data wajib diisi!");
      return;
    }

    // URL BENAR
    var url =
      "https://stmikpontianak.cloud/011100862/tambahMahasiswa.php?" +
      "alamat=" + encodeURIComponent(alamat) +
      "&jenisKelamin=" + encodeURIComponent(jenisKelamin!) +
      "&jp=" + encodeURIComponent(jp!) +
      "&nama=" + encodeURIComponent(nama!) +
      "&nim=" + encodeURIComponent(nim!) +
      "&statusPernikahan=" + encodeURIComponent(statusNikah!) +
      "&tahunMasuk=" + encodeURIComponent(tahunMasuk!) +
      "&tanggalLahir=" + encodeURIComponent(tanggalLahir!) +
      "&tempatLahir=" + encodeURIComponent(tempatLahir!);

    console.log("URL DIKIRIM:", url); // Debug

    this.http.get(url).subscribe((data: any) => {

      alert(data.status + " --> " + data.message);

      this.bindMahasiswa();

      // FIX ID MODAL
      $("#tambahModal").modal("hide");
    });
  }
}