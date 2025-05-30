// Main JavaScript file
document.addEventListener('DOMContentLoaded', () => {
    const tutorialLink = document.getElementById('tutorialLink');
    const aboutLink = document.getElementById('aboutLink');

    if (tutorialLink) {
        tutorialLink.addEventListener('click', (e) => {
            e.preventDefault();
            const tutorialContent = `
                <div id="aboutModal" class="fixed inset-0 bg-black bg-opacity-75 hidden z-[60] flex items-center justify-center p-4">
                    <div class="modal-content bg-[#222222] text-white max-w-2xl w-full mx-auto p-6 rounded-xl shadow-lg relative max-h-[80vh] overflow-y-auto">
                        <span class="close-button absolute top-3 right-4 text-gray-400 hover:text-white text-3xl cursor-pointer" id="closeAboutModal">&times;</span>
                        <h2 class="text-2xl font-bold mb-6 text-center text-indigo-400">About Us</h2>
                        <div class="space-y-4 text-gray-300">
                            <p>Selamat datang di <strong>Py.Edia</strong> - Kamus Python Interaktif Anda!</p>
                            <p>Website ini dirancang untuk membantu Anda agar mudah mencari, memahami, dan mempelajari berbagai fungsi, kata kunci, serta konsep dasar hingga menengah dalam bahasa pemrograman Python. Anda dapat mengetikkan istilah yang ingin Anda cari, dan aplikasi akan menampilkan pengertian, contoh penggunaan yang jelas, kategori, tingkat kesulitan, serta informasi versi Python yang relevan.</p>
                            <p>Proyek ini merupakan demonstrasi penggunaan HTML, CSS, dan JavaScript untuk membuat aplikasi web yang dinamis dan interaktif, dengan fokus pada pengambilan dan penampilan data dari file JSON, serta implementasi fitur modern seperti syntax highlighting, kini dengan tampilan Tailwind CSS.</p>
                            <p>Kami berharap Py.Edia dapat menjadi teman belajar Python Anda yang bermanfaat!</p>
                        </div>
                    </div>
                </div>
            `;
            openModal('Tutorial Penggunaan', tutorialContent);
        });
    }

    if (aboutLink) {
        aboutLink.addEventListener('click', (e) => {
            e.preventDefault();
            const aboutContent = `
                <div id="tutorialModal" class="fixed inset-0 bg-black bg-opacity-75 hidden z-[60] flex items-center justify-center p-4">
                    <div class="modal-content bg-[#222222] text-white max-w-3xl w-full mx-auto p-6 rounded-xl shadow-lg relative max-h-[80vh] overflow-y-auto">
                        <span class="close-button absolute top-3 right-4 text-gray-400 hover:text-white text-3xl cursor-pointer" id="closeTutorialModal">&times;</span>
                        <h2 class="text-2xl font-bold mb-6 text-center text-indigo-400">Tutorial Penggunaan Py.Edia</h2>
                        <div class="space-y-4 text-gray-300 modal-text-content"> <p><strong>Cara Menggunakan Kamus Fungsi Python:</strong></p>
                            <ol class="list-decimal list-inside space-y-2">
                                <li><strong>Mencari Istilah:</strong>
                                    <ul class="list-disc list-inside pl-5 space-y-1 mt-1">
                                        <li>Gunakan bilah pencarian di bagian atas halaman utama.</li>
                                        <li>Ketikkan nama fungsi, kata kunci, atau topik Python yang ingin Anda cari (misalnya, <code>print</code>, <code>for loop</code>, <code>list comprehension</code>).</li>
                                        <li>Hasil pencarian akan muncul secara dinamis di bawah bilah pencarian saat Anda mengetik.</li>
                                    </ul>
                                </li>
                                <li><strong>Filter Berdasarkan Kategori:</strong>
                                    <ul class="list-disc list-inside pl-5 space-y-1 mt-1">
                                        <li>Gunakan menu dropdown "Filter Kategori" untuk mempersempit pencarian Anda pada topik tertentu (misalnya, "Fungsi Bawaan", "Struktur Data").</li>
                                        <li>Anda dapat menggabungkan filter kategori dengan pencarian teks.</li>
                                    </ul>
                                </li>
                                <li><strong>Melihat Detail:</strong>
                                    <ul class="list-disc list-inside pl-5 space-y-1 mt-1">
                                        <li>Setiap hasil pencarian akan menampilkan:
                                            <ul class="list-circle list-inside pl-5 space-y-1 mt-1">
                                                <li><strong>Nama Istilah:</strong> Ditampilkan sebagai judul.</li>
                                                <li><strong>Info Tambahan:</strong> Kategori, Tingkat Kesulitan, dan Versi Python.</li>
                                                <li><strong>Pengertian:</strong> Penjelasan mengenai istilah tersebut.</li>
                                                <li><strong>Contoh Penerapan:</strong> Cuplikan kode yang menunjukkan bagaimana istilah tersebut digunakan, lengkap dengan Highlight pada sintaks agar mudah dibaca.</li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                                <li><strong>Menjalankan Contoh Kode (Live Coding):</strong>
                                    <ul class="list-disc list-inside pl-5 space-y-1 mt-1">
                                        <li>Di bawah setiap "Contoh Penerapan" yang berisi kode yang dapat dijalankan, Anda akan menemukan tombol <strong>"Jalankan Kode"</strong>.</li>
                                        <li>Klik tombol ini untuk mengeksekusi contoh kode Python tersebut langsung di browser Anda.</li>
                                        <li>Hasil eksekusi (misalnya, output dari perintah <code>print()</code>) atau pesan error jika terjadi kesalahan, akan muncul di area khusus di bawah tombol "Jalankan Kode".</li>
                                        <li>Output dari kode akan ditampilkan dengan efek animasi seperti sedang diketik di terminal untuk pengalaman yang lebih interaktif.</li>
                                        <li>Selama kode sedang dieksekusi dan outputnya ditampilkan, tombol "Jalankan Kode" akan dinonaktifkan sementara. Ini untuk mencegah klik berulang yang dapat mengganggu proses. Tombol akan aktif kembali secara otomatis setelah eksekusi selesai.</li>
                                        <li><strong>Catatan Penting:</strong> Fitur "Jalankan Kode" ini ditenagai oleh Skulpt, sebuah interpreter Python yang berjalan di dalam browser. Meskipun Skulpt mendukung banyak fitur inti Python, mungkin ada beberapa modul atau fungsionalitas Python lanjutan yang tidak sepenuhnya didukung atau berperilaku sedikit berbeda dibandingkan jika Anda menjalankan kode di lingkungan Python standar (native). Kami telah berusaha menyesuaikan contoh agar kompatibel.</li>
                                    </ul>
                                </li>
                                <li><strong>Menutup Pop-up (About Us/Tutorial):</strong>
                                    <ul class="list-disc list-inside pl-5 space-y-1 mt-1">
                                        <li>Klik tombol '×' di pojok kanan atas jendela pop-up.</li>
                                        <li>Anda juga bisa mengklik di mana saja di luar area konten pop-up untuk menutupnya.</li>
                                    </ul>
                                </li>
                            </ol>
                            <p>Selamat belajar dan mencoba coding dengan Py.Edia!</p>
                        </div>
                    </div>
                </div>
            `;
            openModal('Tentang Kamus Ini', aboutContent);
        });
    }
});

