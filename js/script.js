document.addEventListener("DOMContentLoaded", function () {
  // --- Variabel Global ---
  const audio = document.getElementById("background-music");
  const musicControlButton = document.getElementById("music-control");
  const scrollTopButton = document.getElementById("scroll-to-top");
  const frame = document.getElementById("mobile-frame");
  const scrollContent = document.getElementById("scroll-content");
  const body = document.body;

  // ===================================
  // === 1. INISIALISASI AOS (PERBAIKAN) ===
  // ===================================
  // Inisialisasi TANPA scrollContainer. Kita akan memicunya secara manual.
  AOS.init({
    duration: 1000,
  });

  // ===================================
  // === 2. INISIALISASI GLIGHTBOX ===
  // ===================================
  const lightbox = GLightbox({
    selector: ".g-link",
    gallery: "galeri-pernikahan",
    touchNavigation: true,
    loop: true,
  });

  // ===================================
  // === 3. TAMBAHKAN KEMBALI TYPED.JS ===
  // ===================================
  const typedElement = document.getElementById("typed-quote");
  if (typedElement) {
    // 1. Tambah class ke body untuk sembunyikan teks statis
    document.body.classList.add("js-has-run");

    // 2. Ambil teks asli (jika perlu) atau definisikan
    const quoteText =
      "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.";

    var typedOptions = {
      strings: [quoteText], // Teks yang akan diketik
      typeSpeed: 25, // Kecepatan mengetik
      loop: false,
      showCursor: true,
      cursorChar: "|",
      startDelay: 2000, // Tunda 2 detik
    };

    // 3. Hapus teks statis SEBELUM memulai
    const staticText = typedElement.querySelector(".static-text");
    if (staticText) {
      staticText.remove();
    }

    // 4. Jalankan Typed.js
    var typed = new Typed("#typed-quote", typedOptions);
  }

  // =========================================
  // === 4. COUNTDOWN TIMER ===
  // =========================================
  function startCountdown() {
    const targetDate = new Date(2026, 4, 24, 9, 0, 0).getTime();
    const daysEl = document.getElementById("countdown-days");
    const hoursEl = document.getElementById("countdown-hours");
    const minutesEl = document.getElementById("countdown-minutes");
    const secondsEl = document.getElementById("countdown-seconds");
    const countdownTimerEl = document.querySelector(".countdown-timer");

    if (!countdownTimerEl) return; // Berhenti jika elemen tidak ada

    const countdownInterval = setInterval(function () {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        daysEl.innerHTML = String(days).padStart(2, "0");
        hoursEl.innerHTML = String(hours).padStart(2, "0");
        minutesEl.innerHTML = String(minutes).padStart(2, "0");
        secondsEl.innerHTML = String(seconds).padStart(2, "0");
      } else {
        clearInterval(countdownInterval);
        countdownTimerEl.innerHTML =
          "<h4 style=\"font-family: 'Playfair Display', serif;\">Acara Telah Dimulai</h4>";
      }
    }, 1000);
  }
  startCountdown();

  // =========================================
  // === 5. KODE BUKA UNDANGAN ===
  // =========================================
  const openButton = document.getElementById("open-invitation");
  const heroSection = document.querySelector(".hero-section");
  const mainContent = document.querySelector("section");

  if (openButton) {
    openButton.addEventListener("click", function (e) {
      e.preventDefault();
      heroSection.classList.add("hidden");
      frame.classList.remove("locked");

      document.querySelector(".quote-animate").classList.add("is-visible");

      // REFRESH AOS setelah cover hilang
      setTimeout(() => {
        AOS.refresh();
      }, 700); // Samakan dengan durasi transisi .hero-section.hidden

      // Putar musik
      if (audio) {
        audio.play().catch((error) => {
          console.log("Autoplay dicegah oleh browser.");
        });
        musicControlButton.classList.add("show");
        musicControlButton.classList.add("is-playing");
      }

      // Scroll ke konten
      if (mainContent) {
        setTimeout(() => {
          scrollContent.scrollTo({
            top: mainContent.offsetTop,
            behavior: "smooth",
          });
        }, 300);
      }

      // Jeda 1 detik sebelum memulai animasi daun
    });
  } else {
    console.error("Tombol 'open-invitation' tidak ditemukan. Cek ID Anda.");
  }

  // =========================================
  // === 6. TOMBOL MUSIK ===
  // =========================================
  if (musicControlButton && audio) {
    musicControlButton.addEventListener("click", function () {
      if (audio.paused) {
        audio.play();
        musicControlButton.classList.add("is-playing");
      } else {
        audio.pause();
        musicControlButton.classList.remove("is-playing");
      }
    });
  }

  // =========================================
  // === 7. LOGIKA SCROLL (PERBAIKAN AOS) ===
  // =========================================
  if (scrollTopButton && scrollContent) {
    scrollContent.addEventListener("scroll", function () {
      // 1. Logika untuk tombol Scroll-to-Top
      if (this.scrollTop > 300) {
        scrollTopButton.classList.add("show");
      } else {
        scrollTopButton.classList.remove("show");
      }

      // 2. PERBAIKAN AOS:
      // Panggil AOS.refresh() setiap kali div di-scroll
      // Ini akan "membangunkan" AOS dan memicu animasi
      AOS.refresh();
    });

    // Aksi klik untuk tombol scroll
    scrollTopButton.addEventListener("click", function (e) {
      e.preventDefault();
      scrollContent.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // =========================================
  // === 8. LOGIKA TOMBOL SALIN ===
  // =========================================
  const copyButtons = document.querySelectorAll(".btn-salin");
  copyButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      let textToCopy = "";
      const originalText = button.innerHTML;
      const clipboardText = button.getAttribute("data-clipboard-text");
      const clipboardTarget = button.getAttribute("data-clipboard-target");

      if (clipboardText) {
        textToCopy = clipboardText;
      } else if (clipboardTarget) {
        const targetElement = document.querySelector(clipboardTarget);
        if (targetElement) {
          textToCopy = targetElement.innerText;
        }
      }

      if (textToCopy) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            button.innerHTML = "Tersalin!";
            button.style.backgroundColor = "#28a745";
            setTimeout(() => {
              button.innerHTML = originalText;
              button.style.backgroundColor = "";
            }, 2000);
          })
          .catch((err) => {
            console.error("Gagal menyalin: ", err);
          });
      }
    });
  });

  // ===================================
  // === 9. FORM RSVP KE GOOGLE SHEETS ===
  // ===================================
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbzfLlMqqdw70OuN9soMX6VvGv7Hmpbeoqozgr67Nrtb_ppTUeeOnOg1f8BUFdmsyRQuww/exec"; // <-- GANTI DENGAN URL DARI LANGKAH 1
  const form = document.forms["submit-to-google-sheet"];

  if (form) {
    const btnKirim = form.querySelector(".btn-kirim");
    const btnLoading = form.querySelector(".btn-loading");
    const myAlert = document.getElementById("rsvp-alert");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Tampilkan tombol loading, sembunyikan tombol kirim
      btnKirim.classList.add("d-none");
      btnLoading.classList.remove("d-none");

      fetch(scriptURL, { method: "POST", body: new FormData(form) })
        .then((response) => {
          // Tampilkan tombol kirim kembali, sembunyikan loading
          btnLoading.classList.add("d-none");
          btnKirim.classList.remove("d-none");

          // Tampilkan alert sukses
          myAlert.classList.remove("d-none");

          // Reset isi form
          form.reset();

          // Hilangkan alert setelah 5 detik
          setTimeout(() => {
            myAlert.classList.add("d-none");
          }, 5000);
        })
        .catch((error) => {
          console.error("Error!", error.message);
          btnLoading.classList.add("d-none");
          btnKirim.classList.remove("d-none");
          alert(
            "Maaf, terjadi kesalahan saat mengirim data. Silakan coba lagi.",
          );
        });
    });
  }

  // ===================================
  // === 10. BUKU TAMU GOOGLE SHEETS ===
  // ===================================
  const gbScriptURL =
    "https://script.google.com/macros/s/AKfycbwXtvVzivx3WkHH7rhzA5LDft4qHI_dt1Ovp5-wKua54PJ9w9yP7aD0egbMWeCL8qaW/exec";
  const gbForm = document.forms["submit-to-google-sheet-guestbook"];
  const commentsContainer = document.getElementById("comments-container");

  // Fungsi untuk mengambil dan menampilkan komentar dari G-Sheet
  function loadComments() {
    if (!commentsContainer) return;

    fetch(gbScriptURL)
      .then((response) => response.json())
      .then((data) => {
        commentsContainer.innerHTML = ""; // Bersihkan tulisan "Memuat ucapan..."

        if (data.length === 0) {
          commentsContainer.innerHTML =
            '<p class="text-center text-light">Belum ada ucapan. Jadilah yang pertama!</p>';
          return;
        }

        data.forEach((comment) => {
          // Format tanggal menjadi tulisan (Misal: 14 Februari 2026)
          const dateObj = new Date(comment.timestamp);
          const dateStr = dateObj.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          // Template HTML untuk setiap komentar
          const commentHTML = `
            <div class="comment-box" data-aos="fade-up">
              <div class="comment-name">${comment.nama}</div>
              <div class="comment-date">${dateStr}</div>
              <p class="comment-text">${comment.ucapan}</p>
            </div>
          `;
          commentsContainer.innerHTML += commentHTML;
        });
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
        commentsContainer.innerHTML =
          '<p class="text-center text-danger">Gagal memuat ucapan.</p>';
      });
  }

  // Langsung load komentar saat halaman dibuka
  loadComments();

  // Fungsi untuk mengirim komentar saat form disubmit
  if (gbForm) {
    const btnKirimGb = gbForm.querySelector(".btn-kirim-gb");
    const btnLoadingGb = gbForm.querySelector(".btn-loading-gb");
    const alertGb = document.getElementById("gb-alert");

    gbForm.addEventListener("submit", (e) => {
      e.preventDefault();

      btnKirimGb.classList.add("d-none");
      btnLoadingGb.classList.remove("d-none");

      fetch(gbScriptURL, { method: "POST", body: new FormData(gbForm) })
        .then((response) => {
          btnLoadingGb.classList.add("d-none");
          btnKirimGb.classList.remove("d-none");
          alertGb.classList.remove("d-none");
          gbForm.reset();

          // Setelah terkirim, langsung muat ulang daftar komentar
          // sehingga ucapan baru langsung muncul tanpa harus refresh halaman!
          loadComments();

          setTimeout(() => {
            alertGb.classList.add("d-none");
          }, 5000);
        })
        .catch((error) => {
          console.error("Error!", error.message);
          btnLoadingGb.classList.add("d-none");
          btnKirimGb.classList.remove("d-none");
          alert("Maaf, terjadi kesalahan saat mengirim ucapan.");
        });
    });
  }

  // =========================================
  // === 11. BACA NAMA TAMU DARI URL (URL PARAMETER) ===
  // =========================================
  const namaTamuElement = document.getElementById("nama-tamu");

  if (namaTamuElement) {
    // Mengambil parameter dari URL
    const urlParams = new URLSearchParams(window.location.search);
    // Kita gunakan parameter "?to=" atau "?kepada="
    const namaTamu = urlParams.get("to") || urlParams.get("kepada");

    // Jika ada parameter nama, ganti teksnya
    if (namaTamu) {
      // Mengganti karakter khusus (jika ada) dan menampilkannya
      namaTamuElement.innerText = namaTamu;
    } else {
      // Jika tidak ada parameter di URL, tampilkan teks default
      namaTamuElement.innerText = "Tamu Spesial Kami";
    }
  }

  // ===================================
  // === 12. VOTING REACTION SYSTEM ====
  // ===================================
  const reactionScriptURL =
    "https://script.google.com/macros/s/AKfycbxELaMV3A_IFRUd_7ON7C_lbkyj4js0M1VOHaoCLicPYJE7VhtXWgDNjjbB9s3wr30/exec"; // <-- GANTI INI
  const reactionButtons = document.querySelectorAll(".btn-reaction");

  // Fungsi untuk update angka di layar
  function updateReactionUI(data) {
    document.getElementById("count-love").innerText = data.love;
    document.getElementById("count-party").innerText = data.party;
    document.getElementById("count-pray").innerText = data.pray;
  }

  // 1. Ambil data awal saat website dibuka
  fetch(reactionScriptURL)
    .then((response) => response.json())
    .then((data) => updateReactionUI(data))
    .catch((error) => console.error("Error fetching reactions:", error));

  // 2. Fungsi saat tombol diklik
  reactionButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const type = this.getAttribute("data-type");

      // Animasi klik
      this.classList.add("clicked");
      setTimeout(() => this.classList.remove("clicked"), 300);

      // Angka sementara ditambah 1 agar terasa cepat (optimistic UI)
      const countSpan = this.querySelector(".count");
      countSpan.innerText = parseInt(countSpan.innerText) + 1;

      // Cegah spam klik (disable tombol sebentar)
      this.style.pointerEvents = "none";
      setTimeout(() => (this.style.pointerEvents = "auto"), 2000);

      // Kirim data ke Google Sheets menggunakan POST
      const formData = new FormData();
      formData.append("type", type);

      fetch(reactionScriptURL, { method: "POST", body: formData })
        .then((response) => response.json())
        .then((data) => updateReactionUI(data)) // Sinkronisasi ulang dengan data asli di server
        .catch((error) => console.error("Error updating reaction:", error));
    });
  });
}); // Akhir DOMContentLoaded
