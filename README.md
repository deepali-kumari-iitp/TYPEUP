# TYPEUP — Learn. Practice. Improve.

**TYPEUP** is a free, interactive typing-learning and practice platform designed to help people develop touch-typing skills, improve typing speed, and build accuracy through structured learning and real-time practice.

It combines a 30-day beginner-friendly typing academy with an independent typing arena, interactive exercises, typing analytics, and browser-based progress tracking.

No account or registration required.

## ✨ Features

### 1. 30-Day Typing Academy
- Structured 30-day typing curriculum.
- Beginner-friendly lessons with step-by-step explanations.
- Finger placement and keyboard guidance.
- Guided typing exercises and word practice.
- Lesson assessments and completion tracking.
- All lessons accessible without account registration.

### 2. Typing Arena
- Independent typing practice environment.
- Time-based and word-based typing tests.
- Different test durations and word counts.
- Real-time typing speed and accuracy.
- Typing results and performance analysis.

### 3. Typing Analytics & History
- Words Per Minute (WPM) tracking.
- Accuracy and typing performance analysis.
- Typing history and previous results.
- Performance visualization.

### 4. Interactive Learning Tools
- Finger placement guide.
- Interactive keyboard visualization.
- Typing games.
- Game history and progress tracking.

### 5. Account-Free Experience
- No signup or login required.
- Learning progress stored locally in the browser.
- Shared learning curriculum served through the backend API.

## 🛠️ Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React.js, JavaScript, Vite |
| Styling | CSS, Tailwind CSS |
| Routing | React Router DOM |
| Animations | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Database Migrations | Alembic |
| API Validation | Pydantic |
| Testing | Pytest, Vitest |
| Version Control | Git & GitHub |

## 🏗️ Project Architecture

```text
TYPEUP/
│
├── backend/
│   ├── alembic/
│   │   └── versions/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── lessons.py
│   │   ├── db/
│   │   │   └── database.py
│   │   ├── models/
│   │   ├── schemas/
│   │   └── main.py
│   ├── scripts/
│   │   └── seed_curriculum.py
│   ├── requirements.txt
│   └── alembic.ini
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utility/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## ⚙️ Getting Started

Follow these instructions to run TYPEUP locally.

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Python 3.11+
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/deepali-kumari-iitp/TYPEUP.git
cd TYPEUP
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend/` directory.

Add your local PostgreSQL configuration:

```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=typeup_db
```

Create a PostgreSQL database named `typeup_db` before starting the backend.

**Important:** Never commit your `.env` file or expose database credentials.

### 4. Run Database Migrations

From the `backend/` directory:

```bash
alembic upgrade head
```

### 5. Seed the Learning Curriculum

```bash
python -m scripts.seed_curriculum
```

This synchronizes the 30-day learning curriculum with the database.

### 6. Start the Backend Server

```bash
python -m uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

### 7. Frontend Setup

Open a new terminal from the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API welcome message |
| GET | `/health` | Backend health check |
| GET | `/health/db` | Database connectivity check |
| GET | `/api/v1/lessons/` | Retrieve all lessons |
| GET | `/api/v1/lessons/{day_number}` | Retrieve a specific day's lesson |

## 📈 Progress Storage

TYPEUP currently uses browser LocalStorage to maintain individual browser-profile learning progress and typing history.

The curriculum and lesson content are managed through the PostgreSQL database and delivered using the FastAPI backend.

No user registration or authentication is required.

## 🗺️ Future Improvements

- More advanced typing exercises.
- Expanded typing games and challenges.
- Improved performance analytics.
- Additional keyboard layouts.
- Enhanced learning recommendations.
- Responsive experience improvements.

## 🤝 Contributing

Contributions, suggestions, and feedback are welcome!

1. Fork the repository.
2. Create a new feature branch.
3. Make your changes.
4. Test your changes.
5. Submit a Pull Request.

## 👩‍💻 Author

**Deepali Kumari**

B.Sc. Computer Science & Data Analytics  
Indian Institute of Technology Patna

GitHub: [@deepali-kumari-iitp](https://github.com/deepali-kumari-iitp)

---

<p align="center">
  <strong>TYPEUP — Learn. Practice. Improve.</strong>
  <br/>
  Making typing skills accessible to everyone.
</p>
