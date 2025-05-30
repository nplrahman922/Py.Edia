document.addEventListener("DOMContentLoaded", () => {
  const getEl = (id) => document.getElementById(id)
  const queryEl = (parent, selector) => parent.querySelector(selector)
  const queryAllEl = (parent, selector) => parent.querySelectorAll(selector)

  const tutorialLink = getEl("tutorialLink")
  const aboutLink = getEl("aboutLink")
  const mobileTutorialLink = getEl("mobileTutorialLink")
  const mobileAboutLink = getEl("mobileAboutLink")

  const hasilPencarianDiv = getEl("hasilPencarianDiv")
  const categoryFilter = getEl("categoryFilter")
  const searchBar = getEl("searchBar")
  const kamusItemTemplate = getEl("kamusItemTemplate")

  const liveCodingModal = getEl("liveCodingModal")
  const closeLiveCodingModalBtn = getEl("closeLiveCodingModal")
  const liveCodeEditor = getEl("liveCodeEditor")
  const liveCodeOutput = getEl("liveCodeOutput")
  const runLiveCodeBtn = getEl("runLiveCodeBtn")
  const liveCodingModalTitle = getEl("liveCodingModalTitle")

  // Mobile menu elements
  const mobileMenu = getEl("mobileMenu")
  const mobileMenuOverlay = getEl("mobileMenuOverlay")

  // Function to close mobile menu
  function closeMobileMenu() {
    if (mobileMenu && mobileMenuOverlay) {
      mobileMenu.classList.remove("open")
      mobileMenuOverlay.classList.remove("open")
      document.querySelector(".hamburger")?.classList.remove("open")
      document.body.classList.remove("menu-open")
    }
  }

  // Enhanced modal creation with improved animations
  function createModal(id, title, content) {
    const existingModal = document.getElementById(id)
    if (existingModal) {
      existingModal.remove()
    }

    const modalHTML = `
            <div id="${id}" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadeIn">
                <div class="modal-content gradient-card text-white max-w-4xl w-full mx-auto p-8 rounded-2xl shadow-2xl relative max-h-[85vh] overflow-y-auto border border-gray-600/50 animate-slideInDown">
                    <span class="close-button absolute top-4 right-6 text-gray-400 hover:text-white text-3xl cursor-pointer transition-colors duration-200 hover:bg-gray-700/50 rounded-lg p-2" id="close${id}Btn">&times;</span>
                    <h2 class="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">${title}</h2>
                    <div class="space-y-6 text-gray-300 modal-text-content leading-relaxed">
                        ${content}
                    </div>
                </div>
            </div>
        `

    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = modalHTML.trim()
    const modalElement = tempDiv.firstChild

    if (modalElement) {
      document.body.appendChild(modalElement)
      modalElement.classList.remove("hidden")

      const closeBtn = modalElement.querySelector(`#close${id}Btn`)
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          modalElement.style.opacity = "0"
          setTimeout(() => modalElement.remove(), 300)
        })
      }
      modalElement.addEventListener("click", (event) => {
        if (event.target === modalElement) {
          modalElement.style.opacity = "0"
          setTimeout(() => modalElement.remove(), 300)
        }
      })
    }
  }

  // About modal content
  const aboutContent = `
        <div class="grid md:grid-cols-2 gap-8 items-center mb-8">
            <div>
                <h3 class="text-2xl font-bold text-blue-400 mb-4">🐍 Selamat datang di Py.Edia!</h3>
                <p class="text-lg">Kamus Python Interaktif yang dirancang khusus untuk membantu Anda menguasai bahasa pemrograman Python dengan cara yang menyenangkan dan efektif.</p>
            </div>
            <div class="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-6 rounded-xl border border-blue-500/30">
                <h4 class="font-bold text-blue-300 mb-3">✨ Fitur Unggulan</h4>
                <ul class="space-y-2 text-sm">
                    <li>🔍 Pencarian cerdas dan filter kategori</li>
                    <li>💻 Live coding dengan Skulpt</li>
                    <li>📚 Database lengkap fungsi Python</li>
                    <li>🎯 Contoh penggunaan yang praktis</li>
                </ul>
            </div>
        </div>
        <div class="bg-gray-800/50 p-6 rounded-xl border-l-4 border-blue-500">
            <p><strong class="text-blue-400">Misi Kami:</strong> Membuat pembelajaran Python menjadi lebih mudah, interaktif, dan menyenangkan untuk semua tingkat keahlian.</p>
        </div>
        <div class="mt-6 text-center">
            <p class="text-gray-400">Proyek ini menggunakan teknologi modern seperti HTML5, CSS3, JavaScript ES6+, dan Tailwind CSS untuk memberikan pengalaman pengguna yang optimal.</p>
        </div>
    `

  // Tutorial modal content
  const tutorialContent = `
        <div class="grid gap-6">
            <div class="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-6 rounded-xl border border-green-500/30">
                <h3 class="text-xl font-bold text-green-400 mb-4">🚀 Panduan Cepat</h3>
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <h4 class="font-semibold text-blue-300 mb-2">1. 🔍 Mencari Istilah</h4>
                        <p class="text-sm text-gray-300">Gunakan bilah pencarian untuk menemukan fungsi, kata kunci, atau konsep Python yang Anda butuhkan.</p>
                    </div>
                    <div>
                        <h4 class="font-semibold text-blue-300 mb-2">2. 🏷️ Filter Kategori</h4>
                        <p class="text-sm text-gray-300">Gunakan dropdown kategori untuk mempersempit pencarian berdasarkan topik tertentu.</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-xl border border-purple-500/30">
                <h3 class="text-xl font-bold text-purple-400 mb-4">💻 Live Coding</h3>
                <div class="space-y-3">
                    <p><strong class="text-purple-300">Fitur Unggulan:</strong> Jalankan kode Python langsung di browser Anda!</p>
                    <ul class="list-disc list-inside space-y-1 text-sm text-gray-300 pl-4">
                        <li>Klik tombol "Live Code" pada setiap contoh</li>
                        <li>Edit kode sesuai kebutuhan Anda</li>
                        <li>Lihat hasil eksekusi secara real-time</li>
                        <li>Belajar dari error dan perbaiki kode</li>
                    </ul>
                </div>
            </div>
            
            <div class="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 rounded-xl border border-orange-500/30">
                <h3 class="text-xl font-bold text-orange-400 mb-4">📖 Memahami Konten</h3>
                <div class="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <h4 class="font-semibold text-orange-300 mb-2">📝 Pengertian</h4>
                        <p class="text-gray-300">Penjelasan lengkap tentang fungsi atau konsep</p>
                    </div>
                    <div>
                        <h4 class="font-semibold text-orange-300 mb-2">⚙️ Parameter</h4>
                        <p class="text-gray-300">Detail parameter yang diperlukan</p>
                    </div>
                    <div>
                        <h4 class="font-semibold text-orange-300 mb-2">⚠️ Error</h4>
                        <p class="text-gray-300">Potensi kesalahan yang mungkin terjadi</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-gray-800/50 p-6 rounded-xl border-l-4 border-blue-500">
                <p class="text-center"><strong class="text-blue-400">💡 Tips:</strong> Gunakan kombinasi pencarian dan filter untuk hasil yang lebih spesifik. Jangan ragu untuk bereksperimen dengan Live Coding!</p>
            </div>
        </div>
    `

  // Event handlers for both desktop and mobile about links
  function handleAboutClick(e) {
    e.preventDefault()
    closeMobileMenu() // Close mobile menu if open
    createModal("aboutModal", "Tentang Py.Edia", aboutContent)
  }

  function handleTutorialClick(e) {
    e.preventDefault()
    closeMobileMenu() // Close mobile menu if open
    createModal("tutorialModal", "Tutorial Penggunaan", tutorialContent)
  }

  // Attach event listeners to both desktop and mobile links
  if (aboutLink) {
    aboutLink.addEventListener("click", handleAboutClick)
  }
  if (mobileAboutLink) {
    mobileAboutLink.addEventListener("click", handleAboutClick)
  }
  if (tutorialLink) {
    tutorialLink.addEventListener("click", handleTutorialClick)
  }
  if (mobileTutorialLink) {
    mobileTutorialLink.addEventListener("click", handleTutorialClick)
  }

  let kamusData = []

  function toggleModal(modalElement, show) {
    if (modalElement) {
      modalElement.classList.toggle("hidden", !show)
      modalElement.classList.toggle("flex", show)
    }
  }

  if (liveCodingModal) {
    toggleModal(liveCodingModal, false)
  }

  function setElementText(element, text, defaultValue = "N/A") {
    if (element) {
      element.textContent = text || defaultValue
    }
  }

  function setElementHTML(element, htmlContent) {
    if (element) {
      element.innerHTML = htmlContent
    }
  }

  function toggleElementDisplay(element, show) {
    if (element) {
      element.style.display = show ? "block" : "none"
    }
  }

  function setButtonState(buttonElement, disabled) {
    if (buttonElement) {
      buttonElement.disabled = disabled
      buttonElement.classList.toggle("opacity-50", disabled)
      buttonElement.classList.toggle("cursor-not-allowed", disabled)
    }
  }

  // Enhanced loading state
  function showLoadingState() {
    if (hasilPencarianDiv) {
      setElementHTML(
        hasilPencarianDiv,
        `
              <div class="w-full flex flex-col items-center justify-center py-20">
                  <div class="relative">
                      <div class="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                      <div class="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style="animation-delay: -0.5s; animation-duration: 1.5s;"></div>
                  </div>
                  <p class="text-gray-400 mt-6 text-lg">Memuat kamus Python...</p>
                  <p class="text-gray-500 mt-2 text-sm">Mohon tunggu sebentar</p>
              </div>
          `,
      )
    }
  }

  function muatKamus() {
    if (kamusData && kamusData.length > 0) {
      populateCategoryFilter(kamusData)
      if (hasilPencarianDiv) {
        setElementHTML(
          hasilPencarianDiv,
          `
                  <div class="w-full text-center py-20">
                      <div class="max-w-md mx-auto">
                          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                              <span class="text-2xl">🔍</span>
                          </div>
                          <h3 class="text-xl font-semibold text-gray-300 mb-3">Siap untuk Eksplorasi!</h3>
                          <p class="text-gray-400 mb-6">Pilih kategori atau gunakan pencarian untuk menemukan fungsi Python yang Anda butuhkan.</p>
                          <div class="flex flex-wrap justify-center gap-2 text-sm">
                              <span class="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">print()</span>
                              <span class="bg-green-500/20 text-green-300 px-3 py-1 rounded-full">for loops</span>
                              <span class="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">functions</span>
                              <span class="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full">lists</span>
                          </div>
                      </div>
                  </div>
              `,
        )
      }
    } else {
      console.warn("muatKamus() dipanggil, tetapi kamusData kosong atau belum siap.")
      if (hasilPencarianDiv) {
        setElementHTML(
          hasilPencarianDiv,
          `
                  <div class="w-full text-center text-orange-400 p-8 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                      <div class="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span class="text-xl">⚠️</span>
                      </div>
                      <h3 class="text-lg font-semibold mb-2">Data Tidak Tersedia</h3>
                      <p>Data kamus tidak dapat diproses saat ini. Silakan refresh halaman.</p>
                  </div>
              `,
        )
      }
    }
  }

  function populateCategoryFilter(data) {
    if (!categoryFilter) return
    const categories = new Set(data.map((item) => item.kategori).filter(Boolean))
    const sortedCategories = Array.from(categories).sort()

    while (categoryFilter.options.length > 2) {
      categoryFilter.remove(2)
    }
    sortedCategories.forEach((kategori) => {
      const option = document.createElement("option")
      option.value = kategori
      option.textContent = kategori
      option.classList.add("bg-gray-800", "text-gray-200")
      categoryFilter.appendChild(option)
    })
  }

  function filterAndDisplay() {
    if (!kamusData || !searchBar || !categoryFilter) return
    const searchTerm = searchBar.value.toLowerCase().trim()
    const selectedCategoryValue = categoryFilter.value

    if (selectedCategoryValue === "" && searchTerm === "") {
      tampilkanHasil([])
      return
    }

    // Show loading state for search
    if (searchTerm || selectedCategoryValue !== "") {
      setElementHTML(
        hasilPencarianDiv,
        `
            <div class="w-full flex items-center justify-center py-12">
                <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    <span class="text-gray-400">Mencari...</span>
                </div>
            </div>
        `,
      )
    }

    // Simulate slight delay for better UX
    setTimeout(() => {
      const filteredData = kamusData.filter((item) => {
        const termMatch =
          !searchTerm ||
          (item.namaFungsi && item.namaFungsi.toLowerCase().includes(searchTerm)) ||
          (item.kategori && item.kategori.toLowerCase().includes(searchTerm)) ||
          (item.tingkat && item.tingkat.toLowerCase().includes(searchTerm)) ||
          (item.pengertian && item.pengertian.toLowerCase().includes(searchTerm))
        if (!termMatch) return false
        return (
          selectedCategoryValue === "" || selectedCategoryValue === "all" || item.kategori === selectedCategoryValue
        )
      })
      tampilkanHasil(filteredData)
    }, 200)
  }

  function setDataOrHide(parentElement, sectionSelector, fieldSelector, data, isHTML = false) {
    const sectionElement = queryEl(parentElement, `[data-section="${sectionSelector}"]`)
    if (!sectionElement) return

    const fieldElement = queryEl(sectionElement, `[data-field="${fieldSelector}"]`)
    const hasData = data && data.length > 0

    if (hasData && fieldElement) {
      if (isHTML) setElementHTML(fieldElement, data)
      else setElementText(fieldElement, data, "")
    }
    toggleElementDisplay(sectionElement, hasData)
  }

  function populateListOrHide(parentElement, sectionName, listData, createListItemFn) {
    const sectionElement = queryEl(parentElement, `[data-section="${sectionName}"]`)
    if (!sectionElement) return

    const listElement = queryEl(sectionElement, `[data-field="${sectionName}"]`)
    const emptyMsgElement = queryEl(sectionElement, `[data-message="${sectionName}-empty"]`)

    if (listElement) setElementHTML(listElement, "")

    const hasValidData = listData && Array.isArray(listData)
    const hasItems = hasValidData && listData.length > 0

    if (hasItems) {
      listData.forEach((itemData) => {
        const li = createListItemFn(itemData)
        if (li && listElement) listElement.appendChild(li)
      })
    }

    toggleElementDisplay(listElement, hasItems)
    toggleElementDisplay(emptyMsgElement, hasValidData && listData.length === 0)
    toggleElementDisplay(sectionElement, hasValidData)
  }

  function tampilkanHasil(hasil) {
    if (!hasilPencarianDiv || !kamusItemTemplate) return
    setElementHTML(hasilPencarianDiv, "")

    if (hasil.length === 0) {
      setElementHTML(
        hasilPencarianDiv,
        `
              <div class="w-full text-center py-20">
                  <div class="max-w-md mx-auto">
                      <div class="w-16 h-16 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <span class="text-2xl">🔍</span>
                      </div>
                      <h3 class="text-xl font-semibold text-gray-300 mb-3">Tidak Ada Hasil</h3>
                      <p class="text-gray-400 mb-6">Tidak ada istilah yang cocok dengan pencarian Anda. Coba kata kunci yang berbeda atau pilih kategori lain.</p>
                      <div class="text-sm text-gray-500">
                          <p>💡 Tips: Coba pencarian yang lebih umum atau periksa ejaan</p>
                      </div>
                  </div>
              </div>
          `,
      )
      return
    }

    // Create container for single-column layout
    const containerDiv = document.createElement("div")
    containerDiv.className = "flex flex-col gap-8 w-full max-w-4xl mx-auto"

    hasil.forEach((item, index) => {
      const cardClone = kamusItemTemplate.content.cloneNode(true)

      // Add staggered animation delay
      const card = cardClone.querySelector(".kamus-item-card")
      if (card) {
        card.style.animationDelay = `${index * 0.15}s`
        // Ensure full width for single column
        card.classList.add("w-full", "max-w-none")
      }

      setElementText(queryEl(cardClone, '[data-field="namaFungsi"]'), item.namaFungsi)
      setElementText(queryEl(cardClone, '[data-field="kategori"]'), item.kategori)
      setElementText(queryEl(cardClone, '[data-field="tingkat"]'), item.tingkat)
      setElementText(queryEl(cardClone, '[data-field="pengertian"]'), item.pengertian)

      setDataOrHide(
        cardClone,
        "contohPenggunaan",
        "contohPenggunaan",
        item.contohPenggunaan ? item.contohPenggunaan.replace(/\n/g, "<br>") : null,
        true,
      )

      populateListOrHide(cardClone, "parameter", item.parameter, (p) => {
        const li = document.createElement("li")
        li.className = "bg-gray-800/30 p-2 rounded-lg"
        if (typeof p === "object" && p.nama && p.deskripsi) {
          setElementHTML(
            li,
            `<strong class="text-blue-300">${p.nama}:</strong> <span class="text-gray-300">${p.deskripsi}</span>`,
          )
        } else if (typeof p === "string") {
          setElementText(li, p, "")
        }
        return li
      })

      setDataOrHide(cardClone, "nilaiKembali", "nilaiKembali", item.nilaiKembali)
      setDataOrHide(cardClone, "catatanPenting", "catatanPenting", item.catatanPenting)

      populateListOrHide(cardClone, "potensiError", item.potensiError, (errText) => {
        const li = document.createElement("li")
        li.className = "bg-red-500/5 p-2 rounded-lg"
        setElementText(li, errText, "")
        return li
      })

      const moreContentDiv = queryEl(cardClone, ".more-content")
      const toggleMoreButton = queryEl(cardClone, '[data-action="toggleMore"]')

      if (moreContentDiv && toggleMoreButton) {
        const dataSectionsInMoreContent = queryAllEl(moreContentDiv, "[data-section]")
        const hasActualDataInMoreContent = Array.from(dataSectionsInMoreContent).some(
          (section) => section.style.display !== "none",
        )

        toggleElementDisplay(toggleMoreButton, hasActualDataInMoreContent)

        if (hasActualDataInMoreContent) {
          toggleMoreButton.addEventListener("click", () => {
            const isCollapsed = moreContentDiv.classList.contains("collapsed")
            const toggleIcon = toggleMoreButton.querySelector(".toggle-icon")
            const buttonText = toggleMoreButton.querySelector("span")

            if (isCollapsed) {
              // Expand
              moreContentDiv.classList.remove("collapsed")
              moreContentDiv.classList.add("expanded")
              if (buttonText) buttonText.textContent = "Tampilkan Lebih Sedikit"
              if (toggleIcon) toggleIcon.classList.add("rotated")
            } else {
              // Collapse
              moreContentDiv.classList.remove("expanded")
              moreContentDiv.classList.add("collapsed")
              if (buttonText) buttonText.textContent = "Tampilkan Lebih Banyak"
              if (toggleIcon) toggleIcon.classList.remove("rotated")
            }
          })
        }
      }

      const liveCodeButton = queryEl(cardClone, '[data-action="openLiveCode"]')
      if (liveCodeButton) {
        const hasCode = item.contohPenggunaan && item.contohPenggunaan.trim() !== ""
        toggleElementDisplay(liveCodeButton, hasCode)
        if (hasCode) {
          liveCodeButton.addEventListener("click", () => {
            openLiveCodingModal(item.namaFungsi, item.contohPenggunaan)
          })
        }
      }

      containerDiv.appendChild(cardClone)
    })

    hasilPencarianDiv.appendChild(containerDiv)
  }

  function typePythonOutputChunkAnimated(textChunk, outputDivElement, onFinishedCallback) {
    let i = 0
    function type() {
      if (i < textChunk.length) {
        const char = textChunk[i]
        let newChar = char
        if (char === "\n") {
          outputDivElement.innerHTML += "<br>"
        } else if (char !== "<" && char !== ">" && char !== "&") {
          newChar = char.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
          outputDivElement.innerHTML += newChar
        } else {
          outputDivElement.innerHTML += newChar
        }
        i++
        setTimeout(type, 15)
      } else {
        if (onFinishedCallback) onFinishedCallback()
      }
    }
    type()
  }

  function openLiveCodingModal(namaFungsi, contohPenggunaan) {
    if (
      liveCodingModal &&
      liveCodeEditor &&
      liveCodeOutput &&
      liveCodingModalTitle &&
      closeLiveCodingModalBtn &&
      runLiveCodeBtn
    ) {
      setElementText(liveCodingModalTitle, `Live Coding: ${namaFungsi}`, "")
      liveCodeEditor.value =
        contohPenggunaan || "# Tidak ada contoh penggunaan.\n# Silakan ketik kode Python Anda di sini."
      setElementHTML(
        liveCodeOutput,
        '<div class="flex items-center justify-center h-full text-gray-500"><span class="italic">Klik "Jalankan Kode" untuk melihat output</span></div>',
      )
      setButtonState(runLiveCodeBtn, false)
      toggleModal(liveCodingModal, true)
    } else {
      console.error("Elemen modal live coding tidak lengkap atau tidak ditemukan.")
    }
  }

  function closeLiveCodingModal() {
    if (liveCodingModal) {
      toggleModal(liveCodingModal, false)
    }
  }

  if (closeLiveCodingModalBtn) {
    closeLiveCodingModalBtn.addEventListener("click", closeLiveCodingModal)
  }

  if (runLiveCodeBtn && liveCodeEditor) {
    runLiveCodeBtn.addEventListener("click", () => {
      runPythonCode(liveCodeEditor.value, "liveCodeOutput", runLiveCodeBtn)
    })
  }

  function runPythonCode(codeToRun, outputElementId, buttonElement) {
    setButtonState(buttonElement, true)

    // Update button text during execution
    const originalText = buttonElement.innerHTML
    buttonElement.innerHTML = '<span class="flex items-center"><span class="mr-2">⏳</span>Menjalankan...</span>'

    const outputDiv = getEl(outputElementId)
    if (!outputDiv) {
      console.error(`Error: Elemen output dengan ID '${outputElementId}' tidak ditemukan.`)
      setButtonState(buttonElement, false)
      buttonElement.innerHTML = originalText
      return
    }

    setElementHTML(
      outputDiv,
      `
            <div class="flex items-center justify-center h-32">
                <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
                    <span class="text-gray-400 italic">Menjalankan kode Python...</span>
                </div>
            </div>
        `,
    )

    const placeholderTextColorClass = "text-gray-500"
    const errorTextColorClass = "text-red-400"
    let outputProcessingPromise = Promise.resolve()

    // Declare Sk before using it
    const Sk = window.Sk

    Sk.configure({
      output: (text) => {
        outputProcessingPromise = outputProcessingPromise.then(
          () =>
            new Promise((resolve) => {
              if (outputDiv.innerHTML.includes("Menjalankan kode Python...")) {
                setElementHTML(outputDiv, "")
              }
              typePythonOutputChunkAnimated(text, outputDiv, resolve)
            }),
        )
      },
      read: (filePath) => {
        if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][filePath] === undefined) {
          throw new Sk.builtin.IOError(`File not found: '${filePath}'`)
        }
        return Sk.builtinFiles["files"][filePath]
      },
      __future__: Sk.python3,
      retainglobals: true,
    })

    Sk.misceval
      .asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, codeToRun, true))
      .then(() => {
        outputProcessingPromise.then(() => {
          if (outputDiv.innerHTML.trim() === "" || outputDiv.innerHTML.includes("Menjalankan kode Python...")) {
            setElementHTML(
              outputDiv,
              `
                            <div class="flex items-center justify-center h-20 bg-green-500/10 rounded-lg border border-green-500/30">
                                <span class="italic ${placeholderTextColorClass}">✅ Eksekusi selesai. Tidak ada output standar.</span>
                            </div>
                        `,
            )
          }
          setButtonState(buttonElement, false)
          buttonElement.innerHTML = originalText
        })
      })
      .catch((error) => {
        outputProcessingPromise.then(() => {
          console.error("Error saat eksekusi Skulpt:", error)
          let errorMessage = error.toString()
          if (error.tp$name && error.args && error.args.v.length > 0) {
            errorMessage = `${error.tp$name}: ${Sk.ffi.remapToJs(error.args.v[0])}`
            if (error.traceback && error.traceback.length > 0) {
              const lastTrace = error.traceback[error.traceback.length - 1]
              if (lastTrace.lineno !== undefined) errorMessage += ` (line ${lastTrace.lineno})`
            }
          } else if (error.nativeError && error.nativeError.message) {
            errorMessage = `Skulpt Internal Error: ${error.nativeError.message}`
          }
          setElementHTML(
            outputDiv,
            `
                        <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                            <div class="flex items-center mb-2">
                                <span class="text-red-400 mr-2">❌</span>
                                <span class="font-semibold text-red-400">Error Eksekusi</span>
                            </div>
                            <span class="code-output-error ${errorTextColorClass} font-mono text-sm">${errorMessage.replace(/\n/g, "<br>")}</span>
                        </div>
                    `,
          )
          setButtonState(buttonElement, false)
          buttonElement.innerHTML = originalText
        })
      })
  }

  // Show initial loading state
  showLoadingState()

  fetch("json/dictionary.json")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return response.json()
    })
    .then((data) => {
      if (!Array.isArray(data)) throw new Error("Format data kamus tidak valid. Seharusnya berupa array.")
      kamusData = data
      muatKamus()
    })
    .catch((error) => {
      console.error("Gagal memuat atau memproses data dari dictionary:", error)
      if (hasilPencarianDiv) {
        setElementHTML(
          hasilPencarianDiv,
          `
                  <div class="w-full text-center text-red-400 p-8 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span class="text-2xl">❌</span>
                      </div>
                      <h3 class="text-xl font-semibold mb-3">Gagal Memuat Data</h3>
                      <p class="mb-4">Tidak dapat memuat data kamus: ${error.message}</p>
                      <button onclick="location.reload()" class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200">
                          Coba Lagi
                      </button>
                  </div>
              `,
        )
      }
    })

  fetch("json/funfact.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    })
    .then((funFactsData) => {
      if (funFactsData && funFactsData.length > 0) {
        const shuffledFacts = funFactsData.sort(() => 0.5 - Math.random())
        const factsToDisplay = shuffledFacts.slice(0, 3)

        factsToDisplay.forEach((fact, index) => {
          const titleElement = document.getElementById(`funfact-title-${index + 1}`)
          const contentElement = document.getElementById(`funfact-content-${index + 1}`)

          if (titleElement && contentElement) {
            titleElement.textContent = fact.judul || `Fun Fact ${index + 1}`
            contentElement.textContent = fact.isi || "Tidak ada konten."
          }
        })

        for (let i = factsToDisplay.length; i < 3; i++) {
          const titleElement = document.getElementById(`funfact-title-${i + 1}`)
          const contentElement = document.getElementById(`funfact-content-${i + 1}`)
          if (titleElement && contentElement) {
            titleElement.textContent = `Fun Fact ${i + 1}`
            contentElement.textContent = "Tidak ada fakta tambahan."
          }
        }
      } else if (funFactsData && funFactsData.length === 0) {
        for (let i = 1; i <= 3; i++) {
          const titleElement = document.getElementById(`funfact-title-${i}`)
          const contentElement = document.getElementById(`funfact-content-${i}`)
          if (titleElement) titleElement.textContent = `Fun Fact ${i}`
          if (contentElement) contentElement.textContent = "Tidak ada fakta tersedia saat ini."
        }
      } else {
        throw new Error("Format data fun facts tidak valid.")
      }
    })
    .catch((error) => {
      console.error("Tidak dapat memuat atau memproses data fun facts:", error)
      for (let i = 1; i <= 3; i++) {
        const titleElement = document.getElementById(`funfact-title-${i}`)
        const contentElement = document.getElementById(`funfact-content-${i}`)
        if (titleElement) titleElement.textContent = `Fun Fact ${i}`
        if (contentElement) contentElement.textContent = "Gagal memuat FunFacts."
      }
    })

  // Enhanced search functionality with debouncing
  let searchTimeout
  if (searchBar) {
    searchBar.addEventListener("input", () => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(filterAndDisplay, 300)
    })

    // Add search suggestions on focus
    searchBar.addEventListener("focus", () => {
      if (!searchBar.value && kamusData.length > 0) {
        const suggestions = ["print", "input", "len", "range", "list", "dict"]
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
        searchBar.placeholder = `Coba cari "${randomSuggestion}"...`
      }
    })

    searchBar.addEventListener("blur", () => {
      searchBar.placeholder = "Ketik istilah, pengertian, atau contoh..."
    })
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterAndDisplay)
  }

  // Add keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault()
      if (searchBar) {
        searchBar.focus()
        searchBar.select()
      }
    }

    // Escape to close modals and mobile menu
    if (e.key === "Escape") {
      const openModal = document.querySelector(".modal.flex")
      if (openModal) {
        closeLiveCodingModal()
      }
      // Also close mobile menu if open
      if (mobileMenu && mobileMenu.classList.contains("open")) {
        closeMobileMenu()
      }
    }
  })

  // Add smooth scroll behavior for better UX
  document.documentElement.style.scrollBehavior = "smooth"
})
