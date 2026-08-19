import { useEffect, useRef, useState } from "react";
import {
  profil,
  lapangan,
  organisasi,
  pendidikan,
  kemampuan,
  seksi,
} from "./data";
import "./styles.css";

/* ---------------------------------------------------------------
   Ikon
   --------------------------------------------------------------- */
const Ikon = {
  wa: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.4 1.3-1.94 1.34-.5.05-1.13.07-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.8-4.17-4.94-4.36-.15-.19-1.19-1.58-1.19-3.02 0-1.43.75-2.14 1.02-2.43.27-.29.58-.36.78-.36l.56.01c.18 0 .42-.07.66.5.24.58.82 2.01.89 2.16.07.14.12.31.02.5-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.14-.3.3-.13.59.17.29.75 1.23 1.6 2 1.11.98 2.04 1.29 2.33 1.43.29.15.46.12.63-.07.17-.19.73-.85.92-1.14.19-.29.39-.24.65-.15.27.1 1.69.8 1.98.94.29.15.48.22.55.34.07.12.07.68-.17 1.35Z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6 9 6.5L21 6" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  ),
  unduh: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5" />
      <path d="M4 18.5V20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5" />
    </svg>
  ),
};

/* ---------------------------------------------------------------
   Memuat html2pdf sekali saja, saat dibutuhkan
   --------------------------------------------------------------- */
const CDN_PDF = [
  "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js",
  "https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js",
];

function pasangSkrip(src) {
  return new Promise((selesai, gagal) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = selesai;
    s.onerror = () => gagal(new Error("gagal: " + src));
    document.head.appendChild(s);
  });
}

async function muatHtml2pdf() {
  if (window.html2pdf) return window.html2pdf;
  for (const src of CDN_PDF) {
    try {
      await pasangSkrip(src);
      if (window.html2pdf) return window.html2pdf;
    } catch (_) {
      /* coba CDN berikutnya */
    }
  }
  throw new Error("Skrip PDF tidak dapat dimuat");
}

/* ---------------------------------------------------------------
   Reveal saat elemen masuk layar
   --------------------------------------------------------------- */
function usePengamatReveal() {
  useEffect(() => {
    const target = document.querySelectorAll(".reveal, .sek-kepala");
    const io = new IntersectionObserver(
      (entri) => {
        entri.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    target.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
}

/* ---------------------------------------------------------------
   Potongan kecil
   --------------------------------------------------------------- */
const Sorot = ({ children }) => <span className="mark">{children}</span>;

function KepalaSeksi({ no, judul }) {
  return (
    <div className="sek-kepala">
      <span className="sek-no">{no}</span>
      <h2 className="sek-judul">{judul}</h2>
      <span className="rule" />
    </div>
  );
}

function Centang({ teks, i }) {
  return (
    <div className="centang" style={{ "--d": `${i * 90}ms` }}>
      <span className="kotak">
        <svg viewBox="0 0 24 24">
          <path d="m4 12.5 5 5L20 6.5" />
        </svg>
      </span>
      <span>{teks}</span>
    </div>
  );
}

/* ---------------------------------------------------------------
   Aplikasi
   --------------------------------------------------------------- */
export default function App() {
  const [maju, setMaju] = useState(0);
  const [aktif, setAktif] = useState("profil");
  const [sedangEkspor, setSedangEkspor] = useState(false);
  const [pesanGagal, setPesanGagal] = useState("");
  const dokRef = useRef(null);

  usePengamatReveal();

  /* bilah kemajuan baca */
  useEffect(() => {
    const hitung = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setMaju(total > 0 ? h.scrollTop / total : 0);
    };
    hitung();
    window.addEventListener("scroll", hitung, { passive: true });
    window.addEventListener("resize", hitung);
    return () => {
      window.removeEventListener("scroll", hitung);
      window.removeEventListener("resize", hitung);
    };
  }, []);

  /* penanda seksi aktif di navigasi */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entri) => {
        entri.forEach((e) => e.isIntersecting && setAktif(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    seksi.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  /* ekspor PDF */
  const eksporPDF = async () => {
    if (sedangEkspor) return;
    setPesanGagal("");
    setSedangEkspor(true);
    try {
      const html2pdf = await muatHtml2pdf();
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      document.body.classList.add("mengekspor");
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 350));

      await html2pdf()
        .set({
          margin: 0,
          filename: "Portofolio - Novarista Rokhma Wahyuningtyas.pdf",
          image: { type: "jpeg", quality: 0.97 },
          html2canvas: {
            // Render pada lebar A4 yang stabil agar tidak terpotong/bergeser.
            scale: 2.5,
            useCORS: true,
            allowTaint: false,
            backgroundColor: "#ffffff",
            windowWidth: 794,
            width: 794,
            scrollX: 0,
            scrollY: 0,
            imageTimeout: 15000,
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: {
            mode: ["css", "legacy"],
            avoid: [
              ".sek-kepala",
              ".baris",
              ".org",
              ".didik",
              ".kartu",
              ".grup",
            ],
          },
        })
        .from(dokRef.current)
        .save();
    } catch (e) {
      setPesanGagal(
        "Ekspor PDF gagal — periksa koneksi internet, atau simpan lewat Cetak (Ctrl+P) lalu pilih Save as PDF."
      );
    } finally {
      document.body.classList.remove("mengekspor");
      setSedangEkspor(false);
    }
  };

  const tautanWa = `https://wa.me/${profil.teleponIntl}?text=${encodeURIComponent(
    profil.pesanWa
  )}`;
  const tautanEmail = `mailto:${profil.email}?subject=${encodeURIComponent(
    profil.subjekEmail
  )}`;

  return (
    <>
      <div className="progress" style={{ transform: `scaleX(${maju})` }} />

      <nav className="nav">
        <div className="nav-id">
          <b>PORTOFOLIO</b> <span>— {profil.peran}</span>
        </div>
        <div className="nav-links">
          {seksi.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={aktif === s.id ? "aktif" : ""}
            >
              {s.label}
            </a>
          ))}
        </div>
        <button
          className="btn"
          onClick={eksporPDF}
          disabled={sedangEkspor}
          title="Simpan halaman ini sebagai berkas PDF"
        >
          {Ikon.unduh}
          {sedangEkspor ? "Menyiapkan…" : "Ekspor PDF"}
        </button>
      </nav>

      {pesanGagal && (
        <div
          role="alert"
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            padding: "12px 20px",
            background: "#fff4d6",
            borderBottom: "1px solid #e8cf94",
            fontSize: "14px",
          }}
        >
          {pesanGagal}
        </div>
      )}

      <div className="dok" id="dokumen" ref={dokRef}>
        {/* ---------------- HERO ---------------- */}
        <header className="hero">
          <div className="garis" />
          <div className="hero-grid">
            <div>
              <div className="eyebrow">
                <span className="titik" />
                <span className="mono">
                   {profil.noBerkas} · {profil.lokasi}
                </span>
              </div>

              <h1 className="nama">
                {profil.namaBaris.map((b, i) => (
                  <span className="baris-topeng" key={b}>
                    <span
                      style={{ animationDelay: `${0.25 + i * 0.12}s` }}
                      className={i === 2 ? "lembut" : ""}
                    >
                      {b}
                    </span>
                  </span>
                ))}
              </h1>

              <p className="subjudul">
                Sarjana <strong>Administrasi Rumah Sakit</strong> — menangani
                pendaftaran pasien, pengelolaan data, dan rekam medis dengan
                teliti.
              </p>

              <div className="aksi">
                <a
                  className="btn"
                  href={tautanWa}
                  target="_blank"
                  rel="noreferrer"
                >
                  {Ikon.wa} Chat WhatsApp
                </a>
                <a className="btn hantu" href={tautanEmail}>
                  {Ikon.mail} Kirim email
                </a>
              </div>

              <div className="angka">
                {profil.angka.map((a) => (
                  <div key={a.label}>
                    <div className="n">{a.nilai}</div>
                    <div className="l">{a.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <figure className="foto-kartu">
              <img src={profil.foto} alt={`Pas foto ${profil.nama}`} />
              <figcaption className="foto-cap">
              </figcaption>
            </figure>
          </div>
        </header>

        {/* ---------------- PROFIL ---------------- */}
        <section className="sek" id="profil">
          <KepalaSeksi no="01" judul="Profil" />
          <div className="profil-teks">
            <p className="lead reveal">
              {profil.ringkas.split("khususnya")[0]}khususnya pada{" "}
              <Sorot>
                pelayanan administrasi, pendaftaran pasien, pengelolaan data,
                dan rekam medis.
              </Sorot>
            </p>
            <p className="lanjut reveal" style={{ "--d": "140ms" }}>
              {profil.ringkasLanjut}
            </p>
          </div>
        </section>

        {/* ---------------- PENGALAMAN ---------------- */}
        <section className="sek" id="pengalaman">
          <KepalaSeksi no="02" judul="Pengalaman" />

          <div className="sub-kepala reveal">Praktik &amp; magang</div>
          <div>
            {lapangan.map((p, i) => (
              <div
                className="baris reveal hindari-potong"
                key={p.tempat + p.tahun}
                style={{ "--d": `${i * 80}ms` }}
              >
                <div className="th">{p.tahun}</div>
                <div>
                  <div className="peran">{p.peran}</div>
                  <h3 className="tempat">{p.tempat}</h3>
                  <p className="fokus">{p.fokus}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="sub-kepala reveal">Organisasi</div>
          <div className="org-grid">
            {organisasi.map((o, i) => (
              <div
                className="org reveal hindari-potong"
                key={o.peran + o.tempat}
                style={{ "--d": `${i * 90}ms` }}
              >
                <div className="p">{o.peran}</div>
                <div className="t">{o.tempat}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- PENDIDIKAN + KEMAMPUAN ---------------- */}
        <div className="dua-kolom">
          <section className="sek" id="pendidikan">
            <KepalaSeksi no="03" judul="Pendidikan" />
            <div>
              {pendidikan.map((d, i) => (
                <div
                  className={`didik reveal hindari-potong${d.aktif ? " kini" : ""}`}
                  key={d.nama}
                  style={{ "--d": `${i * 80}ms` }}
                >
                  <div className="th">{d.tahun}</div>
                  <h3 className="nm">{d.nama}</h3>
                  {d.detail && <div className="dt">{d.detail}</div>}
                </div>
              ))}
            </div>
          </section>

          <section className="sek" id="kemampuan">
            <KepalaSeksi no="04" judul="Kemampuan" />
            {kemampuan.map((g) => (
              <div className="grup reveal hindari-potong" key={g.judul}>
                <div className="grup-judul">
                  <span className="kode">{g.kode}</span> {g.judul}
                </div>
                {g.isi.map((t, i) => (
                  <Centang teks={t} i={i} key={t} />
                ))}
              </div>
            ))}
          </section>
        </div>

        {/* ---------------- KONTAK ---------------- */}
        <section className="sek kontak" id="kontak">
          <KepalaSeksi no="05" judul="Kontak" />
          <p className="kontak-lead reveal">
            Terbuka untuk posisi <b>administrasi rumah sakit, rekam medis,</b>{" "}
            dan <b>pendaftaran pasien</b>. Balasan tercepat lewat WhatsApp.
          </p>
          <div className="kartu-grid">
            <a
              className="kartu reveal"
              href={tautanWa}
              target="_blank"
              rel="noreferrer"
            >
              <div className="kl">{Ikon.wa} WhatsApp</div>
              <div className="kv">{profil.telepon}</div>
              <div className="kk">Ketuk untuk mulai chat</div>
            </a>
            <a className="kartu reveal" href={tautanEmail} style={{ "--d": "110ms" }}>
              <div className="kl">{Ikon.mail} Email</div>
              <div className="kv">{profil.email}</div>
              <div className="kk">Ketuk untuk menulis email</div>
            </a>
            <div className="kartu pasif reveal" style={{ "--d": "220ms" }}>
              <div className="kl">{Ikon.pin} Domisili</div>
              <div className="kv" style={{ fontSize: "15px", lineHeight: 1.45 }}>
                {profil.alamat}
              </div>
              <div className="kk">Bersedia ditempatkan di Jawa Timur</div>
            </div>
          </div>
        </section>
      </div>

      <footer className="footer">
        <span className="mono">
          © {new Date().getFullYear()} {profil.nama}
        </span>
        <span className="mono">Berkas{profil.noBerkas}</span>
      </footer>
    </>
  );
}
