# 🧠 Debate Client

**Debate Client** is the frontend for the **AI-Based Debate System**, a platform enabling structured debates between participants, powered by AI for argument segmentation and scoring. This client provides a smooth interface for users to register, join debates, exchange arguments in real time, and see AI-generated evaluations.

## 🚀 Features
- 🔐 **Authentication & Roles** — Register, login, logout, and manage user roles (admin, participant, moderator).
- 💬 **Real-Time Debate Chat** — WebSocket-based debate sessions with live updates.
- 🧩 **AI Argument Segmentation** — Visual representation of AI-pro
cessed arguments.
- 🧮 **Argument Evaluation & Scoring** — Displays AI-generated feedback on argument quality.
- 🎨 **Responsive UI** — Modern layout and adaptive design across all devices.

## 🏗️ Tech Stack
| Layer | Technology |
|-------|-------------|
| Framework | **Next.js / React** |
| State Management | Redux Toolkit / Context API |
| API Handling | Axios + RTK Query |
| Real-Time Communication | WebSockets |
| Styling | Tailwind CSS / Shadcn UI |
| Authentication | JWT (integrated with FastAPI backend) |

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/samiali12/debate-client.git
   cd debate-client bash
   ```

2. **Install dependencies**
    ```bash 
    npm install
    # or
    yarn install
    ```
3. **Configure environment variables**
    
    Create a .env.local file in the root directory:

    ```
    NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
    NEXT_PUBLIC_WS_URL=ws://127.0.0.1:8000
    ```
4. **Run the development server**
    ```
    npm run dev
    ```
5. **Build for production**
    ```
    npm run build
    npm start
    ```
### 🧾 License
This project is licensed under the MIT License — you are free to use and modify it.

### 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to improve.


