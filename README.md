*(請直接貼到新 Repo 的 README.md，並將 `[ ]` 或 `#` 換成妳的連結)*

```markdown
# 🎉 StudioOS: Digital Campaign & Event System

An automated, low-code event and lucky draw system designed for boutique studios. 

![Live Demo](#) <!-- 換成妳網站的 GitHub Pages 網址 -->
![License: MIT](https://opensource.org/licenses/MIT)

## 📖 About The Project

This is the Digital Campaign Engine module of **StudioOS**. Originally built for Sherry Aerial Studio's anniversary event, this system successfully transitioned our promotional campaigns from physical to online, breaking physical distance barriers and boosting student participation. 

During our first online iteration, the lightweight API seamlessly processed a total of **637 event entries**, proving its robust stability and data integrity in real-world scenarios.

## ✨ Core Features

- **Production-Ready & Stable:** Optimized Google Apps Script backend that successfully handled hundreds of student entries without any data loss or overwriting.
- **Automated Lucky Draw Logic:** Built-in mechanisms to handle fair and randomized event rewards.
- **Low-Code Database:** Uses Google Sheets as a flexible, easy-to-manage database that studio admins can operate without coding knowledge.
- **Responsive UI:** A mobile-friendly frontend designed for quick student engagement.

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (Hosted on GitHub Pages)
- **Backend / API:** Google Apps Script (GAS)
- **Database:** Google Sheets

## 📸 Screenshots

*(Add 2-3 screenshots of your event landing page or lucky draw results here)*

<!-- !Event Landing Page -->
<!-- !Success Screen -->

## 🚀 Getting Started

To deploy this event system for your own studio:

### 1. Database Setup (Google Sheets)
- Create a new Google Sheet.
- Set up tabs for `Entries`, `Prizes`, and `Logs`.

### 2. Backend Setup (Google Apps Script)
- Open your Google Sheet, navigate to `Extensions > Apps Script`.
- Copy the backend logic (from the `gas-backend/` folder) into the script editor.
- Deploy it as a **Web App** (Execute as: You, Who has access: Anyone).
- Copy the generated `Web App URL`.

### 3. Frontend Setup
- Clone this repository:
```

git clone https://github.com/YOUR_GITHUB_USERNAME/StudioOS-Event-System.git

```
- Open your main JS file and replace the API configuration:
```

const API_URL = "YOUR_GAS_API_URL_HERE";

```
- Host the frontend on GitHub Pages.

## 🔒 Security Note
This is an open-source template. Do not commit actual Google Sheets IDs, real student entry data, or private API keys. Make sure to use placeholders before pushing your code.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
```

直接拿去用吧！如果有哪邊需要調整隨時呼叫我！🎀
