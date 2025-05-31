document.addEventListener("DOMContentLoaded", () => {
  const getEl = (id) => document.getElementById(id)
  const queryEl = (parent, selector) => parent.querySelector(selector)
  const queryAllEl = (parent, selector) => parent.querySelectorAll(selector)

  const tutorialLink = getEl("tutorialLink")
  const aboutLink = getEl("aboutLink")
  const mobileTutorialLink = getEl("mobileTutorialLink")
  const mobileAboutLink = getEl("mobileAboutLink")
  const mobileBookmarkLink = getEl("mobileBookmarkLink")

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

  // Quiz Modal Elements
  const quizModal = getEl("quizModal")
  const closeQuizModalBtn = getEl("closeQuizModal")
  const quizModalTitle = getEl("quizModalTitle")
  const quizQuestion = getEl("quizQuestion")
  const quizOptions = getEl("quizOptions")
  const quizExplanation = getEl("quizExplanation")
  const quizExplanationText = getEl("quizExplanationText")
  const quizProgress = getEl("quizProgress")
  const quizProgressBar = getEl("quizProgressBar")
  const quizScore = getEl("quizScore")
  const nextQuizBtn = getEl("nextQuizBtn")
  const quizContent = getEl("quizContent")
  const quizResults = getEl("quizResults")
  const finalScore = getEl("finalScore")
  const scoreMessage = getEl("scoreMessage")
  const restartQuizBtn = getEl("restartQuizBtn")

  // Quiz state
  let currentQuizData = null
  let currentScore = 0
  let hasAnswered = false

  // Bookmark System
  let bookmarks = JSON.parse(localStorage.getItem("pyedia-bookmarks") || "[]")

  function updateBookmarkCount() {
    const bookmarkCountDesktop = getEl("bookmarkCount")
    const bookmarkCountMobile = getEl("mobileBookmarkCount") // Get the new mobile count element

    const updateCountElement = (element) => {
      if (element) {
        if (bookmarks.length > 0) {
          element.textContent = bookmarks.length
          element.style.display = "flex"
          element.classList.add("bookmark-badge-update")
          setTimeout(() => element.classList.remove("bookmark-badge-update"), 800)
        } else {
          element.style.display = "none"
        }
      }
    }

    updateCountElement(bookmarkCountDesktop)
    updateCountElement(bookmarkCountMobile) // Update mobile count as well
  }

  function saveBookmarks() {
    localStorage.setItem("pyedia-bookmarks", JSON.stringify(bookmarks))
    updateBookmarkCount()
  }

  function addBookmark(item) {
    // Basic validation
    if (
      !item ||
      typeof item.namaFungsi !== "string" ||
      item.namaFungsi.trim() === "" ||
      typeof item.kategori !== "string" ||
      typeof item.tingkat !== "string" ||
      typeof item.pengertian !== "string"
    ) {
      showNotification("⚠️ Invalid data for bookmark.", "error")
      return false
    }

    const exists = bookmarks.find((b) => b.namaFungsi === item.namaFungsi)
    if (!exists) {
      bookmarks.push({
        namaFungsi: String(item.namaFungsi).slice(0, 200), // Sanitize/truncate
        kategori: String(item.kategori).slice(0, 100),
        tingkat: String(item.tingkat).slice(0, 50),
        pengertian: String(item.pengertian).slice(0, 500), // Keep a reasonable length
        timestamp: new Date().toISOString(),
      })
      saveBookmarks()
      showNotification("📚 Bookmark added!", "success")
      return true
    } else {
      showNotification("📚 Already bookmarked!", "info")
      return false
    }
  }

  function removeBookmark(namaFungsi) {
    bookmarks = bookmarks.filter((b) => b.namaFungsi !== namaFungsi)
    saveBookmarks()
    showNotification("🗑️ Bookmark removed!", "success")
    displayBookmarks() // Refresh bookmark modal if open
    return true
  }

  function isBookmarked(namaFungsi) {
    return bookmarks.some((b) => b.namaFungsi === namaFungsi)
  }

  function displayBookmarks() {
    const bookmarkList = getEl("bookmarkList")
    const emptyBookmarks = getEl("emptyBookmarks")

    if (!bookmarkList || !emptyBookmarks) return

    if (bookmarks.length === 0) {
      bookmarkList.style.display = "none"
      emptyBookmarks.style.display = "block"
      return
    }

    bookmarkList.style.display = "block"
    emptyBookmarks.style.display = "none"

    setElementHTML(bookmarkList, "")

    bookmarks.forEach((bookmark) => {
      const bookmarkItem = document.createElement("div")
      bookmarkItem.className =
        "bg-gray-800/50 p-4 rounded-xl border border-gray-600/50 hover:border-yellow-500/50 transition-all duration-300"
      bookmarkItem.innerHTML = `
          <div class="flex justify-between items-start">
            <div class="flex-grow">
              <h4 class="text-lg font-semibold text-yellow-400 mb-2">${bookmark.namaFungsi}</h4>
              <div class="flex gap-2 mb-2">
                <span class="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">${bookmark.kategori}</span>
                <span class="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">${bookmark.tingkat}</span>
              </div>
              <p class="text-gray-300 text-sm">${bookmark.pengertian.substring(0, 150)}...</p>
              <p class="text-xs text-gray-500 mt-2">Saved: ${new Date(bookmark.timestamp).toLocaleDateString()}</p>
            </div>
            <div class="flex gap-2 ml-4">
              <button onclick="searchAndShow('${bookmark.namaFungsi}')" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200">
                View
              </button>
              <button onclick="removeBookmark('${bookmark.namaFungsi}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200">
                Remove
              </button>
            </div>
          </div>
        `
      bookmarkList.appendChild(bookmarkItem)
    })
  }

  // Make functions global for onclick handlers
  window.removeBookmark = removeBookmark
  window.searchAndShow = (namaFungsi) => {
    if (searchBar) {
      searchBar.value = namaFungsi
      filterAndDisplay()
      toggleModal(getEl("bookmarkModal"), false)
    }
  }

  // Notification System
  function showNotification(message, type = "info") {
    const notification = document.createElement("div")
    const colors = {
      success: "bg-green-500",
      error: "bg-red-500",
      info: "bg-blue-500",
      warning: "bg-yellow-500",
    }

    notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-[70] transform translate-x-full transition-transform duration-300 notification-enter`
    notification.textContent = message

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    setTimeout(() => {
      notification.classList.add("notification-exit")
      notification.style.transform = "translateX(100%)"
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }

  // Random Function Feature
  function showRandomFunction() {
    if (kamusData.length === 0) {
      showNotification("⚠️ No data available!", "warning")
      return
    }

    const randomItem = kamusData[Math.floor(Math.random() * kamusData.length)]
    if (searchBar) {
      searchBar.value = randomItem.namaFungsi
      filterAndDisplay()
      showNotification(`🎲 Random function: ${randomItem.namaFungsi}`, "info")
    }
  }

  // Code Generator Templates
  const codeTemplates = [
    {
      name: "Fungsi Dasar",
      description: "Membuat fungsi Python dasar",
      code: `def my_function(parameter1, parameter2):
      """
      Description of what this function does.
      
      Args:
          parameter1: Description of parameter1
          parameter2: Description of parameter2
      
      Returns:
          Description of return value
      """
      # Your code here
      result = parameter1 + parameter2
      return result

  # Example usage
  result = my_function(5, 3)
  print(f"Result: {result}")`,
    },
    {
      name: "Struktur Kelas",
      description: "Membuat struktur kelas sederhana python",
      code: `class MyClass:
      """A sample class template."""
      
      def __init__(self, name):
          """Initialize the class."""
          self.name = name
          self.data = []
      
      def add_item(self, item):
          """Add an item to the data list."""
          self.data.append(item)
          print(f"Added {item} to {self.name}")
      
      def get_items(self):
          """Return all items."""
          return self.data
      
      def __str__(self):
          """String representation of the class."""
          return f"MyClass(name='{self.name}', items={len(self.data)})"

  # Example usage
  my_object = MyClass("Example")
  my_object.add_item("item1")
  my_object.add_item("item2")
  print(my_object)`,
    },
    {
      name: "Menangani File",
      description: "Template untuk menangani file pada Python",
      code: `def read_file(filename):
      """Read content from a file."""
      try:
          with open(filename, 'r', encoding='utf-8') as file:
              content = file.read()
          return content
      except FileNotFoundError:
          print(f"File {filename} not found!")
          return None
      except Exception as e:
          print(f"Error reading file: {e}")
          return None

  def write_file(filename, content):
      """Write content to a file."""
      try:
          with open(filename, 'w', encoding='utf-8') as file:
              file.write(content)
          print(f"Successfully wrote to {filename}")
          return True
      except Exception as e:
          print(f"Error writing file: {e}")
          return False

  # Example usage
  content = "Hello, Python!"
  write_file("example.txt", content)
  read_content = read_file("example.txt")
  print(read_content)`,
    },
    {
      name: "Menggunakan kode API",
      description: "Template untuk menghubungkan dengan kode API",
      code: `import requests
  import json

  def make_api_request(url, method='GET', data=None, headers=None):
      """
      Make an API request.
      
      Args:
          url: The API endpoint URL
          method: HTTP method (GET, POST, PUT, DELETE)
          data: Data to send with the request
          headers: HTTP headers
      
      Returns:
          Response data or None if error
      """
      try:
          if headers is None:
              headers = {'Content-Type': 'application/json'}
          
          if method.upper() == 'GET':
              response = requests.get(url, headers=headers)
          elif method.upper() == 'POST':
              response = requests.post(url, json=data, headers=headers)
          elif method.upper() == 'PUT':
              response = requests.put(url, json=data, headers=headers)
          elif method.upper() == 'DELETE':
              response = requests.delete(url, headers=headers)
          
          response.raise_for_status()
          return response.json()
          
      except requests.exceptions.RequestException as e:
          print(f"API request failed: {e}")
          return None

  # Example usage
  # data = make_api_request('https://api.example.com/data')
  # print(data)`,
    },
    {
      name: "Pemrosesan Data",
      description: "Template untuk menganalisis data numerik",
      code: `def analyze_data(data_list):
      """
      Analyze a list of numbers.
      
      Args:
          data_list: List of numbers
      
      Returns:
          Dictionary with analysis results
      """
      if not data_list:
          return {"error": "Empty data list"}
      
      analysis = {
          "count": len(data_list),
          "sum": sum(data_list),
          "average": sum(data_list) / len(data_list),
          "min": min(data_list),
          "max": max(data_list),
          "range": max(data_list) - min(data_list)
      }
      
      # Calculate median
      sorted_data = sorted(data_list)
      n = len(sorted_data)
      if (n % 2 == 0):
          analysis["median"] = (sorted_data[n//2-1] + sorted_data[n//2]) / 2
      else:
          analysis["median"] = sorted_data[n//2]
      
      return analysis

  # Example usage
  numbers = [1, 5, 3, 9, 2, 7, 4, 6, 8]
  result = analyze_data(numbers)
  for key, value in result.items():
      print(f"{key}: {value}")`,
    },
  ]

  function displayCodeTemplates() {
    const templatesContainer = getEl("codeTemplates")
    if (!templatesContainer) return

    setElementHTML(templatesContainer, "")

    codeTemplates.forEach((template, index) => {
      const templateItem = document.createElement("div")
      templateItem.className =
        "template-item bg-gray-800/50 p-4 rounded-lg border border-gray-600/50 hover:border-green-500/50 cursor-pointer transition-all duration-300"
      templateItem.innerHTML = `
          <h4 class="font-semibold text-green-300 mb-2">${template.name}</h4>
          <p class="text-gray-400 text-sm">${template.description}</p>
        `

      templateItem.addEventListener("click", () => {
        const generatedCode = getEl("generatedCode")
        if (generatedCode) {
          generatedCode.value = template.code
        }

        // Highlight selected template
        templatesContainer.querySelectorAll(".template-item").forEach((item) => {
          item.classList.remove("border-green-500", "bg-green-500/10", "selected")
          item.classList.add("border-gray-600/50")
        })
        templateItem.classList.add("border-green-500", "bg-green-500/10", "selected")
      })

      templatesContainer.appendChild(templateItem)
    })
  }

  // Learning Path Data
  const learningPath = [
    {
      level: "Pemula",
      color: "green",
      topics: [
        { name: "Python Syntax", functions: ["print()", "input()", "Python Comments"] },
        { name: "Variables & Data Types", functions: ["Python Variables", "Python Data Types", "Python Numbers"] },
        { name: "Basic Operations", functions: ["Python Operators", "Python Casting"] },
        { name: "Strings", functions: ["Python Strings", "Python String Formatting"] },
      ],
    },
    {
      level: "Menengah",
      color: "blue",
      topics: [
        { name: "Data Structures", functions: ["Python Lists", "Python Tuples", "Python Sets", "Python Dictionaries"] },
        { name: "Control Flow", functions: ["Python If...Else", "Python While Loops", "Python For Loops"] },
        { name: "Functions", functions: ["Python Functions", "Python Lambda", "Python Scope"] },
        { name: "Built-in Functions", functions: ["len()", "type()", "range()", "sorted()"] },
      ],
    },
    {
      level: "Lanjutan",
      color: "purple",
      topics: [
        { name: "Object-Oriented Programming", functions: ["class", "def", "__init__"] },
        { name: "Error Handling", functions: ["try", "except", "finally", "raise"] },
        { name: "Advanced Features", functions: ["Python Match", "async", "await", "yield"] },
        { name: "File Operations", functions: ["open()", "with", "File Handling"] },
      ],
    },
  ]

  function displayLearningPath() {
    const pathContent = getEl("learningPathContent")
    if (!pathContent) return

    setElementHTML(pathContent, "")

    learningPath.forEach((level, levelIndex) => {
      const levelDiv = document.createElement("div")
      levelDiv.className = `learning-step bg-${level.color}-500/10 border border-${level.color}-500/30 rounded-xl p-6`

      let topicsHTML = ""
      level.topics.forEach((topic, topicIndex) => {
        const functionsHTML = topic.functions
          .map(
            (func) =>
              `<span class="bg-gray-700/50 text-gray-300 px-2 py-1 rounded text-xs cursor-pointer hover:bg-${level.color}-500/20 transition-colors duration-200" onclick="searchAndShow('${func}')">${func}</span>`,
          )
          .join(" ")

        topicsHTML += `
            <div class="mb-4">
              <h4 class="font-semibold text-${level.color}-300 mb-2">${topic.name}</h4>
              <div class="flex flex-wrap gap-2">${functionsHTML}</div>
            </div>
          `
      })

      levelDiv.innerHTML = `
          <div class="flex items-center mb-4">
            <div class="w-8 h-8 bg-${level.color}-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
              ${levelIndex + 1}
            </div>
            <h3 class="text-xl font-bold text-${level.color}-400">${level.level}</h3>
          </div>
          ${topicsHTML}
        `

      pathContent.appendChild(levelDiv)
    })
  }

  // Event Listeners for New Features
  const bookmarkLink = getEl("bookmarkLink")
  const randomFunctionBtn = getEl("randomFunctionBtn")
  const codeGeneratorBtn = getEl("codeGeneratorBtn")
  const learningPathBtn = getEl("learningPathBtn")

  if (bookmarkLink) {
    bookmarkLink.addEventListener("click", (e) => {
      e.preventDefault()
      displayBookmarks()
      toggleModal(getEl("bookmarkModal"), true)
    })
  }

  if (randomFunctionBtn) {
    randomFunctionBtn.addEventListener("click", showRandomFunction)
  }

  if (codeGeneratorBtn) {
    codeGeneratorBtn.addEventListener("click", () => {
      displayCodeTemplates()
      toggleModal(getEl("codeGeneratorModal"), true)
    })
  }

  if (learningPathBtn) {
    learningPathBtn.addEventListener("click", () => {
      displayLearningPath()
      toggleModal(getEl("learningPathModal"), true)
    })
  }

  // Copy code functionality
  const copyGeneratedCode = getEl("copyGeneratedCode")
  if (copyGeneratedCode) {
    copyGeneratedCode.addEventListener("click", () => {
      const generatedCode = getEl("generatedCode")
      if (generatedCode && generatedCode.value) {
        navigator.clipboard
          .writeText(generatedCode.value)
          .then(() => {
            showNotification("📋 Code copied to clipboard!", "success")
          })
          .catch(() => {
            showNotification("❌ Failed to copy code!", "error")
          })
      }
    })
  }

  // Close modal event listeners
  const closeBookmarkModal = getEl("closeBookmarkModal")
  const closeCodeGeneratorModal = getEl("closeCodeGeneratorModal")
  const closeLearningPathModal = getEl("closeLearningPathModal")

  if (closeBookmarkModal) {
    closeBookmarkModal.addEventListener("click", () => toggleModal(getEl("bookmarkModal"), false))
  }

  if (closeCodeGeneratorModal) {
    closeCodeGeneratorModal.addEventListener("click", () => toggleModal(getEl("codeGeneratorModal"), false))
  }

  if (closeLearningPathModal) {
    closeLearningPathModal.addEventListener("click", () => toggleModal(getEl("learningPathModal"), false))
  }

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
                    <li>🧠 Quiz interaktif untuk setiap topik</li>
                    <li>📚 Sistem bookmark untuk fungsi favorit</li>
                    <li>⚡ Code generator dengan template siap pakai</li>
                    <li>🗺️ Learning path terstruktur</li>
                    <li>🎲 Random function explorer</li>
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
                <h3 class="text-xl font-bold text-orange-400 mb-4">🧠 Quiz Interaktif</h3>
                <div class="space-y-3">
                    <p><strong class="text-orange-300">Fitur Baru:</strong> Uji pemahaman Anda dengan quiz!</p>
                    <ul class="list-disc list-inside space-y-1 text-sm text-gray-300 pl-4">
                        <li>Klik tombol "Quiz" untuk memulai</li>
                        <li>Jawab pertanyaan multiple choice</li>
                        <li>Dapatkan penjelasan untuk setiap jawaban</li>
                        <li>Lihat skor dan tingkatkan pemahaman</li>
                    </ul>
                </div>
            </div>
            
            <div class="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-6 rounded-xl border border-yellow-500/30">
                <h3 class="text-xl font-bold text-yellow-400 mb-4">📚 Bookmark System</h3>
                <div class="space-y-3">
                    <p><strong class="text-yellow-300">Fitur Terbaru:</strong> Simpan fungsi favorit Anda!</p>
                    <ul class="list-disc list-inside space-y-1 text-sm text-gray-300 pl-4">
                        <li>Klik tombol "Bookmark" pada fungsi yang ingin disimpan</li>
                        <li>Akses bookmark melalui menu navigasi</li>
                        <li>Kelola dan hapus bookmark sesuai kebutuhan</li>
                        <li>Data tersimpan secara lokal di browser</li>
                    </ul>
                </div>
            </div>
            
            <div class="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-6 rounded-xl border border-cyan-500/30">
                <h3 class="text-xl font-bold text-cyan-400 mb-4">📖 Memahami Konten</h3>
                <div class="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <h4 class="font-semibold text-cyan-300 mb-2">📝 Pengertian</h4>
                        <p class="text-gray-300">Penjelasan lengkap tentang fungsi atau konsep</p>
                    </div>
                    <div>
                        <h4 class="font-semibold text-cyan-300 mb-2">⚙️ Parameter</h4>
                        <p class="text-gray-300">Detail parameter yang diperlukan</p>
                    </div>
                    <div>
                        <h4 class="font-semibold text-cyan-300 mb-2">⚠️ Error</h4>
                        <p class="text-gray-300">Potensi kesalahan yang mungkin terjadi</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-gray-800/50 p-6 rounded-xl border-l-4 border-blue-500">
                <p class="text-center"><strong class="text-blue-400">💡 Tips:</strong> Gunakan kombinasi pencarian, filter, live coding, quiz, dan bookmark untuk pembelajaran yang maksimal!</p>
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

  function handleBookmarkClick(e) {
    e.preventDefault()
    closeMobileMenu()
    displayBookmarks()
    toggleModal(getEl("bookmarkModal"), true)
  }

  // Attach event listeners to both desktop and mobile links
  if (aboutLink) {
    aboutLink.addEventListener("click", handleAboutClick)
  }
  if (mobileAboutLink) {
    mobileAboutLink.addEventListener("click", handleAboutClick)
  }
  if (mobileBookmarkLink) {
    mobileBookmarkLink.addEventListener("click", handleBookmarkClick)
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

  if (quizModal) {
    toggleModal(quizModal, false)
  }

  function setElementText(element, text, defaultValue = "N/A") {
    if (element) {
      element.textContent = text || defaultValue
    }
  }

  const purify = DOMPurify

  function setElementHTML(element, htmlContent) {
    if (element) {
      element.innerHTML = purify.sanitize(htmlContent)
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
          (item.tingkat && item.tingkat.toLowerCase().includes(searchTerm))
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

      const contohPenggunaanHTML = item.contohPenggunaan ? item.contohPenggunaan.replace(/\n/g, "<br>") : null
      setDataOrHide(cardClone, "contohPenggunaan", "contohPenggunaan", DOMPurify.sanitize(contohPenggunaanHTML), true)

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

      const quizButton = queryEl(cardClone, '[data-action="openQuiz"]')
      if (quizButton) {
        const hasQuiz = item.quiz && item.quiz.pertanyaan
        toggleElementDisplay(quizButton, hasQuiz)
        if (hasQuiz) {
          quizButton.addEventListener("click", () => {
            openQuizModal(item.namaFungsi, item.quiz)
          })
        }
      }

      const bookmarkButton = queryEl(cardClone, '[data-action="bookmark"]')
      if (bookmarkButton) {
        const bookmarkStar = queryEl(bookmarkButton, ".bookmark-star")
        const bookmarkText = queryEl(bookmarkButton, ".bookmark-text")

        function updateButtonAppearance(isBookmarkedState) {
          if (isBookmarkedState) {
            bookmarkButton.classList.remove("bg-gray-600", "hover:bg-gray-500")
            bookmarkButton.classList.remove("bg-gradient-to-r", "from-gray-600", "to-gray-700")
            bookmarkButton.classList.add("bg-yellow-500", "hover:bg-yellow-600")

            if (bookmarkStar) bookmarkStar.textContent = "⭐"
            if (bookmarkText) bookmarkText.textContent = "Bookmarked"
          } else {
            bookmarkButton.classList.remove("bg-yellow-500", "hover:bg-yellow-600")
            bookmarkButton.classList.add("bg-gray-600", "hover:bg-gray-500")
            if (bookmarkStar) bookmarkStar.textContent = "☆"
            if (bookmarkText) bookmarkText.textContent = "Bookmark"
          }
        }

        updateButtonAppearance(isBookmarked(item.namaFungsi))

        bookmarkButton.addEventListener("click", () => {
          const currentlyBookmarked = isBookmarked(item.namaFungsi)

          if (currentlyBookmarked) {
            removeBookmark(item.namaFungsi)
            updateButtonAppearance(false)
          } else {
            addBookmark(item)
            updateButtonAppearance(true)
          }
        })
      }

      containerDiv.appendChild(cardClone)
    })

    hasilPencarianDiv.appendChild(containerDiv)
  }

  function openQuizModal(namaFungsi, quizData) {
    if (!quizModal || !quizData) return

    currentQuizData = quizData
    currentScore = 0
    hasAnswered = false

    setElementText(quizModalTitle, `Quiz: ${namaFungsi}`)
    setElementText(quizProgress, "1/1")
    setElementText(quizScore, "0")

    if (quizProgressBar) {
      quizProgressBar.style.width = "100%"
    }

    toggleElementDisplay(quizContent, true)
    toggleElementDisplay(quizResults, false)
    loadQuizQuestion(quizData)
    toggleModal(quizModal, true)
  }

  function loadQuizQuestion(quizData) {
    if (!quizData || !quizQuestion || !quizOptions) return

    setElementText(quizQuestion, quizData.pertanyaan)
    setElementHTML(quizOptions, "")

    quizData.pilihan.forEach((pilihan, index) => {
      const optionDiv = document.createElement("div")
      optionDiv.className =
        "quiz-option bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 hover:border-blue-500/50 p-4 rounded-xl cursor-pointer transition-all duration-300"
      optionDiv.innerHTML = `
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-full border-2 border-gray-500 flex items-center justify-center text-sm font-bold">
            ${String.fromCharCode(65 + index)}
          </div>
          <span class="text-gray-200">${pilihan}</span>
        </div>
      `
      optionDiv.addEventListener("click", () => {
        if (!hasAnswered) {
          selectQuizOption(index, optionDiv)
        }
      })
      quizOptions.appendChild(optionDiv)
    })

    toggleElementDisplay(quizExplanation, false)
    toggleElementDisplay(nextQuizBtn, false)
    hasAnswered = false
  }

  function selectQuizOption(selectedIndex, selectedElement) {
    if (hasAnswered) return
    hasAnswered = true
    const isCorrect = selectedIndex === currentQuizData.jawabanBenar

    if (isCorrect) {
      currentScore = 1
      setElementText(quizScore, currentScore.toString())
    }

    const allOptions = quizOptions.querySelectorAll(".quiz-option")
    allOptions.forEach((option, index) => {
      option.classList.add("disabled")
      if (index === currentQuizData.jawabanBenar) {
        option.classList.add("correct")
        option.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)"
        option.style.borderColor = "#10b981"
      } else if (index === selectedIndex && !isCorrect) {
        option.classList.add("incorrect")
        option.style.background = "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
        option.style.borderColor = "#ef4444"
      }
    })

    if (currentQuizData.penjelasan) {
      setElementText(quizExplanationText, currentQuizData.penjelasan)
      toggleElementDisplay(quizExplanation, true)
    }

    setTimeout(() => {
      showQuizResults()
    }, 2000)
  }

  function showQuizResults() {
    toggleElementDisplay(quizContent, false)
    toggleElementDisplay(quizResults, true)
    setElementText(finalScore, `${currentScore}`)
    let message = ""
    if (currentScore === 1) {
      message = "🎉 Sempurna! Anda benar-benar memahami konsep ini!"
    } else {
      message = "💪 Jangan menyerah! Coba pelajari lagi dan ulangi quiz."
    }
    setElementText(scoreMessage, message)
  }

  function closeQuizModal() {
    if (quizModal) {
      toggleModal(quizModal, false)
      currentQuizData = null
      currentScore = 0
      hasAnswered = false
    }
  }

  if (closeQuizModalBtn) {
    closeQuizModalBtn.addEventListener("click", closeQuizModal)
  }

  if (restartQuizBtn) {
    restartQuizBtn.addEventListener("click", () => {
      if (currentQuizData) {
        currentScore = 0
        hasAnswered = false
        setElementText(quizScore, "0")
        toggleElementDisplay(quizContent, true)
        toggleElementDisplay(quizResults, false)
        loadQuizQuestion(currentQuizData)
      }
    })
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
          const titleElement = document.getElementById(`funfact-title-${i}`)
          const contentElement = document.getElementById(`funfact-content-${i}`)
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

  // Python IDE Implementation
  class PythonIDE {
    constructor() {
      this.files = new Map()
      this.currentFile = "main.py"
      this.tabs = new Set()
      this.autocompleteData = []
      this.isInitialized = false

      // Initialize with a default file
      this.files.set("main.py", {
        content: '# Welcome to Python IDE\n# Start coding here...\n\nprint("Hello, Python IDE!")',
        type: "file",
        modified: false,
      })
      this.tabs.add("main.py")

      this.initializeAutocomplete()
    }

    initialize() {
      if (this.isInitialized) return

      this.bindEvents()
      this.renderFileExplorer()
      this.renderTabs()
      this.loadFile("main.py")
      this.setupSyntaxHighlighting()
      this.setupAutocompletion()
      this.isInitialized = true
      this.setupResizablePanel()
    }

    bindEvents() {
      // IDE Controls
      getEl("ideRunBtn")?.addEventListener("click", () => this.runCode())
      getEl("ideSaveBtn")?.addEventListener("click", () => this.saveCurrentFile())
      getEl("ideNewFileBtn")?.addEventListener("click", () => this.createNewFile())
      getEl("ideCreateFolderBtn")?.addEventListener("click", () => this.createFolder())
      getEl("ideDeleteFileBtn")?.addEventListener("click", () => this.deleteCurrentFile())
      getEl("ideClearOutputBtn")?.addEventListener("click", () => this.clearOutput())

      // Output tabs
      getEl("ideOutputTab")?.addEventListener("click", () => this.switchOutputTab("output"))
      getEl("ideProblemsTab")?.addEventListener("click", () => this.switchOutputTab("problems"))

      // Mobile file explorer toggle
      getEl("toggleFilesBtn")?.addEventListener("click", () => this.toggleMobileFiles())

      // Editor events
      const editor = getEl("ideCodeEditor")
      if (editor) {
        editor.addEventListener("input", () => this.onEditorChange())
        editor.addEventListener("keydown", (e) => this.onEditorKeyDown(e))
        editor.addEventListener("scroll", () => this.updateLineNumbers())
        editor.addEventListener("click", () => this.updateCursorPosition())
        editor.addEventListener("keyup", () => this.updateCursorPosition())
      }

      // Keyboard shortcuts
      document.addEventListener("keydown", (e) => {
        if (getEl("pythonIDEModal")?.classList.contains("flex")) {
          this.handleKeyboardShortcuts(e)
        }
      })
    }

    initializeAutocomplete() {
      this.autocompleteData = [
        // Python keywords
        { text: "def", type: "keyword", description: "Define a function" },
        { text: "class", type: "keyword", description: "Define a class" },
        { text: "if", type: "keyword", description: "Conditional statement" },
        { text: "elif", type: "keyword", description: "Else if condition" },
        { text: "else", type: "keyword", description: "Else condition" },
        { text: "for", type: "keyword", description: "For loop" },
        { text: "while", type: "keyword", description: "While loop" },
        { text: "try", type: "keyword", description: "Try block" },
        { text: "except", type: "keyword", description: "Exception handler" },
        { text: "finally", type: "keyword", description: "Finally block" },
        { text: "import", type: "keyword", description: "Import module" },
        { text: "from", type: "keyword", description: "Import from module" },
        { text: "return", type: "keyword", description: "Return value" },
        { text: "yield", type: "keyword", description: "Yield value" },
        { text: "break", type: "keyword", description: "Break loop" },
        { text: "continue", type: "keyword", description: "Continue loop" },
        { text: "pass", type: "keyword", description: "Pass statement" },

        // Built-in functions
        { text: "print()", type: "function", description: "Print to console" },
        { text: "input()", type: "function", description: "Get user input" },
        { text: "len()", type: "function", description: "Get length" },
        { text: "range()", type: "function", description: "Generate range" },
        { text: "str()", type: "function", description: "Convert to string" },
        { text: "int()", type: "function", description: "Convert to integer" },
        { text: "float()", type: "function", description: "Convert to float" },
        { text: "list()", type: "function", description: "Create list" },
        { text: "dict()", type: "function", description: "Create dictionary" },
        { text: "set()", type: "function", description: "Create set" },
        { text: "tuple()", type: "function", description: "Create tuple" },
        { text: "type()", type: "function", description: "Get type" },
        { text: "isinstance()", type: "function", description: "Check instance" },
        { text: "hasattr()", type: "function", description: "Check attribute" },
        { text: "getattr()", type: "function", description: "Get attribute" },
        { text: "setattr()", type: "function", description: "Set attribute" },

        // Common methods
        { text: ".append()", type: "method", description: "Add to list" },
        { text: ".extend()", type: "method", description: "Extend list" },
        { text: ".insert()", type: "method", description: "Insert into list" },
        { text: ".remove()", type: "method", description: "Remove from list" },
        { text: ".pop()", type: "method", description: "Pop from list" },
        { text: ".index()", type: "method", description: "Find index" },
        { text: ".count()", type: "method", description: "Count occurrences" },
        { text: ".sort()", type: "method", description: "Sort list" },
        { text: ".reverse()", type: "method", description: "Reverse list" },
        { text: ".split()", type: "method", description: "Split string" },
        { text: ".join()", type: "method", description: "Join strings" },
        { text: ".replace()", type: "method", description: "Replace in string" },
        { text: ".strip()", type: "method", description: "Strip whitespace" },
        { text: ".lower()", type: "method", description: "Convert to lowercase" },
        { text: ".upper()", type: "method", description: "Convert to uppercase" },
        { text: ".keys()", type: "method", description: "Get dictionary keys" },
        { text: ".values()", type: "method", description: "Get dictionary values" },
        { text: ".items()", type: "method", description: "Get dictionary items" },
      ]
    }

    setupSyntaxHighlighting() {
      const editor = getEl("ideCodeEditor")
      if (!editor) return

      // Simple syntax highlighting (basic implementation)
      // In a real IDE, you'd use a proper syntax highlighting library like CodeMirror or Monaco
      editor.addEventListener("input", () => {
        this.highlightSyntax()
      })
    }

    highlightSyntax() {
      // This is a simplified syntax highlighting
      // In production, use CodeMirror or Monaco Editor
      const editor = getEl("ideCodeEditor")
      if (!editor) return

      // For now, we'll just update the status
      this.updateStatus("Syntax highlighting active")
    }

    setupAutocompletion() {
      const editor = getEl("ideCodeEditor")
      if (!editor) return

      let autocompleteTimeout

      editor.addEventListener("input", (e) => {
        clearTimeout(autocompleteTimeout)
        autocompleteTimeout = setTimeout(() => {
          this.showAutocomplete(e)
        }, 300)
      })

      editor.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.hideAutocomplete()
        }
      })
    }

    showAutocomplete(event) {
      const editor = getEl("ideCodeEditor")
      if (!editor) return

      const cursorPos = editor.selectionStart
      const text = editor.value.substring(0, cursorPos)
      const words = text.split(/\s+/)
      const currentWord = words[words.length - 1]

      if (currentWord.length < 2) {
        this.hideAutocomplete()
        return
      }

      const matches = this.autocompleteData.filter((item) =>
        item.text.toLowerCase().startsWith(currentWord.toLowerCase()),
      )

      if (matches.length > 0) {
        this.renderAutocomplete(matches, currentWord)
      } else {
        this.hideAutocomplete()
      }
    }

    renderAutocomplete(matches, currentWord) {
      this.hideAutocomplete()

      const editor = getEl("ideCodeEditor")
      if (!editor) return

      const autocomplete = document.createElement("div")
      autocomplete.id = "ideAutocomplete"
      autocomplete.className = "ide-autocomplete"

      matches.slice(0, 10).forEach((match, index) => {
        const item = document.createElement("div")
        item.className = "ide-autocomplete-item"
        if (index === 0) item.classList.add("selected")

        const icon = this.getAutocompleteIcon(match.type)
        item.innerHTML = `
          <span class="ide-autocomplete-icon">${icon}</span>
          <span class="ide-autocomplete-text">${match.text}</span>
          <span class="ide-autocomplete-type">${match.type}</span>
        `

        item.addEventListener("click", () => {
          this.insertAutocomplete(match.text, currentWord)
        })

        autocomplete.appendChild(item)
      })

      // Position the autocomplete
      const rect = editor.getBoundingClientRect()
      autocomplete.style.position = "absolute"
      autocomplete.style.left = `${rect.left + 20}px`
      autocomplete.style.top = `${rect.top + 100}px`

      document.body.appendChild(autocomplete)
    }

    getAutocompleteIcon(type) {
      const icons = {
        keyword: "🔑",
        function: "⚡",
        method: "🔧",
        variable: "📦",
        class: "🏗️",
        module: "📚",
      }
      return icons[type] || "📄"
    }

    insertAutocomplete(text, currentWord) {
      const editor = getEl("ideCodeEditor")
      if (!editor) return

      const cursorPos = editor.selectionStart
      const beforeCursor = editor.value.substring(0, cursorPos - currentWord.length)
      const afterCursor = editor.value.substring(cursorPos)

      editor.value = beforeCursor + text + afterCursor
      editor.selectionStart = editor.selectionEnd = beforeCursor.length + text.length

      this.hideAutocomplete()
      editor.focus()
      this.markFileAsModified()
    }

    hideAutocomplete() {
      const autocomplete = getEl("ideAutocomplete")
      if (autocomplete) {
        autocomplete.remove()
      }
    }

    createNewFile() {
      const fileName = prompt("Enter file name:", "untitled.py")
      if (!fileName) return

      if (this.files.has(fileName)) {
        showNotification("File already exists!", "warning")
        return
      }

      this.files.set(fileName, {
        content: "# New Python file\n",
        type: "file",
        modified: false,
      })

      this.tabs.add(fileName)
      this.renderFileExplorer()
      this.renderTabs()
      this.loadFile(fileName)
      this.updateStatus(`Created ${fileName}`)
      showNotification(`Created ${fileName}`, "success")
    }

    createFolder() {
      const folderName = prompt("Enter folder name:")
      if (!folderName) return

      if (this.files.has(folderName)) {
        showNotification("Folder already exists!", "warning")
        return
      }

      this.files.set(folderName, {
        type: "folder",
        children: new Set(),
      })

      this.renderFileExplorer()
      this.updateStatus(`Created folder ${folderName}`)
      showNotification(`Created folder ${folderName}`, "success")
    }

    deleteCurrentFile() {
      if (this.currentFile === "main.py") {
        showNotification("Cannot delete main.py", "warning")
        return
      }

      if (confirm(`Delete ${this.currentFile}?`)) {
        this.files.delete(this.currentFile)
        this.tabs.delete(this.currentFile)

        // Switch to main.py or first available file
        const firstFile = Array.from(this.tabs)[0] || "main.py"
        this.loadFile(firstFile)

        this.renderFileExplorer()
        this.renderTabs()
        this.updateStatus(`Deleted ${this.currentFile}`)
        showNotification(`Deleted ${this.currentFile}`, "success")
      }
    }

    saveCurrentFile() {
      const editor = getEl("ideCodeEditor")
      if (!editor) return

      const file = this.files.get(this.currentFile)
      if (file) {
        file.content = editor.value
        file.modified = false
        this.renderTabs()
        this.updateStatus(`Saved ${this.currentFile}`)
        showNotification(`Saved ${this.currentFile}`, "success")
      }
    }

    loadFile(fileName) {
      const file = this.files.get(fileName)
      if (!file || file.type !== "file") return

      this.currentFile = fileName
      const editor = getEl("ideCodeEditor")
      if (editor) {
        editor.value = file.content
      }

      setElementText(getEl("ideCurrentFile"), fileName)
      this.renderTabs()
      this.updateCursorPosition()
      this.updateWordCount()
    }

    renderFileExplorer() {
      const explorer = getEl("ideFileExplorer")
      if (!explorer) return

      setElementHTML(explorer, "")

      for (const [name, file] of this.files) {
        const item = document.createElement("div")
        item.className = `ide-file-item ${file.type}`
        if (name === this.currentFile) {
          item.classList.add("active")
        }

        const icon = file.type === "folder" ? "📁" : "📄"
        item.innerHTML = `
          <span class="file-icon">${icon}</span>
          <span>${name}</span>
        `

        if (file.type === "file") {
          item.addEventListener("click", () => {
            this.loadFile(name)
            if (!this.tabs.has(name)) {
              this.tabs.add(name)
              this.renderTabs()
            }
          })
        }

        explorer.appendChild(item)
      }
      this.renderMobileFileExplorer() // Update mobile file explorer if open
    }

    renderTabs() {
      const tabBar = getEl("ideTabBar")
      if (!tabBar) return

      setElementHTML(tabBar, "")

      for (const fileName of this.tabs) {
        const file = this.files.get(fileName)
        if (!file) continue

        const tab = document.createElement("div")
        tab.className = "ide-tab"
        if (fileName === this.currentFile) {
          tab.classList.add("active")
        }

        const modifiedIndicator = file.modified ? "●" : ""
        tab.innerHTML = `
          <span>${fileName}${modifiedIndicator}</span>
          <span class="tab-close" data-file="${fileName}">×</span>
        `

        tab.addEventListener("click", (e) => {
          if (e.target.classList.contains("tab-close")) {
            e.stopPropagation()
            this.closeTab(fileName)
          } else {
            this.loadFile(fileName)
          }
        })

        tabBar.appendChild(tab)
      }
    }

    closeTab(fileName) {
      if (fileName === "main.py") {
        showNotification("Cannot close main.py", "warning")
        return
      }

      const file = this.files.get(fileName)
      if (file && file.modified) {
        if (!confirm(`${fileName} has unsaved changes. Close anyway?`)) {
          return
        }
      }

      this.tabs.delete(fileName)

      if (fileName === this.currentFile) {
        const remainingTabs = Array.from(this.tabs)
        const nextFile = remainingTabs[0] || "main.py"
        this.loadFile(nextFile)
      }

      this.renderTabs()
    }

    runCode() {
      const editor = getEl("ideCodeEditor")
      if (!editor) return

      this.clearOutput()
      this.switchOutputTab("output")
      this.updateStatus("Running...")

      const code = editor.value
      this.executeCode(code)
    }

    executeCode(code) {
      const outputContent = getEl("ideOutputContent")
      if (!outputContent) return

      setElementHTML(outputContent, '<div class="text-blue-400">Running Python code...</div>')

      // Use the existing Skulpt execution from the main app
      const Sk = window.Sk
      if (!Sk) {
        setElementHTML(outputContent, '<div class="ide-error">Python interpreter not available</div>')
        this.updateStatus("Error: Python interpreter not available")
        return
      }

      Sk.configure({
        output: (text) => {
          const currentContent = outputContent.innerHTML
          if (currentContent.includes("Running Python code...")) {
            setElementHTML(outputContent, "")
          }
          outputContent.innerHTML += text.replace(/\n/g, "<br>")
          outputContent.scrollTop = outputContent.scrollHeight
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
        .asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true))
        .then(() => {
          if (outputContent.innerHTML.trim() === "" || outputContent.innerHTML.includes("Running Python code...")) {
            setElementHTML(outputContent, '<div class="ide-success">✅ Code executed successfully (no output)</div>')
          }
          this.updateStatus("Execution completed")
        })
        .catch((error) => {
          console.error("IDE Execution error:", error)
          let errorMessage = error.toString()
          if (error.tp$name && error.args && error.args.v.length > 0) {
            errorMessage = `${error.tp$name}: ${Sk.ffi.remapToJs(error.args.v[0])}`
            if (error.traceback && error.traceback.length > 0) {
              const lastTrace = error.traceback[error.traceback.length - 1]
              if (lastTrace.lineno !== undefined) {
                errorMessage += ` (line ${lastTrace.lineno})`
              }
            }
          }
          setElementHTML(outputContent, `<div class="ide-error">❌ ${errorMessage}</div>`)
          this.updateStatus("Execution failed")
        })
    }

    clearOutput() {
      const outputContent = getEl("ideOutputContent")
      if (outputContent) {
        setElementHTML(outputContent, '<div class="text-gray-500 italic">Output cleared</div>')
      }
    }

    switchOutputTab(tab) {
      // Update tab appearance
      document.querySelectorAll(".ide-output-tab").forEach((t) => {
        t.classList.remove("active")
      })
      getEl(`ide${tab.charAt(0).toUpperCase() + tab.slice(1)}Tab`)?.classList.add("active")

      // Show/hide content
      const contents = ["ideOutputContent", "ideProblemsContent"]
      contents.forEach((id) => {
        const element = getEl(id)
        if (element) {
          element.classList.toggle("hidden", !id.includes(tab.charAt(0).toUpperCase() + tab.slice(1)))
        }
      })
    }

    onEditorChange() {
      this.markFileAsModified()
      this.updateWordCount()
      this.updateCursorPosition()
    }

    onEditorKeyDown(event) {
      const editor = getEl("ideCodeEditor")
      if (!editor) return

      // Handle tab key for indentation
      if (event.key === "Tab") {
        event.preventDefault()
        const start = editor.selectionStart
        const end = editor.selectionEnd

        if (event.shiftKey) {
          // Unindent
          const beforeCursor = editor.value.substring(0, start)
          const afterCursor = editor.value.substring(end)
          const lines = beforeCursor.split("\n")
          const currentLine = lines[lines.length - 1]

          if (currentLine.startsWith("    ")) {
            lines[lines.length - 1] = currentLine.substring(4)
            editor.value = lines.join("\n") + afterCursor
            editor.selectionStart = editor.selectionEnd = start - 4
          }
        } else {
          // Indent
          editor.value = editor.value.substring(0, start) + "    " + editor.value.substring(end)
          editor.selectionStart = editor.selectionEnd = start + 4
        }

        this.markFileAsModified()
      }

      // Auto-close brackets and quotes
      const pairs = {
        "(": ")",
        "[": "]",
        "{": "}",
        '"': '"',
        "'": "'",
      }

      if (pairs[event.key]) {
        event.preventDefault()
        const start = editor.selectionStart
        const end = editor.selectionEnd
        const selectedText = editor.value.substring(start, end)

        editor.value =
          editor.value.substring(0, start) + event.key + selectedText + pairs[event.key] + editor.value.substring(end)

        editor.selectionStart = editor.selectionEnd = start + 1
        this.markFileAsModified()
      }
    }

    handleKeyboardShortcuts(event) {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "s":
            event.preventDefault()
            this.saveCurrentFile()
            break
          case "n":
            event.preventDefault()
            this.createNewFile()
            break
          case "r":
            event.preventDefault()
            this.runCode()
            break
          case "w":
            event.preventDefault()
            this.closeTab(this.currentFile)
            break
        }
      }

      if (event.key === "F5") {
        event.preventDefault()
        this.runCode()
      }
    }

    markFileAsModified() {
      const file = this.files.get(this.currentFile)
      if (file) {
        file.modified = true
        this.renderTabs()
      }
    }

    updateCursorPosition() {
      const editor = getEl("ideCodeEditor")
      const lineColElement = getEl("ideLineCol")
      if (!editor || !lineColElement) return

      const cursorPos = editor.selectionStart
      const textBeforeCursor = editor.value.substring(0, cursorPos)
      const lines = textBeforeCursor.split("\n")
      const line = lines.length
      const col = lines[lines.length - 1].length + 1

      setElementText(lineColElement, `Line ${line}, Col ${col}`)
    }

    updateWordCount() {
      const editor = getEl("ideCodeEditor")
      const wordCountElement = getEl("ideWordCount")
      if (!editor || !wordCountElement) return

      const words = editor.value
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0)
      setElementText(wordCountElement, `${words.length} words`)
    }

    updateStatus(message) {
      const statusElement = getEl("ideStatus")
      if (statusElement) {
        setElementText(statusElement, message)
        setTimeout(() => {
          setElementText(statusElement, "Ready")
        }, 3000)
      }
    }

    updateFileCount() {
      const fileCountElement = getEl("ideFileCount")
      if (fileCountElement) {
        const fileCount = Array.from(this.files.values()).filter((f) => f.type === "file").length
        setElementText(fileCountElement, `${fileCount} file${fileCount !== 1 ? "s" : ""}`)
      }
    }

    toggleMobileFiles() {
      // Create mobile files panel if it doesn't exist
      let mobileFilesPanel = getEl("mobileFilesPanel")
      let mobileFilesOverlay = getEl("mobileFilesOverlay")

      if (!mobileFilesPanel) {
        // Create panel
        mobileFilesPanel = document.createElement("div")
        mobileFilesPanel.id = "mobileFilesPanel"
        mobileFilesPanel.className = "mobile-files-panel"

        // Create header
        const header = document.createElement("div")
        header.className = "p-3 border-b border-gray-700/50 flex justify-between items-center"
        header.innerHTML = `
          <h3 class="text-sm font-semibold text-gray-300">Files</h3>
          <button id="closeMobileFiles" class="text-gray-400 hover:text-white">×</button>
        `
        mobileFilesPanel.appendChild(header)

        // Create file explorer container
        const explorerContainer = document.createElement("div")
        explorerContainer.className = "p-3"
        explorerContainer.innerHTML = `
          <div class="flex space-x-1 mb-3">
            <button id="mobileNewFileBtn" class="text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded transition-colors duration-200">
              📄 New File
            </button>
            <button id="mobileNewFolderBtn" class="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors duration-200">
              📁 New Folder
            </button>
          </div>
          <div id="mobileFileExplorer" class="mt-2"></div>
        `
        mobileFilesPanel.appendChild(explorerContainer)

        // Create overlay
        mobileFilesOverlay = document.createElement("div")
        mobileFilesOverlay.id = "mobileFilesOverlay"
        mobileFilesOverlay.className = "mobile-files-overlay"

        // Add to DOM
        const ideModal = getEl("pythonIDEModal")
        if (ideModal) {
          const modalContent = ideModal.querySelector(".modal-content")
          if (modalContent) {
            modalContent.appendChild(mobileFilesPanel)
            modalContent.appendChild(mobileFilesOverlay)

            // Add event listeners
            getEl("closeMobileFiles")?.addEventListener("click", () => this.toggleMobileFiles())
            mobileFilesOverlay.addEventListener("click", () => this.toggleMobileFiles())
            getEl("mobileNewFileBtn")?.addEventListener("click", () => {
              this.createNewFile()
              this.toggleMobileFiles()
            })
            getEl("mobileNewFolderBtn")?.addEventListener("click", () => {
              this.createFolder()
              this.toggleMobileFiles()
            })

            // Populate files
            this.renderMobileFileExplorer()
          }
        }
      }

      // Toggle panel visibility
      const isOpen = mobileFilesPanel.classList.contains("open")
      mobileFilesPanel.classList.toggle("open", !isOpen)
      mobileFilesOverlay.classList.toggle("open", !isOpen)

      if (!isOpen) {
        this.renderMobileFileExplorer()
      }
    }

    renderMobileFileExplorer() {
      const explorer = getEl("mobileFileExplorer")
      if (!explorer) return

      setElementHTML(explorer, "")

      for (const [name, file] of this.files) {
        const item = document.createElement("div")
        item.className = `ide-file-item ${file.type} mb-1`
        if (name === this.currentFile) {
          item.classList.add("active")
        }

        const icon = file.type === "folder" ? "📁" : "📄"
        item.innerHTML = `
          <div class="flex justify-between items-center">
            <div>
              <span class="file-icon">${icon}</span>
              <span>${name}</span>
            </div>
            ${
              file.type === "file" && name !== "main.py"
                ? `<button class="delete-file-btn text-red-400 hover:text-red-600 px-2" data-file="${name}">🗑️</button>`
                : ""
            }
          </div>
        `

        if (file.type === "file") {
          item.addEventListener("click", (e) => {
            if (!e.target.classList.contains("delete-file-btn")) {
              this.loadFile(name)
              if (!this.tabs.has(name)) {
                this.tabs.add(name)
                this.renderTabs()
              }
              this.toggleMobileFiles()
            }
          })

          const deleteBtn = item.querySelector(".delete-file-btn")
          if (deleteBtn) {
            deleteBtn.addEventListener("click", (e) => {
              e.stopPropagation()
              if (confirm(`Delete ${name}?`)) {
                this.files.delete(name)
                this.tabs.delete(name)
                if (name === this.currentFile) {
                  const firstFile = Array.from(this.tabs)[0] || "main.py"
                  this.loadFile(firstFile)
                }
                this.renderFileExplorer()
                this.renderMobileFileExplorer()
                this.renderTabs()
                showNotification(`Deleted ${name}`, "success")
              }
            })
          }
        }

        explorer.appendChild(item)
      }
    }

    setupResizablePanel() {
      const resizablePanel = document.querySelector(".resizable-panel")
      if (!resizablePanel) return

      let startY, startHeight

      const initResize = (e) => {
        startY = e.clientY || (e.touches && e.touches[0].clientY)
        startHeight = Number.parseInt(document.defaultView.getComputedStyle(resizablePanel).height, 10)

        document.addEventListener("mousemove", resize)
        document.addEventListener("touchmove", resize)
        document.addEventListener("mouseup", stopResize)
        document.addEventListener("touchend", stopResize)

        e.preventDefault()
      }

      const resize = (e) => {
        const clientY = e.clientY || (e.touches && e.touches[0].clientY)
        const deltaY = startY - clientY
        resizablePanel.style.height = `${startHeight + deltaY}px`
      }

      const stopResize = () => {
        document.removeEventListener("mousemove", resize)
        document.removeEventListener("touchmove", resize)
        document.removeEventListener("mouseup", stopResize)
        document.removeEventListener("touchend", stopResize)
      }

      resizablePanel.addEventListener("mousedown", (e) => {
        if (e.offsetY < 10) initResize(e)
      })

      resizablePanel.addEventListener("touchstart", (e) => {
        const touch = e.touches[0]
        const rect = resizablePanel.getBoundingClientRect()
        if (touch.clientY - rect.top < 10) initResize(e)
      })
    }
  }

  // Initialize IDE
  let pythonIDE = null

  // IDE Modal Controls
  const openIDEBtn = getEl("openIDEBtn")
  const pythonIDEModal = getEl("pythonIDEModal")
  const closePythonIDEModal = getEl("closePythonIDEModal")

  if (openIDEBtn) {
    openIDEBtn.addEventListener("click", () => {
      if (!pythonIDE) {
        pythonIDE = new PythonIDE()
      }
      pythonIDE.initialize()
      toggleModal(pythonIDEModal, true)
      showNotification("🚀 Python IDE opened!", "success")
    })
  }

  if (closePythonIDEModal) {
    closePythonIDEModal.addEventListener("click", () => {
      toggleModal(pythonIDEModal, false)
    })
  }

  // Close IDE modal on escape or backdrop click
  if (pythonIDEModal) {
    pythonIDEModal.addEventListener("click", (e) => {
      if (e.target === pythonIDEModal) {
        toggleModal(pythonIDEModal, false)
      }
    })
  }

  // Initialize bookmark count on page load
  updateBookmarkCount()
})
