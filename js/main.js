document.addEventListener('DOMContentLoaded', () => {
    const getEl = id => document.getElementById(id);
    const queryEl = (parent, selector) => parent.querySelector(selector);
    const queryAllEl = (parent, selector) => parent.querySelectorAll(selector);

    const tutorialLink = getEl('tutorialLink');
    const aboutLink = getEl('aboutLink');

    const hasilPencarianDiv = getEl('hasilPencarianDiv');
    const categoryFilter = getEl('categoryFilter');
    const searchBar = getEl('searchBar');
    const kamusItemTemplate = getEl('kamusItemTemplate');

    const liveCodingModal = getEl('liveCodingModal');
    const closeLiveCodingModalBtn = getEl('closeLiveCodingModal');
    const liveCodeEditor = getEl('liveCodeEditor');
    const liveCodeOutput = getEl('liveCodeOutput');
    const runLiveCodeBtn = getEl('runLiveCodeBtn');
    const liveCodingModalTitle = getEl('liveCodingModalTitle');

    if (aboutLink) {
        aboutLink.addEventListener('click', (e) => {
            e.preventDefault();

            // Hapus modal about us lama jika ada (untuk mencegah duplikasi jika diklik berkali-kali)
            const existingAboutModal = document.getElementById('aboutModal');
            if (existingAboutModal) {
                existingAboutModal.remove();
            }

            const aboutContentHTML = `
                <div id="aboutModal" class="fixed inset-0 bg-black bg-opacity-75 z-[60] flex items-center justify-center p-4">
                    <div class="modal-content bg-[#222222] text-white max-w-2xl w-full mx-auto p-6 rounded-xl shadow-lg relative max-h-[80vh] overflow-y-auto">
                        <span class="close-button absolute top-3 right-4 text-gray-400 hover:text-white text-3xl cursor-pointer" id="closeAboutModalBtn">&times;</span>
                        <h2 class="text-2xl font-bold mb-6 text-center text-indigo-400">Tentang Py.Edia</h2>
                        <div class="space-y-4 text-gray-300 modal-text-content">
                            <p>Selamat datang di <strong>Py.Edia</strong> - Kamus Python Interaktif Anda!</p>
                            <p>Aplikasi ini dirancang untuk membantu Anda dengan mudah mencari, memahami, dan mempelajari berbagai fungsi, kata kunci, serta konsep dasar hingga menengah dalam bahasa pemrograman Python. Anda dapat mengetikkan istilah yang ingin Anda cari, dan aplikasi akan menampilkan pengertian, contoh penggunaan yang jelas, kategori, tingkat kesulitan, serta informasi versi Python yang relevan.</p>
                            <p>Proyek ini merupakan demonstrasi penggunaan HTML, CSS, dan JavaScript untuk membuat aplikasi web yang dinamis dan interaktif, dengan fokus pada pengambilan dan penampilan data dari file JSON, serta implementasi fitur modern seperti syntax highlighting, kini dengan tampilan Tailwind CSS.</p>
                            <p>Kami berharap Py.Edia dapat menjadi teman belajar Python Anda yang bermanfaat!</p>
                        </div>
                    </div>
                </div>
            `;

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = aboutContentHTML.trim();
            const aboutModalElement = tempDiv.firstChild;

            if (aboutModalElement) {
                document.body.appendChild(aboutModalElement);
                aboutModalElement.classList.remove('hidden');

                const closeAboutBtn = aboutModalElement.querySelector('#closeAboutModalBtn');
                if (closeAboutBtn) {
                    closeAboutBtn.addEventListener('click', () => {
                        aboutModalElement.remove();
                    });
                }
                aboutModalElement.addEventListener('click', (event) => {
                    if (event.target === aboutModalElement) {
                         aboutModalElement.remove();
                    }
                });
            }
        });
    }

    if (tutorialLink) {
        tutorialLink.addEventListener('click', (e) => {
            e.preventDefault();
            const existingTutorialModal = document.getElementById('tutorialModal');
            if (existingTutorialModal) {
                existingTutorialModal.remove();
            }

            const tutorialContentHTML = `
                <div id="tutorialModal" class="fixed inset-0 bg-black bg-opacity-75 z-[60] flex items-center justify-center p-4">
                    <div class="modal-content bg-[#222222] text-white max-w-3xl w-full mx-auto p-6 rounded-xl shadow-lg relative max-h-[80vh] overflow-y-auto">
                        <span class="close-button absolute top-3 right-4 text-gray-400 hover:text-white text-3xl cursor-pointer" id="closeTutorialModalBtn">&times;</span>
                        <h2 class="text-2xl font-bold mb-6 text-center text-indigo-400">Tutorial Penggunaan Py.Edia</h2>
                        <div class="space-y-4 text-gray-300 modal-text-content">
                            <p><strong>Cara Menggunakan Kamus Fungsi Python:</strong></p>
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
                                                <li><strong>Info Tambahan:</strong> Kategori, Tingkat Kesulitan.</li>
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

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = tutorialContentHTML.trim();
            const tutorialModalElement = tempDiv.firstChild;

            if (tutorialModalElement) {
                document.body.appendChild(tutorialModalElement);
                tutorialModalElement.classList.remove('hidden');

                const closeTutorialBtn = tutorialModalElement.querySelector('#closeTutorialModalBtn');
                if (closeTutorialBtn) {
                    closeTutorialBtn.addEventListener('click', () => {
                        tutorialModalElement.remove();
                    });
                }
                tutorialModalElement.addEventListener('click', (event) => {
                    if (event.target === tutorialModalElement) {
                         tutorialModalElement.remove();
                    }
                });
            }
        });
    }

    let kamusData = [];

    function toggleModal(modalElement, show) {
        if (modalElement) {
            modalElement.classList.toggle('hidden', !show);
            modalElement.classList.toggle('flex', show);
        }
    }

    if (liveCodingModal) {
        toggleModal(liveCodingModal, false);
    }

    function setElementText(element, text, defaultValue = 'N/A') {
        if (element) {
            element.textContent = text || defaultValue;
        }
    }

    function setElementHTML(element, htmlContent) {
        if (element) {
            element.innerHTML = htmlContent;
        }
    }

    function toggleElementDisplay(element, show) {
        if (element) {
            element.style.display = show ? 'block' : 'none';
        }
    }
    
    function setButtonState(buttonElement, disabled) {
        if (buttonElement) {
            buttonElement.disabled = disabled;
            buttonElement.classList.toggle('opacity-50', disabled);
            buttonElement.classList.toggle('cursor-not-allowed', disabled);
        }
    }


    function muatKamus() {
        if (kamusData && kamusData.length > 0) {
            populateCategoryFilter(kamusData);
            if (hasilPencarianDiv) {
                setElementHTML(hasilPencarianDiv, `<p class="col-span-full text-center text-gray-400 py-10">Silakan pilih kategori atau lakukan pencarian untuk menampilkan istilah.</p>`);
            }
        } else {
            console.warn("muatKamus() dipanggil, tetapi kamusData kosong atau belum siap.");
            if (hasilPencarianDiv) {
                setElementHTML(hasilPencarianDiv, `<div class="col-span-full text-center text-orange-400 p-4 bg-gray-800 border border-orange-500 rounded-md">Data kamus tidak dapat diproses saat ini.</div>`);
            }
        }
    }

    function populateCategoryFilter(data) {
        if (!categoryFilter) return;
        const categories = new Set(data.map(item => item.kategori).filter(Boolean));
        const sortedCategories = Array.from(categories).sort();
        
        while (categoryFilter.options.length > 2) {
            categoryFilter.remove(2);
        }
        sortedCategories.forEach(kategori => {
            const option = document.createElement('option');
            option.value = kategori;
            option.textContent = kategori;
            option.classList.add('bg-gray-700', 'text-gray-200');
            categoryFilter.appendChild(option);
        });
    }

    function filterAndDisplay() {
        if (!kamusData || !searchBar || !categoryFilter) return;
        const searchTerm = searchBar.value.toLowerCase().trim();
        const selectedCategoryValue = categoryFilter.value;

        if (selectedCategoryValue === "" && searchTerm === "") {
            tampilkanHasil([]);
            return;
        }

        const filteredData = kamusData.filter(item => {
            const termMatch = !searchTerm || (
                (item.namaFungsi && item.namaFungsi.toLowerCase().includes(searchTerm)) ||
                (item.kategori && item.kategori.toLowerCase().includes(searchTerm)) ||
                (item.tingkat && item.tingkat.toLowerCase().includes(searchTerm))
            );
            if (!termMatch) return false;
            return selectedCategoryValue === "" || selectedCategoryValue === "all" || item.kategori === selectedCategoryValue;
        });
        tampilkanHasil(filteredData);
    }
    
    function setDataOrHide(parentElement, sectionSelector, fieldSelector, data, isHTML = false) {
        const sectionElement = queryEl(parentElement, `[data-section="${sectionSelector}"]`);
        if (!sectionElement) return;

        const fieldElement = queryEl(sectionElement, `[data-field="${fieldSelector}"]`);
        const hasData = data && data.length > 0;

        if (hasData && fieldElement) {
            if (isHTML) setElementHTML(fieldElement, data);
            else setElementText(fieldElement, data, ''); // Use empty string default for content fields
        }
        toggleElementDisplay(sectionElement, hasData);
    }

    function populateListOrHide(parentElement, sectionName, listData, createListItemFn) {
        const sectionElement = queryEl(parentElement, `[data-section="${sectionName}"]`);
        if (!sectionElement) return;

        const listElement = queryEl(sectionElement, `[data-field="${sectionName}"]`);
        const emptyMsgElement = queryEl(sectionElement, `[data-message="${sectionName}-empty"]`);
        
        if (listElement) setElementHTML(listElement, ''); 

        const hasValidData = listData && Array.isArray(listData);
        const hasItems = hasValidData && listData.length > 0;

        if (hasItems) {
            listData.forEach(itemData => {
                const li = createListItemFn(itemData);
                if (li && listElement) listElement.appendChild(li);
            });
        }
        
        toggleElementDisplay(listElement, hasItems);
        toggleElementDisplay(emptyMsgElement, hasValidData && listData.length === 0);
        toggleElementDisplay(sectionElement, hasValidData);
    }


    function tampilkanHasil(hasil) {
        if (!hasilPencarianDiv || !kamusItemTemplate) return;
        setElementHTML(hasilPencarianDiv, '');

        if (hasil.length === 0) {
            setElementHTML(hasilPencarianDiv, '<p class="col-span-full text-center text-gray-400 py-10">Tidak ada istilah yang cocok dengan pencarian Anda.</p>');
            return;
        }

        const fragment = document.createDocumentFragment();
        hasil.forEach(item => {
            const cardClone = kamusItemTemplate.content.cloneNode(true);

            setElementText(queryEl(cardClone, '[data-field="namaFungsi"]'), item.namaFungsi);
            setElementText(queryEl(cardClone, '[data-field="kategori"]'), item.kategori);
            setElementText(queryEl(cardClone, '[data-field="tingkat"]'), item.tingkat);
            setElementText(queryEl(cardClone, '[data-field="pengertian"]'), item.pengertian);

            setDataOrHide(cardClone, 'contohPenggunaan', 'contohPenggunaan',
                item.contohPenggunaan ? item.contohPenggunaan.replace(/\n/g, '<br>') : null, true);

            populateListOrHide(cardClone, 'parameter', item.parameter, p => {
                const li = document.createElement('li');
                if (typeof p === 'object' && p.nama && p.deskripsi) {
                    setElementHTML(li, `<strong>${p.nama}:</strong> ${p.deskripsi}`);
                } else if (typeof p === 'string') {
                    setElementText(li, p, '');
                }
                return li;
            });
            
            setDataOrHide(cardClone, 'nilaiKembali', 'nilaiKembali', item.nilaiKembali);
            setDataOrHide(cardClone, 'catatanPenting', 'catatanPenting', item.catatanPenting);

            populateListOrHide(cardClone, 'potensiError', item.potensiError, errText => {
                const li = document.createElement('li');
                setElementText(li, errText, '');
                return li;
            });

            const moreContentDiv = queryEl(cardClone, '.more-content');
            const toggleMoreButton = queryEl(cardClone, '[data-action="toggleMore"]');

            if (moreContentDiv && toggleMoreButton) {
                const dataSectionsInMoreContent = queryAllEl(moreContentDiv, '[data-section]');
                const hasActualDataInMoreContent = Array.from(dataSectionsInMoreContent).some(
                    section => section.style.display !== 'none'
                );

                toggleElementDisplay(toggleMoreButton, hasActualDataInMoreContent);
                if (hasActualDataInMoreContent) {
                    toggleMoreButton.addEventListener('click', () => {
                        const isHidden = moreContentDiv.classList.contains('max-h-0');
                        moreContentDiv.classList.toggle('max-h-0', !isHidden);
                        moreContentDiv.classList.toggle('opacity-0', !isHidden);
                        moreContentDiv.classList.toggle('max-h-[1000px]', isHidden);
                        moreContentDiv.classList.toggle('opacity-100', isHidden);
                        setElementText(toggleMoreButton, isHidden ? 'Tampilkan Lebih Sedikit' : 'Tampilkan Lebih Banyak', '');
                    });
                }
            }

            const liveCodeButton = queryEl(cardClone, '[data-action="openLiveCode"]');
            if (liveCodeButton) {
                const hasCode = item.contohPenggunaan && item.contohPenggunaan.trim() !== "";
                toggleElementDisplay(liveCodeButton, hasCode);
                if (hasCode) {
                    liveCodeButton.addEventListener('click', () => {
                        openLiveCodingModal(item.namaFungsi, item.contohPenggunaan);
                    });
                }
            }
            fragment.appendChild(cardClone);
        });
        hasilPencarianDiv.appendChild(fragment);
    }

    function typePythonOutputChunkAnimated(textChunk, outputDivElement, onFinishedCallback) {
        let i = 0;
        function type() {
            if (i < textChunk.length) {
                const char = textChunk[i];
                let newChar = char;
                if (char === '\n') {
                    outputDivElement.innerHTML += '<br>';
                } else if (char !== '<' && char !== '>' && char !== '&') { // Basic escaping, improve if needed
                     newChar = char.replace(/&/g, "&amp;")
                                 .replace(/</g, "&lt;")
                                 .replace(/>/g, "&gt;");
                    outputDivElement.innerHTML += newChar;
                } else {
                    outputDivElement.innerHTML += newChar; // Allow specific HTML like <br> if it comes from Skulpt
                }
                i++;
                setTimeout(type, 15);
            } else {
                if (onFinishedCallback) onFinishedCallback();
            }
        }
        type();
    }
    
    function openLiveCodingModal(namaFungsi, contohPenggunaan) {
        if (liveCodingModal && liveCodeEditor && liveCodeOutput && liveCodingModalTitle && closeLiveCodingModalBtn && runLiveCodeBtn) {
            setElementText(liveCodingModalTitle, `Live Coding: ${namaFungsi}`, '');
            liveCodeEditor.value = contohPenggunaan || "# Tidak ada contoh penggunaan.\n# Silakan ketik kode Python Anda di sini.";
            setElementHTML(liveCodeOutput, '<span class="italic text-gray-500">Klik "Jalankan Kode" untuk melihat output.</span>');
            setButtonState(runLiveCodeBtn, false);
            toggleModal(liveCodingModal, true);
        } else {
            console.error("Elemen modal live coding tidak lengkap atau tidak ditemukan.");
        }
    }
    
    function closeLiveCodingModal() {
        if (liveCodingModal) {
            toggleModal(liveCodingModal, false);
        }
    }

    if (closeLiveCodingModalBtn) {
        closeLiveCodingModalBtn.addEventListener('click', closeLiveCodingModal);
    }

    if (runLiveCodeBtn && liveCodeEditor) {
        runLiveCodeBtn.addEventListener('click', () => {
            runPythonCode(liveCodeEditor.value, 'liveCodeOutput', runLiveCodeBtn);
        });
    }

    function runPythonCode(codeToRun, outputElementId, buttonElement) {
        setButtonState(buttonElement, true);

        const outputDiv = getEl(outputElementId);
        if (!outputDiv) {
            console.error(`Error: Elemen output dengan ID '${outputElementId}' tidak ditemukan.`);
            setButtonState(buttonElement, false);
            return;
        }
        setElementHTML(outputDiv, '<span class="italic text-gray-500">Menjalankan kode...</span>');

        const placeholderTextColorClass = 'text-gray-500';
        const errorTextColorClass = 'text-red-400';
        let outputProcessingPromise = Promise.resolve();

        Sk.configure({
            output: function(text) {
                outputProcessingPromise = outputProcessingPromise.then(() => 
                    new Promise(resolve => {
                        if (outputDiv.innerHTML.startsWith('<span class="italic text-gray-500">')) {
                             setElementHTML(outputDiv, '');
                        }
                        typePythonOutputChunkAnimated(text, outputDiv, resolve);
                    })
                );
            },
            read: function(filePath) {
                if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][filePath] === undefined) {
                    throw new Sk.builtin.IOError(`File not found: '${filePath}'`);
                }
                return Sk.builtinFiles["files"][filePath];
            },
            __future__: Sk.python3,
            retainglobals: true // Be cautious with this, can lead to state issues between runs
        });

        Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, codeToRun, true))
            .then(() => { // Success
                outputProcessingPromise.then(() => {
                    if (outputDiv.innerHTML.trim() === '' || outputDiv.innerHTML.startsWith('<span class="italic text-gray-500">')) {
                        setElementHTML(outputDiv, `<span class="code-output-placeholder italic ${placeholderTextColorClass}">Eksekusi selesai. Tidak ada output standar.</span>`);
                    }
                    setButtonState(buttonElement, false);
                });
            })
            .catch(error => { // Error
                outputProcessingPromise.then(() => {
                    console.error("Error saat eksekusi Skulpt:", error);
                    let errorMessage = error.toString();
                     if (error.tp$name && error.args && error.args.v.length > 0) {
                        errorMessage = `${error.tp$name}: ${Sk.ffi.remapToJs(error.args.v[0])}`;
                        if (error.traceback && error.traceback.length > 0) {
                            const lastTrace = error.traceback[error.traceback.length - 1];
                            if (lastTrace.lineno !== undefined) errorMessage += ` (line ${lastTrace.lineno})`;
                        }
                    } else if (error.nativeError && error.nativeError.message) {
                        errorMessage = `Skulpt Internal Error: ${error.nativeError.message}`;
                    }
                    setElementHTML(outputDiv, `<span class="code-output-error ${errorTextColorClass} font-semibold">Error: ${errorMessage.replace(/\n/g, "<br>")}</span>`);
                    setButtonState(buttonElement, false);
                });
            });
    }

    fetch('dictionary.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) throw new Error("Format data kamus tidak valid. Seharusnya berupa array.");
            kamusData = data;
            muatKamus();
        })
        .catch(error => {
            console.error("Gagal memuat atau memproses data dari dictionary:", error);
            if (hasilPencarianDiv) {
                setElementHTML(hasilPencarianDiv, `<div class="col-span-full text-center text-red-400 p-4 bg-gray-800 border border-red-500 rounded-md">Gagal memuat data kamus: ${error.message}</div>`);
            }
        });

    fetch('funfact.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(funFactsData => {
            if (funFactsData && funFactsData.length > 0) { //
                const shuffledFacts = funFactsData.sort(() => 0.5 - Math.random()); //

                const factsToDisplay = shuffledFacts.slice(0, 3); //

                factsToDisplay.forEach((fact, index) => {
                    const titleElement = document.getElementById(`funfact-title-${index + 1}`); //
                    const contentElement = document.getElementById(`funfact-content-${index + 1}`); //

                    if (titleElement && contentElement) {
                        titleElement.textContent = fact.judul || `Fun Fact ${index + 1}`; //
                        contentElement.textContent = fact.isi || 'Tidak ada konten.'; //
                    }
                });

                for (let i = factsToDisplay.length; i < 3; i++) { //
                    const titleElement = document.getElementById(`funfact-title-${i + 1}`); //
                    const contentElement = document.getElementById(`funfact-content-${i + 1}`); //
                    if (titleElement && contentElement) {
                        titleElement.textContent = `Fun Fact ${i + 1}`; //
                        contentElement.textContent = 'Tidak ada fakta tambahan.'; //
                    }
                }
            } else if (funFactsData && funFactsData.length === 0) { //
                for (let i = 1; i <= 3; i++) {
                    const titleElement = document.getElementById(`funfact-title-${i}`); //
                    const contentElement = document.getElementById(`funfact-content-${i}`); //
                    if (titleElement) titleElement.textContent = `Fun Fact ${i}`; //
                    if (contentElement) contentElement.textContent = 'Tidak ada fakta tersedia saat ini.'; //
                }
            } else {
                throw new Error("Format data fun facts tidak valid."); //
            }
        })
        .catch(error => {
            console.error("Tidak dapat memuat atau memproses data fun facts:", error); //
            for (let i = 1; i <= 3; i++) {
                const titleElement = document.getElementById(`funfact-title-${i}`); //
                const contentElement = document.getElementById(`funfact-content-${i}`); //
                if (titleElement) titleElement.textContent = `Fun Fact ${i}`; //
                if (contentElement) contentElement.textContent = 'Gagal memuat FunFacts.'; //
            }
        });

    if (searchBar) searchBar.addEventListener('input', filterAndDisplay);
    if (categoryFilter) categoryFilter.addEventListener('change', filterAndDisplay);
});
