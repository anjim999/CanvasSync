# 🎨 CanvasSync

> **Real-time collaborative drawing application** where multiple users can draw together on a shared canvas with live cursor tracking, global undo/redo support, and room-based collaboration.

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
| Tool | Description |
|------|-------------|
| 🖌️ **Brush** | Freehand drawing with customizable colors and stroke widths |
| 🧹 **Eraser** | Remove unwanted strokes |
| 📏 **Line** | Draw straight lines |
| ⬜ **Rectangle** | Create rectangle shapes |
| ⭕ **Circle** | Draw circles and ellipses |
| 📝 **Text** | Add text annotations |

### Real-time Collaboration
- 👥 **Live Cursors** - See other users' cursor positions in real-time with their username
- 🔄 **Instant Sync** - All drawing actions sync instantly across all connected users
- 🏠 **Room System** - Create or join different collaborative rooms
- 👤 **User Presence** - See who's online with unique color-coded indicators

### Global Undo/Redo (Key Feature)
- ↩️ **Global Undo** - Any user can undo the **last action on canvas** (regardless of who drew it)
- ↪️ **Global Redo** - Restore the last undone action
- 🗑️ **Clear Canvas** - Start fresh with a clean canvas
- 💾 **Save Canvas** - Persist canvas state to server + download as PNG

### Bonus Features Implemented
- 📱 **Mobile Touch Support** - Full drawing support on touch devices
- 🏠 **Multiple Rooms** - Isolated canvases for different groups
- 💾 **Drawing Persistence** - Save/load sessions from server
- ⚡ **Performance Metrics** - Real-time FPS counter and latency display
- 🎨 **Extra Tools** - Shapes (line, rectangle, circle) and text
- 📥 **Download PNG** - Export canvas as image file

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
git clone https://github.com/yourusername/canvas-sync.git
cd canvas-sync

# 2. Install server dependencies
cd server && npm install

# 3. Start the backend (Terminal 1)
npm start
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
cd server && npm start

# Terminal 2: Start client
cd client && npm run dev
```

---

## 🧪 Testing with Multiple Users

### Local Testing
1. Open **http://localhost:5173** in Chrome
2. Open **http://localhost:5173** in Firefox (or Chrome Incognito)
3. Join the same room (e.g., "Main Canvas")
4. Draw on one browser → See it appear on the other instantly!
5. Test **Global Undo**: Press Ctrl+Z on Browser A → See Browser B's drawing disappear (if it was the last action)

### Remote Testing
1. Share your computer's local IP (e.g., `http://192.168.1.x:5173`)
2. Other users on the same network can join
3. For internet-wide testing, deploy to Vercel/Render

### Key Scenarios to Test
| Scenario | Expected Behavior |
|----------|-------------------|
| User A draws, User B sees it | Immediate sync (<100ms) |
| User A presses Undo | Last action disappears for ALL users |
| Both users draw simultaneously | Both strokes appear (last-write-wins) |
| User A joins existing room | Receives full canvas state |
| User disconnects | Removed from user list, cursor disappears |

---

## 📁 Project Structure

```
canvas-sync/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Canvas.tsx      # Main drawing canvas with touch support
│   │   │   ├── Toolbar.tsx     # Drawing tools panel (responsive)
│   │   │   ├── UserPanel.tsx   # Users & rooms panel
│   │   │   └── JoinModal.tsx   # Room join screen
│   │   ├── hooks/
│   │   │   ├── useSocket.ts    # Socket.IO connection management
│   │   │   └── useDraw.ts      # Drawing logic (raw Canvas API)
│   │   ├── types/
│   │   │   └── index.ts        # TypeScript interfaces
│   │   ├── App.tsx             # Main app with responsive layout
│   │   └── index.css           # Global styles
│   ├── index.html
│   └── package.json
│
├── server/                     # Node.js backend
│   ├── src/
│   │   ├── server.ts           # Express + Socket.IO setup
│   │   ├── socket-handlers.ts  # WebSocket event handlers
│   │   ├── state-manager.ts    # Canvas state & global undo/redo logic
│   │   └── types.ts            # Shared TypeScript types
│   ├── data/                   # Saved canvas JSON files
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD
│
├── vercel.json                 # Vercel deployment config
├── ARCHITECTURE.md             # System design documentation
└── README.md                   # This file
```

---

## 🔧 Available Scripts

### Client
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

### Server
| Command | Description |
|---------|-------------|
| `npm start` | Start server with nodemon (auto-restart) |
| `npm run build` | Compile TypeScript to JavaScript |

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

## ⚠️ Known Limitations & Bugs

| Issue | Description | Workaround |
|-------|-------------|------------|
| **Cold Start Delay** | Backend on free Render tier sleeps after inactivity | Wait 30-60 seconds for first request |
| **No Authentication** | Users identified by socket ID only | Intended for demo purposes |
| **No Pressure Sensitivity** | Stroke width is constant | Could be added with Pointer Events API |
| **Large Canvas Performance** | Many actions (1000+) may slow rendering | Clear canvas periodically |
| **Text Tool UX** | Text input via prompt() | Could use inline text editor |

---

## ⏱️ Time Spent on Project

| Phase | Duration | Activities |
|-------|----------|------------|
| **Planning & Research** | 2 hours | Understanding requirements, Socket.IO docs, Canvas API |
| **Backend Development** | 4 hours | Express setup, Socket.IO handlers, state management |
| **Frontend Core** | 6 hours | Canvas drawing, React components, responsive design |
| **Real-time Features** | 4 hours | Live sync, cursors, global undo/redo |
| **Mobile Support** | 2 hours | Touch events, responsive layout |
| **Testing & Debugging** | 3 hours | Multi-user testing, edge cases |
| **Documentation** | 2 hours | README, ARCHITECTURE.md |
| **Deployment Setup** | 1 hour | Vercel, Render, CI/CD |
| **TOTAL** | **~24 hours** | Over 3-4 days |

---

## 📡 WebSocket Protocol

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

5. **TypeScript Everywhere**
   - Shared types between client and server
   - Compile-time error catching
   - Better IDE support and documentation

---

## 📄 License

MIT License - feel free to use this project for learning or building your own collaborative tools!

---

<p align="center">
  Made with ❤️ using React, Node.js, and Socket.IO
</p>