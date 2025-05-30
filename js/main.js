document.addEventListener("DOMContentLoaded", () => {
  const getEl = (id) => document.getElementById(id)
  const queryEl = (parent, selector) => parent.querySelector(selector)
  const queryAllEl = (parent, selector) => parent.querySelectorAll(selector)

  const tutorialLink = getEl("tutorialLink")
  const aboutLink = getEl("aboutLink")

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

  // ==================== NEW FEATURES ====================

  // Bookmark System
  let bookmarks = JSON.parse(localStorage.getItem("pyedia-bookmarks") || "[]")

  function updateBookmarkCount() {
    const bookmarkCount = getEl("bookmarkCount")
    if (bookmarkCount) {
      if (bookmarks.length > 0) {
        bookmarkCount.textContent = bookmarks.length
        bookmarkCount.style.display = "flex"
        bookmarkCount.classList.add("bookmark-badge-update")
        setTimeout(() => bookmarkCount.classList.remove("bookmark-badge-update"), 800)
      } else {
        bookmarkCount.style.display = "none"
      }
    }
  }

  function saveBookmarks() {
    localStorage.setItem("pyedia-bookmarks", JSON.stringify(bookmarks))
    updateBookmarkCount()
  }

  function addBookmark(item) {
    const exists = bookmarks.find((b) => b.namaFungsi === item.namaFungsi)
    if (!exists) {
      bookmarks.push({
        namaFungsi: item.namaFungsi,
        kategori: item.kategori,
        tingkat: item.tingkat,
        pengertian: item.pengertian,
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
      name: "Basic Function",
      description: "Create a simple function template",
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
      name: "Class Template",
      description: "Create a basic class structure",
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
      name: "File Handler",
      description: "Template for file operations",
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
      name: "API Request",
      description: "Template for making API requests",
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
      name: "Data Processing",
      description: "Template for data analysis",
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
      if n % 2 == 0:
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
      level: "Beginner",
      color: "green",
      topics: [
        { name: "Python Syntax", functions: ["print()", "input()", "Python Comments"] },
        { name: "Variables & Data Types", functions: ["Python Variables", "Python Data Types", "Python Numbers"] },
        { name: "Basic Operations", functions: ["Python Operators", "Python Casting"] },
        { name: "Strings", functions: ["Python Strings", "Python String Formatting"] },
      ],
    },
    {
      level: "Intermediate",
      color: "blue",
      topics: [
        { name: "Data Structures", functions: ["Python Lists", "Python Tuples", "Python Sets", "Python Dictionaries"] },
        { name: "Control Flow", functions: ["Python If...Else", "Python While Loops", "Python For Loops"] },
        { name: "Functions", functions: ["Python Functions", "Python Lambda", "Python Scope"] },
        { name: "Built-in Functions", functions: ["len()", "type()", "range()", "sorted()"] },
      ],
    },
    {
      level: "Advanced",
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

  // ==================== ORIGINAL FUNCTIONS ====================

  function createModal(id, title, content) {
    const existingModal = document.getElementById(id)
    if (existingModal) {
      existingModal.remove()
    }

    const modalHTML = `
            <div id="${id}" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadeIn">
                <div class="modal-content gradient-card text-white max-w-4xl w-full mx-auto p-8 rounded-2xl shadow-2xl relative max-h-[85vh] overflow-y-auto border border-gray-600/50 modal-slide-up">
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

  if (aboutLink) {
    aboutLink.addEventListener("click", (e) => {
      e.preventDefault()
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
                            <li>🌙 Selalu Dark Mode</li>
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
      createModal("aboutModal", "Tentang Py.Edia", aboutContent)
    })
  }

  if (tutorialLink) {
    tutorialLink.addEventListener("click", (e) => {
      e.preventDefault()
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
      createModal("tutorialModal", "Tutorial Penggunaan", tutorialContent)
    })
  }

  const kamusData = []
  const Sk = window.Sk // Declare Sk variable

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

  function showLoadingState() {
    if (hasilPencarianDiv) {
      setElementHTML(
        hasilPencarianDiv,
        `
                <div class="col-span-full flex flex-col items-center justify-center py-20">
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
                    <div class="col-span-full text-center py-20">
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
                    <div class="col-span-full text-center text-orange-400 p-8 bg-orange-500/10 border border-orange-500/30 rounded-xl">
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

    if (searchTerm || selectedCategoryValue !== "") {
      setElementHTML(
        hasilPencarianDiv,
        `
                <div class="col-span-full flex items-center justify-center py-12">
                    <div class="flex items-center space-x-3">
                        <div class="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                        <span class="text-gray-400">Mencari...</span>
                    </div>
                </div>
            `,
      )
    }

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
                <div class="col-span-full text-center py-20">
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

    const fragment = document.createDocumentFragment()
    hasil.forEach((item, index) => {
      const cardClone = kamusItemTemplate.content.cloneNode(true)

      const card = cardClone.querySelector(".kamus-item-card")
      if (card) {
        card.style.animationDelay = `${index * 0.1}s`
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
            const isHidden = moreContentDiv.classList.contains("max-h-0")
            moreContentDiv.classList.toggle("max-h-0", !isHidden)
            moreContentDiv.classList.toggle("opacity-0", !isHidden)
            moreContentDiv.classList.toggle("max-h-[1000px]", isHidden)
            moreContentDiv.classList.toggle("opacity-100", isHidden)
            setElementText(toggleMoreButton, isHidden ? "Tampilkan Lebih Sedikit" : "Tampilkan Lebih Banyak", "")
            const icon = toggleMoreButton.querySelector(".toggle-icon")
            if (icon) {
              icon.style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)"
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
        const isCurrentlyBookmarked = isBookmarked(item.namaFungsi)
        if (isCurrentlyBookmarked) {
          bookmarkButton.classList.remove("bg-gray-600", "hover:bg-gray-500")
          bookmarkButton.classList.add("bg-yellow-500", "hover:bg-yellow-600")
          if (bookmarkStar) bookmarkStar.textContent = "⭐"
          const buttonText = queryEl(bookmarkButton, "span span:last-child")
          if (buttonText) buttonText.textContent = "Bookmarked"
        }

        bookmarkButton.addEventListener("click", () => {
          if (isBookmarked(item.namaFungsi)) {
            removeBookmark(item.namaFungsi)
            bookmarkButton.classList.remove("bg-yellow-500", "hover:bg-yellow-600")
            bookmarkButton.classList.add("bg-gray-600", "hover:bg-gray-500")
            if (bookmarkStar) bookmarkStar.textContent = "☆"
            const buttonText = queryEl(bookmarkButton, "span span:last-child")
            if (buttonText) buttonText.textContent = "Bookmark"
          } else {
            addBookmark(item)
            bookmarkButton.classList.remove("bg-gray-600", "hover:bg-gray-500")
            bookmarkButton.classList.add("bg-yellow-500", "hover:bg-yellow-600")
            if (bookmarkStar) bookmarkStar.textContent = "⭐"
            const buttonText = queryEl(bookmarkButton, "span span:last-child")
            if (buttonText) buttonText.textContent = "Bookmarked"
          }
        })
      }

      fragment.appendChild(cardClone)
    })
    hasilPencarianDiv.appendChild(fragment)
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

    let outputProcessingPromise = Promise.resolve()

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
                                <span class="text-green-400 italic">✅ Kode berhasil dijalankan tanpa output</span>
                            </div>
                        `,
            )
          }
          setButtonState(buttonElement, false)
          buttonElement.innerHTML = originalText
        })
      })
      .catch((err) => {
        outputProcessingPromise.then(() => {
          setElementHTML(
            outputDiv,
            `
                        <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                            <div class="flex items-center mb-2">
                                <span class="text-red-400 font-bold">❌ Error:</span>
                            </div>
                            <pre class="text-red-300 text-sm whitespace-pre-wrap">${err.toString()}</pre>
                        </div>
                    `,
          )
          setButtonState(buttonElement, false)
          buttonElement.innerHTML = originalText
        })
      })
  }

  async function loadData() {
    showLoadingState()
    try {
      const [dictionaryResponse, funfactResponse] = await Promise.all([fetch("dictionary.json"), fetch("funfact.json")])

      if (!dictionaryResponse.ok || !funfactResponse.ok) {
        throw new Error("Failed to load data files")
      }

      const dictionaryData = await dictionaryResponse.json()
      const funfactData = await funfactResponse.json()

      kamusData.push(...dictionaryData)

      if (funfactData && funfactData.length >= 3) {
        const shuffledFacts = funfactData.sort(() => 0.5 - Math.random()).slice(0, 3)
        shuffledFacts.forEach((fact, index) => {
          const titleEl = getEl(`funfact-title-${index + 1}`)
          const contentEl = getEl(`funfact-content-${index + 1}`)
          if (titleEl && contentEl) {
            setElementText(titleEl, fact.judul)
            setElementText(contentEl, fact.isi)
          }
        })
      }

      muatKamus()
    } catch (error) {
      console.error("Error loading data:", error)
      if (hasilPencarianDiv) {
        setElementHTML(
          hasilPencarianDiv,
          `
                    <div class="col-span-full text-center text-red-400 p-8 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <div class="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-xl">❌</span>
                        </div>
                        <h3 class="text-lg font-semibold mb-2">Error Memuat Data</h3>
                        <p>Gagal memuat data kamus. Pastikan file dictionary.json dan funfact.json tersedia.</p>
                        <button onclick="location.reload()" class="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                            Coba Lagi
                        </button>
                    </div>
                `,
        )
      }
    }
  }

  if (searchBar) {
    searchBar.addEventListener("input", filterAndDisplay)
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterAndDisplay)
  }

  const currentYearEl = getEl("currentYear")
  if (currentYearEl) {
    setElementText(currentYearEl, new Date().getFullYear().toString())
  }

  updateBookmarkCount()
  // Theme is always dark, no initialization needed for toggling
  // Ensure body does not have light-theme class if it was somehow added statically
  document.body.classList.remove("light-theme");


  loadData()
})