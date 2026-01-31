# 🎨 CanvasSync

> **Real-time collaborative drawing application** where multiple users can draw together on a shared canvas with live cursor tracking, global undo/redo, team chat, and room-based collaboration.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## 🌐 Live Demo

**Frontend (Vercel):** [https://canvassync-sandy.vercel.app](https://canvassync-sandy.vercel.app/)  
**Backend (Render):** [https://canvassync.onrender.com](https://canvassync.onrender.com)

> ⚠️ **Note:** The backend on Render may take 30-60 seconds to wake up if it has been idle.

---

## ✨ Features

### Core Drawing Tools
| Tool | Icon | Description |
|------|------|-------------|
| **Brush** | 🖌️ | Freehand drawing with customizable colors and stroke widths |
| **Eraser** | 🧹 | Remove unwanted strokes |
| **Line** | ➖ | Draw straight lines |
| **Arrow** | ➡️ | Draw directional arrows |
| **Rectangle** | ⬜ | Create rectangle shapes (filled or outlined) |
| **Circle** | ⭕ | Draw circles and ellipses (filled or outlined) |
| **Triangle** | 🔺 | Draw triangle shapes (filled or outlined) |
| **Diamond** | 🔷 | Draw diamond/rhombus shapes (filled or outlined) |
| **Text** | 📝 | Add text annotations |

### Fill Toggle Feature
- 🪣 **Fill Mode** - Toggle between filled shapes (solid color) or outlined shapes (stroke only)
- Works with Rectangle, Circle, Triangle, and Diamond tools

### Real-time Collaboration
- 👥 **Live Cursors** - See other users' cursor positions in real-time with their username
- 🔄 **Instant Sync** - All drawing actions sync instantly across all connected users
- 🏠 **Room System** - Create or join different collaborative rooms
- 👤 **User Presence** - See who's online with unique color-coded indicators

### 💬 Team Chat (NEW!)
- 📨 **Real-time Messaging** - Send instant messages to your team
- 📜 **Chat History** - Messages persist in room memory (last 100 messages)
- 🔔 **Unread Badge** - See notification count when new messages arrive
- 🎨 **Color-coded Users** - Messages display with user's assigned color

### Global Undo/Redo (Key Feature)
- ↩️ **Global Undo** - Any user can undo the **last action on canvas** (regardless of who drew it)
- ↪️ **Global Redo** - Restore the last undone action
- 🗑️ **Clear Canvas** - Start fresh with a clean canvas (with confirmation modal)
- 💾 **Save Canvas** - Persist canvas state to server + download as PNG

### UI/UX Features
- 🌙 **Dark/Light Theme** - Toggle between themes with persistence
- 📱 **Mobile Responsive** - Full touch support and mobile-optimized toolbar
- ⚡ **FPS Counter** - Real-time performance monitoring
- 📶 **Latency Display** - See connection quality in ms

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | Component-based UI with hooks |
| **TypeScript** | Type-safe development |
| **Vite** | Fast build tool and dev server |
| **Socket.IO Client** | Real-time WebSocket communication |
| **HTML Canvas API** | Raw canvas drawing (no libraries) |
| **Lucide React** | Professional icon library |
| **React Hot Toast** | Toast notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express** | Web framework |
| **Socket.IO** | Real-time bidirectional events |
| **TypeScript** | Type-safe server code |
| **File System** | Canvas persistence to JSON |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Running

```bash
# 1. Clone the repository
git clone https://github.com/anjim999/CanvasSync.git
cd canvas-sync

# 2. Install server dependencies
cd server && npm install

# 3. Start the backend (Terminal 1)
npm run dev
# Server runs on http://localhost:3001

# 4. Install client dependencies (new terminal)
cd ../client && npm install

# 5. Start the frontend (Terminal 2)
npm run dev
# Client runs on http://localhost:5173
```

### One-Command Start (after dependencies installed)
```bash
# Terminal 1: Start server
cd server && npm run dev

# Terminal 2: Start client
cd client && npm run dev
```

---

## 📁 Project Structure

```
canvas-sync/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Canvas.tsx           # Main drawing canvas with touch support
│   │   │   ├── Toolbar.tsx          # Drawing tools (Lucide icons)
│   │   │   ├── UserPanel.tsx        # Users & rooms panel
│   │   │   ├── JoinModal.tsx        # Room join screen
│   │   │   ├── ConfirmationModal.tsx # Clear canvas confirmation
│   │   │   └── chat/                # Chat feature module
│   │   │       ├── ChatPanel.tsx    # Chat messages UI
│   │   │       ├── ChatToggle.tsx   # FAB button with unread badge
│   │   │       └── index.ts         # Clean exports
│   │   ├── hooks/
│   │   │   ├── useSocket.ts         # Socket.IO connection management
│   │   │   ├── useDraw.ts           # Drawing logic (shapes, fill, etc.)
│   │   │   └── useChat.ts           # Chat message handling
│   │   ├── config/
│   │   │   └── env.ts               # Environment configuration
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript interfaces (Drawing, Chat)
│   │   ├── App.tsx                  # Main app with responsive layout
│   │   ├── App.css                  # Global animations
│   │   └── main.tsx                 # React entry point
│   ├── index.html
│   └── package.json
│
├── server/                          # Node.js backend
│   ├── src/
│   │   ├── server.ts                # Express + Socket.IO setup
│   │   ├── socket-handlers.ts       # WebSocket event handlers
│   │   ├── state-manager.ts         # Canvas state, undo/redo, chat history
│   │   └── types.ts                 # Shared TypeScript types
│   ├── data/                        # Saved canvas JSON files
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml                   # GitHub Actions CI/CD
│
├── ARCHITECTURE.md                  # System design documentation
└── README.md                        # This file
```

---

## 🔧 Available Scripts

### Client
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Build for production (TypeScript check + Vite) |
| `npm run preview` | Preview production build locally |

### Server
| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with nodemon (auto-restart) |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run compiled production server |

---

## 📡 WebSocket Protocol

### Drawing Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `join_room` | Client → Server | Join a collaborative room |
| `leave_room` | Client → Server | Leave current room |
| `draw_action` | Bidirectional | Send/receive drawing actions |
| `cursor_move` | Client → Server | Share cursor position |
| `cursor_update` | Server → Client | Broadcast cursor positions |
| `undo` | Client → Server | Request global undo |
| `undo_applied` | Server → Client | Notify all users of undo |
| `redo` | Client → Server | Request global redo |
| `redo_applied` | Server → Client | Notify all users of redo |
| `canvas_state` | Server → Client | Full canvas sync on join |
| `clear_canvas` | Bidirectional | Clear all drawings |
| `save_canvas` | Client → Server | Persist to server |

### Chat Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `send_chat` | Client → Server | Send a chat message |
| `chat_message` | Server → Client | Broadcast message to room |
| `chat_history` | Server → Client | Send last 100 messages on join |

---

## 🎯 Key Technical Decisions

1. **Socket.IO over raw WebSockets**
   - Automatic reconnection with exponential backoff
   - Built-in room support for isolation
   - Fallback to HTTP long-polling if WebSocket fails

2. **Raw Canvas API (no Fabric.js/Konva)**
   - Full control over rendering performance
   - Demonstrates deep Canvas understanding
   - Direct 2D context manipulation

3. **Server-side State (Single Source of Truth)**
   - Prevents state drift between clients
   - Authoritative undo/redo
   - Easy persistence to disk

4. **Global Undo/Redo (Assignment Requirement)**
   - Any user can undo the last action (from any user)
   - Redo stack cleared when new action is added
   - Server controls history, clients receive notifications

5. **Modular Frontend Architecture**
   - Custom hooks for logic separation (`useSocket`, `useDraw`, `useChat`)
   - Feature-based component organization (`chat/`)
   - Shared types between client and server

6. **Professional UI with Lucide Icons**
   - Replaced emoji icons with SVG-based Lucide React icons
   - Consistent visual language
   - Dark/Light theme support

---

## 🌐 Deployment

### Backend → Render
1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Deploy!

### Frontend → Vercel
1. Import project on [Vercel](https://vercel.com)
2. Settings:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
3. Add environment variable:
   ```
   VITE_SERVER_URL=https://your-render-app.onrender.com
   ```
4. Deploy!

---

## ⚠️ Known Limitations

| Issue | Description | Workaround |
|-------|-------------|------------|
| **Cold Start Delay** | Backend on free Render tier sleeps after inactivity | Wait 30-60 seconds for first request |
| **No Authentication** | Users identified by socket ID only | Intended for demo purposes |
| **Chat Not Persisted** | Messages stored in memory only | Add database for production use |
| **Large Canvas Performance** | Many actions (1000+) may slow rendering | Clear canvas periodically |

---

## 📄 License

MIT License - feel free to use this project for learning or building your own collaborative tools!

---

<p align="center">
  Made with ❤️ using React, Node.js, and Socket.IO
</p>