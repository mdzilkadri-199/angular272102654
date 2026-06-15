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
mahasiswa: any;
 private resizeTimeout: any;

  constructor(private http: HttpClient, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.bindMahasiswa();
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.destroyAndRebind();
      }, 300); // debounce 300ms agar tidak terlalu sering
    });
  }
  destroyAndRebind(): void {
    if (this.table1) {
      this.table1.destroy();
      this.table1 = null;
      $('#datatable-mahasiswa tbody').empty();
    }
    this.bindMahasiswa();
  }

  bindMahasiswa(): void {
  this.http.get("https://stmikpontianak.cloud/011100862/tampilMahasiswa.php")
    .subscribe((data: any) => {

      const isMobile = window.innerWidth < 768;

      if (!this.table1) {
        this.table1 = $('#datatable-mahasiswa').DataTable({
          responsive: false,
          lengthChange: true,
          autoWidth: false,
          scrollX: true,
          columnDefs: isMobile
            ? [{ targets: [2, 3, 4, 5, 6, 7, 8], visible: false }]
             : [{ targets: [0], visible: false },{ targets: [5], width: '80px' }] 
        });

        if (isMobile) {
          $('#datatable-mahasiswa tbody').on('click', '.expand-btn', (event: any) => {
            const tr = $(event.currentTarget).closest('tr');
            const row = this.table1.row(tr);

            if (row.child.isShown()) {
              row.child.hide();
              tr.find('.expand-btn').html('&#9654;');
              tr.removeClass('shown');
            } else {
              const d = row.data();
              row.child(this.formatDetail(d)).show();
              tr.find('.expand-btn').html('&#9660;');
              tr.addClass('shown');
            }
          });
        }

      } else {
        this.table1.clear();
      }

      data.forEach((mhs: any) => {
        const tempatTanggalLahir = `${mhs.TempatLahir}, ${mhs.TanggalLahir}`;
        const jenisKelaminFormatted = mhs.JenisKelamin.toLowerCase() === 'perempuan'
          ? `Perempuan <i class='fas fa-venus text-danger'></i>`
          : `Laki-laki <i class='fas fa-mars text-primary'></i>`;

        if (isMobile) {
          this.table1.row.add([
            '<button class="expand-btn btn btn-sm btn-outline-secondary py-0 px-1">&#9654;</button>',
            mhs.NIM,
            mhs.Nama,
            jenisKelaminFormatted,
            tempatTanggalLahir,
            mhs.JP,
            mhs.Alamat,
            mhs.StatusNikah,
            mhs.TahunMasuk
          ]);
        } else {
          // Desktop: row normal tanpa kolom tombol expand
          this.table1.row.add([
            '', 
            mhs.NIM,
            mhs.Nama,
            jenisKelaminFormatted,
            tempatTanggalLahir,
            mhs.JP,
            mhs.Alamat,
            mhs.StatusNikah,
            mhs.TahunMasuk
          ]);
        }
      });

      this.table1.draw();
    });
}
  formatDetail(d: any): string {
  return `
    <table class="table table-sm table-borderless mb-0 ml-3">
      <tr><td><b>Nama</b></td><td>: ${d[2]}</td></tr>
      <tr><td><b>Jenis Kelamin</b></td><td>: ${d[3]}</td></tr>
      <tr><td><b>Tempat, Tgl Lahir</b></td><td>: ${d[4]}</td></tr>
      <tr><td><b>JP</b></td><td>: ${d[5]}</td></tr>
      <tr><td><b>Alamat</b></td><td>: ${d[6]}</td></tr>
      <tr><td><b>Status</b></td><td>: ${d[7]}</td></tr>
      <tr><td><b>Tahun Masuk</b></td><td>: ${d[8]}</td></tr>
    </table>`;
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