# 📘 EduZen

**EduZen** is an intelligent and personalized education platform for students. It leverages AI to simplify test preparation, syllabus management, and performance analysis — all in one seamless experience.

## 🚀 Features

### 🔐 Authentication
- Secure login system using **NextAuth.js**
- Individual student profiles with subject and test data

### 📚 Smart Subject Management
- Add and manage custom subjects
- Upload curriculum PDFs
- **AI-powered (Gemini)** PDF parser extracts syllabus chapters and topics automatically

### 🧪 AI Test Generation
- Take tests at **subject**, **chapter**, or **topic** level
- Choose test difficulty: Easy, Medium, or Hard
- All questions are generated dynamically using **AI models**

### 📊 Intelligent Performance Analytics
- Detailed result breakdown for each test
- View explanations for every question
- Subject dashboards include:
  - Test history
  - Progress tracking
  - AI-powered insights and predictions

---

## 🛠️ Tech Stack

| Tech            | Description                         |
|-----------------|-------------------------------------|
| **Next.js 15**  | App Router architecture             |
| **NextAuth.js** | Authentication and session handling |
| **MongoDB**     | NoSQL database for user data        |
| **Tailwind CSS**| Utility-first styling               |
| **JavaScript**  | Core language for logic & UI        |

---

## 🧠 AI Integration

- Uses **Gemini AI** for curriculum PDF parsing and test generation
- AI generates questions, explanations, insights, and progress predictions

---

## 🧪 Local Development

```bash
# Clone the repo
git clone https://github.com/AI-for-Impact-Group-2/ai-for-impact-final-day-duosyntax.git

# Go into the project
cd eduzen

# Install dependencies
npm install

# Create .env file and add required keys for:
# - MongoDB URI
# - NextAuth Secrets
# - Gemini AI Keys

# Run the app
npm run dev
````

---

## 🌟 Future Enhancements

* Flashcards and spaced repetition system
* Study planner with AI-generated schedules
* Peer leaderboard and competition mode

---

## ✨ Authors

Made with 💡 by the **DuoSyntax** Team


