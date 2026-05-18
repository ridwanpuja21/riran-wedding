// Inisialisasi Efek Animasi (AOS) - Animasi berulang saat di-scroll
// Inisialisasi AOS dengan deteksi kontainer khusus
function initAOS() {
  const isDesktop = window.innerWidth >= 992;

  AOS.init({
    duration: 1000,
    once: false,
    // PERUBAHAN DI SINI: menggunakan "#main-content", BUKAN "main"
    scrollContainer: isDesktop ? "#main-content" : null,
  });
}

// Jalankan saat halaman dimuat
window.addEventListener("load", initAOS);

// Jalankan saat halaman dimuat
window.addEventListener("load", initAOS);

// Jalankan ulang jika ukuran layar berubah (opsional tapi disarankan)
window.addEventListener("resize", function () {
  AOS.refresh();
});

// Inisialisasi GLightbox untuk Galeri
const lightbox = GLightbox({
  selector: ".glightbox",
  touchNavigation: true /* Tetap bisa swipe kiri-kanan */,
  loop: true,
  zoomable: false,
  dragToleranceX: 40,
  dragToleranceY: 1000 /* Mempersulit drag vertikal (atas-bawah) */,
  dragAutoSnap: true,
});

// Deklarasi Variabel Global
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const floatingButtons = document.getElementById("floatingButtons");
const backToTopBtn = document.getElementById("backToTopBtn");
let isMusicPlaying = false;

// --- FUNGSI MUNCULKAN TOMBOL BACK TO TOP SAAT DI SCROLL ---
window.addEventListener("scroll", function () {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
});

// --- FUNGSI BUKA UNDANGAN & MUSIK ---
function bukaUndangan() {
  // Animasi Cover Menghilang
  document.getElementById("hero-cover").classList.add("cover-fade-out");
  document.body.style.overflowY = "auto"; // Mengembalikan scroll

  // Memulai animasi fade-in pada konten utama
  document.querySelector(".main-content").classList.add("mulai-animasi");

  // Menampilkan kontainer tombol melayang
  floatingButtons.style.opacity = "1";

  // Mainkan Musik Default & Ubah ikon menjadi Pause
  bgMusic.play();
  isMusicPlaying = true;
  musicBtn.innerHTML = '<i class="fa-solid fa-pause spin-icon"></i>';
}

function toggleMusic() {
  if (isMusicPlaying) {
    bgMusic.pause();
    musicBtn.innerHTML = '<i class="fa-solid fa-music spin-icon"></i>'; // Ikon musik saat dijeda
  } else {
    bgMusic.play();
    musicBtn.innerHTML = '<i class="fa-solid fa-pause spin-icon"></i>'; // Ikon pause saat diputar
  }
  isMusicPlaying = !isMusicPlaying;
}

// --- FUNGSI KEMBALI KE ATAS ---
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// --- FUNGSI COUNTDOWN ---
const weddingDate = new Date("May 24, 2026 08:00:00").getTime();

const timer = setInterval(function () {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance < 0) {
    clearInterval(timer);
    document.getElementById("countdown").innerHTML = "Acara Telah Berlangsung";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours;
  document.getElementById("minutes").innerText = minutes;
  document.getElementById("seconds").innerText = seconds;
}, 1000);

// ==========================================================
// --- BAGIAN DATABASE GOOGLE SHEETS (RSVP, UCAPAN, REACTION)
// ==========================================================

const scriptURL =
  "https://script.google.com/macros/s/AKfycbzSbZzG7z1H9eaZQzqABXq1KHHJ-BM-ObdGNnxSGWCGnTd9Rtc1HiuC0KhvkF8UqEE/exec";
const urlReaction =
  "https://script.google.com/macros/s/AKfycbxELaMV3A_IFRUd_7ON7C_lbkyj4js0M1VOHaoCLicPYJE7VhtXWgDNjjbB9s3wr30/exec";

// --- LOGIKA FORM RSVP ---
const formRSVP = document.forms["submit-to-google-sheet-rsvp"];
const btnSubmitRSVP = document.getElementById("btnSubmitRSVP");

if (formRSVP) {
  formRSVP.addEventListener("submit", (e) => {
    e.preventDefault();
    btnSubmitRSVP.innerHTML =
      'Mengirim... <i class="fa-solid fa-spinner fa-spin"></i>';
    btnSubmitRSVP.disabled = true;

    fetch(scriptURL, { method: "POST", body: new FormData(formRSVP) })
      .then((response) => {
        formRSVP.reset();
        btnSubmitRSVP.innerHTML = "Kirim Konfirmasi";
        btnSubmitRSVP.disabled = false;
        Swal.fire({
          title: "Terima Kasih!",
          text: "Konfirmasi kehadiran Anda telah tersimpan.",
          icon: "success",
          confirmButtonText: "Tutup",
          // customClass ini akan memanfaatkan tema Bootstrap 5
          customClass: {
            confirmButton: "btn btn-dark px-4 py-2 rounded-pill",
          },
          buttonsStyling: false, // Ini wajib dimatikan agar tema bootstrap berfungsi
        });
      })
      .catch((error) => {
        console.error("Error!", error.message);
        btnSubmitRSVP.innerHTML = "Kirim Konfirmasi";
        btnSubmitRSVP.disabled = false;
      });
  });
}

// --- LOGIKA FORM UCAPAN ---
const formUcapan = document.forms["submit-to-google-sheet-ucapan"];
const btnSubmitUcapan = document.getElementById("btnSubmitUcapan");

if (formUcapan) {
  formUcapan.addEventListener("submit", (e) => {
    e.preventDefault();
    btnSubmitUcapan.innerHTML =
      'Mengirim... <i class="fa-solid fa-spinner fa-spin"></i>';
    btnSubmitUcapan.disabled = true;

    fetch(scriptURL, { method: "POST", body: new FormData(formUcapan) })
      .then((response) => {
        const nama = formUcapan.querySelector('input[name="Nama"]').value;
        const pesan = formUcapan.querySelector('textarea[name="Pesan"]').value;
        const daftarUcapan = document.getElementById("daftarUcapan");

        // Format Waktu Real-time
        const now = new Date();
        const opsiWaktu = {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        };
        const waktuTampil = now
          .toLocaleDateString("id-ID", opsiWaktu)
          .replace(/\./g, ":");

        // Tambahkan ucapan ke layar
        const ucapanBaru = document.createElement("div");
        ucapanBaru.className = "border-bottom border-secondary mb-3 pb-2";
        ucapanBaru.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-1">
                <strong class="text-dark">${nama}</strong>
                <small class="text-black-50" style="font-size: 0.75rem;"><i class="fa-regular fa-clock me-1"></i>${waktuTampil}</small>
            </div>
            <p class="text-dark mb-0" style="font-size: 0.9rem;">"${pesan}"</p>
        `;

        daftarUcapan.prepend(ucapanBaru);
        formUcapan.reset();
        btnSubmitUcapan.innerHTML = "Kirim Ucapan";
        btnSubmitUcapan.disabled = false;
        Swal.fire({
          title: "Pesan Terkirim!",
          text: "Terima kasih atas ucapan dan doa restu Anda.",
          icon: "success",
          confirmButtonText: "Tutup",
          customClass: {
            confirmButton: "btn btn-dark px-4 py-2 rounded-pill",
          },
          buttonsStyling: false, // Mematikan style bawaan swal
        });
      })
      .catch((error) => {
        console.error("Error!", error.message);
        btnSubmitUcapan.innerHTML = "Kirim Ucapan";
        btnSubmitUcapan.disabled = false;
      });
  });
}

// --- MENGAMBIL DATA UCAPAN SAAT HALAMAN DIMUAT ---
function muatUcapan() {
  const daftarUcapan = document.getElementById("daftarUcapan");
  if (!daftarUcapan) return;

  daftarUcapan.innerHTML =
    '<div class="text-center text-dark my-4"><i class="fa-solid fa-spinner fa-spin fs-3 mb-2"></i><br>Memuat ucapan...</div>';

  fetch(scriptURL)
    .then((response) => response.json())
    .then((res) => {
      daftarUcapan.innerHTML = "";

      if (res.result === "success" && res.data.length > 0) {
        const ucapanTerbaru = res.data.reverse();

        ucapanTerbaru.forEach((item) => {
          let waktuTampil = item.waktu || "";

          const ucapanBaru = document.createElement("div");
          ucapanBaru.className = "border-bottom border-secondary mb-3 pb-2";
          ucapanBaru.innerHTML = `
              <div class="d-flex justify-content-between align-items-center mb-1">
                  <strong class="text-dark">${item.nama}</strong>
                  <small class="text-black-50" style="font-size: 0.75rem;">
                      ${waktuTampil ? `<i class="fa-regular fa-clock me-1"></i>${waktuTampil}` : ""}
                  </small>
              </div>
              <p class="text-dark mb-0" style="font-size: 0.9rem;">"${item.pesan}"</p>
          `;
          daftarUcapan.appendChild(ucapanBaru);
        });
      } else {
        daftarUcapan.innerHTML =
          '<div class="text-center text-black-50 my-3">Belum ada ucapan. Jadilah yang pertama!</div>';
      }
    })
    .catch((error) => {
      console.error("Gagal memuat data:", error);
      daftarUcapan.innerHTML =
        '<div class="text-center text-black-50 my-3">Gagal memuat ucapan. Pastikan koneksi internet stabil.</div>';
    });
}

// --- 1. Fungsi Mengambil Data Reaction Saat Halaman Dimuat ---
function muatReaction() {
  fetch(urlReaction)
    .then((response) => response.json())
    .then((data) => {
      // Menampilkan data asli dari server di console browser agar mudah dilacak
      console.log("Data Reaction dari server:", data);

      // Mengecek apakah data dibungkus dalam properti 'data' (misal: data.data.like)
      const dataReaction = data.data ? data.data : data;

      // Menggunakan ?? (Nullish Coalescing) untuk otomatis mencari huruf kecil atau besar,
      // dan mengubahnya menjadi 0 jika data benar-benar kosong.
      document.getElementById("count-like").innerText =
        dataReaction.like ?? dataReaction.Like ?? dataReaction.LIKE ?? 0;
      document.getElementById("count-celebrate").innerText =
        dataReaction.celebrate ??
        dataReaction.Celebrate ??
        dataReaction.CELEBRATE ??
        0;
      document.getElementById("count-pray").innerText =
        dataReaction.pray ?? dataReaction.Pray ?? dataReaction.PRAY ?? 0;
    })
    .catch((error) => {
      console.error("Gagal memuat reaction:", error);
      document
        .querySelectorAll(".reaction-count")
        .forEach((el) => (el.innerText = "0"));
    });
}

// --- JALANKAN SAAT WEBSITE DIBUKA ---
document.addEventListener("DOMContentLoaded", function () {
  muatUcapan();
  muatReaction();
});

// --- 2. Fungsi Mengirim Data Reaction Saat Tombol Diklik ---
const reactionBtns = document.querySelectorAll(".reaction-btn");
reactionBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    this.disabled = true;

    const type = this.getAttribute("data-type");
    const countSpan = this.querySelector(".reaction-count");
    let currentCount = parseInt(countSpan.innerText) || 0;

    countSpan.innerText = currentCount + 1;

    this.style.transform = "scale(1.1)";
    this.classList.replace("btn-light", "btn-secondary");

    setTimeout(() => {
      this.style.transform = "scale(1)";
      this.classList.replace("btn-secondary", "btn-light");
      this.disabled = false;
    }, 300);

    fetch(urlReaction, {
      method: "POST",
      mode: "no-cors",
      body: new URLSearchParams({ type: type }),
    }).catch((err) => console.error("Gagal menyimpan reaction:", err));
  });
});

// --- FUNGSI SALIN TEKS (REKENING & ALAMAT) ---
function copyText(elementId, btnElement) {
  // 1. Ambil teks dari elemen
  let textToCopy = document.getElementById(elementId).innerText;

  // 2. Jika yang disalin adalah rekening (ID-nya mengandung kata 'rek'), hapus semua spasinya
  if (elementId.includes("rek")) {
    textToCopy = textToCopy.replace(/\s/g, "");
  }
  // Jika alamat, biarkan apa adanya beserta spasi dan baris barunya.

  // 3. Proses menyalin
  navigator.clipboard
    .writeText(textToCopy)
    .then(function () {
      const originalContent = btnElement.innerHTML;

      // Ubah tombol jadi warna hijau (sukses)
      btnElement.classList.remove("btn-light");
      btnElement.classList.add("btn-success", "text-white");
      btnElement.innerHTML = '<i class="fa-solid fa-check me-2"></i>Tersalin!';
      btnElement.disabled = true;

      // Kembalikan ke semula setelah 2 detik
      setTimeout(function () {
        btnElement.classList.remove("btn-success", "text-white");
        btnElement.classList.add("btn-light");
        btnElement.innerHTML = originalContent;
        btnElement.disabled = false;
      }, 2000);
    })
    .catch(function (err) {
      console.error("Gagal menyalin:", err);
      alert("Gagal menyalin. Silakan coba blok teks secara manual.");
    });
}

// --- FUNGSI MENGAMBIL NAMA TAMU DARI URL (LINK) ---
document.addEventListener("DOMContentLoaded", function () {
  // Mengambil parameter '?to=' dari link URL
  const urlParams = new URLSearchParams(window.location.search);
  const namaTamu = urlParams.get("to");

  // Jika ada nama tamu di URL, ganti teks di halaman cover
  if (namaTamu) {
    const elemenNamaTamu = document.getElementById("nama-tamu");
    if (elemenNamaTamu) {
      elemenNamaTamu.innerText = namaTamu;
    }

    // (Opsional & Bonus) Mengisi otomatis nama tamu ke dalam Form RSVP dan Ucapan!
    const inputNamaRSVP = document.querySelector(
      '#formRSVP input[name="Nama"]',
    );
    const inputNamaUcapan = document.querySelector(
      '#formUcapan input[name="Nama"]',
    );

    if (inputNamaRSVP) inputNamaRSVP.value = namaTamu;
    if (inputNamaUcapan) inputNamaUcapan.value = namaTamu;
  }
});

// --- FUNGSI MENGHILANGKAN PRELOADER (Versi Tahan Banting) ---
document.addEventListener("DOMContentLoaded", function () {
  const preloader = document.getElementById("preloader");

  if (preloader) {
    // Tahan preloader selama 1.5 detik
    setTimeout(() => {
      preloader.classList.add("preloader-hidden");

      // Pemicu AOS setelah loading selesai
      if (typeof AOS !== "undefined") {
        setTimeout(() => {
          AOS.refresh();
        }, 500);
      }
    }, 1500);
  }
});
