# CanvasSync - Architecture Documentation

## 🏗️ System Overview

CanvasSync is a **real-time collaborative drawing application** built with a client-server architecture. The system uses **WebSockets (Socket.IO)** for bidirectional communication, enabling multiple users to draw simultaneously on a shared canvas with live cursors, team chat, and global undo/redo.

### Design Philosophy
1. **Server as Single Source of Truth** - All canvas and chat state lives on the server
2. **Optimistic Updates** - Client draws immediately, then syncs with server
3. **Global Operations** - Undo/Redo affects all users, not just the requester
4. **Event-Driven Architecture** - All changes propagate via WebSocket events
5. **Modular Design** - Separation of concerns (hooks, components, services)

---

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Browser 1  │  │  Browser 2  │  │  Browser N  │             │
│  │  (React)    │  │  (React)    │  │  (React)    │             │
│  │             │  │             │  │             │             │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │             │
│  │ │ Canvas  │ │  │ │ Canvas  │ │  │ │ Canvas  │ │             │
│  │ │ (HTML5) │ │  │ │ (HTML5) │ │  │ │ (HTML5) │ │             │
│  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │             │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │             │
│  │ │  Chat   │ │  │ │  Chat   │ │  │ │  Chat   │ │             │
│  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                     │
│         └────────────────┼────────────────┘                     │
│                          │                                      │
│                   Socket.IO Connections                         │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                     SERVER (Node.js)                             │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Socket.IO Server                          │ │
│  │  - Connection management                                     │ │
│  │  - Event routing                                             │ │
│  │  - Room isolation                                            │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                           │                                      │
│                           ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                  State Manager                               │ │
│  │  - Room management                                           │ │
│  │  - Drawing actions array                                     │ │
│  │  - Chat history (last 100 messages/room)                     │ │
│  │  - Global undo/redo stacks                                   │ │
│  │  - User presence tracking                                    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                           │                                      │
│                           ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                  Persistence Layer                           │ │
│  │  - JSON file storage for canvas                              │ │
│  │  - In-memory chat (per session)                              │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
canvas-sync/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Canvas.tsx           # Main drawing canvas (touch support)
│   │   │   ├── Toolbar.tsx          # Drawing tools (Lucide icons)
│   │   │   ├── UserPanel.tsx        # Users & rooms sidebar
│   │   │   ├── JoinModal.tsx        # Room join screen
│   │   │   ├── ConfirmationModal.tsx # Clear confirmation
│   │   │   └── chat/                # Chat feature module
│   │   │       ├── ChatPanel.tsx    # Chat messages UI
│   │   │       ├── ChatToggle.tsx   # FAB with unread badge
│   │   │       └── index.ts         # Clean exports
│   │   ├── hooks/
│   │   │   ├── useSocket.ts         # Socket.IO connection
│   │   │   ├── useDraw.ts           # Drawing logic (shapes, fill)
│   │   │   └── useChat.ts           # Chat message handling
│   │   ├── config/
│   │   │   └── env.ts               # Environment config
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript interfaces
│   │   ├── App.tsx                  # Main app component
│   │   └── App.css                  # Global styles
│   └── package.json
│
├── server/                          # Node.js backend
│   ├── src/
│   │   ├── server.ts                # Express + Socket.IO setup
│   │   ├── socket-handlers.ts       # WebSocket event handlers
│   │   ├── state-manager.ts         # State management + chat
│   │   └── types.ts                 # Shared TypeScript types
│   ├── data/                        # Saved canvas JSON files
│   └── package.json
│
├── ARCHITECTURE.md                  # This file
└── README.md                        # Project documentation
```

---

## 🔧 Core Data Types

### DrawAction (Drawing Elements)

```typescript
interface DrawAction {
    id: string;                    // Unique ID: `${odId}_${timestamp}_${rand}`
    odId: string;                  // Socket ID of drawing user
    type: 'stroke' | 'shape' | 'text';
    tool: Tool;                    // brush, eraser, line, arrow, rectangle, circle, triangle, diamond, text
    points: Point[];               // For strokes: path, for shapes: [start, end]
    color: string;                 // Hex color code
    strokeWidth: number;           // Pixel width
    isFilled?: boolean;            // For shapes: filled or outline only
    timestamp: number;             // Unix timestamp
    isUndone?: boolean;            // Soft-delete for undo
    text?: string;                 // For text tool
}

type Tool = 
  | 'brush' 
  | 'eraser' 
  | 'line' 
  | 'arrow' 
  | 'rectangle' 
  | 'circle' 
  | 'triangle' 
  | 'diamond' 
  | 'text';
```

### ChatMessage (Team Chat)

```typescript
interface ChatMessage {
    id: string;          // Unique message ID
    userId: string;      // Socket ID of sender
    username: string;    // Display name
    text: string;        // Message content
    timestamp: number;   // Unix timestamp
    color: string;       // User's assigned color
    isSystem?: boolean;  // System message (join/leave)
}
```

### User & Room

```typescript
interface User {
    id: string;              // Socket ID
    username: string;        
    color: string;           // Assigned color (from palette)
    cursor?: Point;          // Current cursor position
    isDrawing?: boolean;     // Currently drawing?
}

interface Room {
    id: string;
    name: string;
    userCount: number;
    createdAt: number;
}
```

### RoomState (Server-side)

```typescript
interface RoomState {
    id: string;
    name: string;
    actions: DrawAction[];                    // All drawing history
    undoneActions: Map<string, DrawAction[]>; // Redo stacks
    users: Map<string, User>;                 // Connected users
    chatHistory: ChatMessage[];               // Last 100 messages
    createdAt: number;
}
```

---

## 🔄 Data Flow Diagrams

### 1. Drawing a Shape (with Fill)

```
User A                    Server                     User B
  │                         │                          │
  │ mousedown               │                          │
  │ Set start point         │                          │
  │                         │                          │
  │ mousemove               │                          │
  │ Show preview locally    │                          │
  │                         │                          │
  │ mouseup                 │                          │
  │ Create DrawAction:      │                          │
  │ { tool: 'rectangle',    │                          │
  │   isFilled: true,       │                          │
  │   points: [start, end] }│                          │
  │ emit('draw_action')     │                          │
  ├─────────────────────────►                          │
  │                         │ addDrawAction()          │
  │                         │ Store in actions[]       │
  │                         │                          │
  │                         │ broadcast('draw_action') │
  │                         ├─────────────────────────►│
  │                         │                          │ Draw on canvas
  │                         │                          │ (filled rectangle)
```

### 2. Chat Message Flow

```
User A                    Server                     All Users in Room
  │                         │                          │
  │ Type message            │                          │
  │ Click send              │                          │
  │ emit('send_chat')       │                          │
  ├─────────────────────────►                          │
  │                         │ addChatMessage()         │
  │                         │ Store in chatHistory[]   │
  │                         │ (keep last 100)          │
  │                         │                          │
  │                         │ emit('chat_message')     │
  │◄────────────────────────┤                          │
  │                         ├─────────────────────────►│
  │ Add to local messages   │                          │ Add to local messages
  │ Scroll to bottom        │                          │ Show unread badge
```

### 3. New User Joining (Canvas + Chat)

```
New User                  Server                     Existing Users
  │                         │                          │
  │ emit('join_room')       │                          │
  ├─────────────────────────►                          │
  │                         │ joinRoom()               │
  │                         │ Assign color             │
  │                         │ Add to room.users        │
  │                         │                          │
  │                         │ emit('user_joined')      │
  │                         ├─────────────────────────►│
  │                         │                          │
  │ emit('canvas_state')    │                          │
  │◄────────────────────────┤                          │
  │ {actions: [...]}        │                          │
  │                         │                          │
  │ emit('chat_history')    │                          │
  │◄────────────────────────┤                          │
  │ [last 100 messages]     │                          │
  │                         │                          │
  │ Redraw canvas           │                          │
  │ Load chat history       │                          │
```

---

## 🔌 WebSocket Protocol

### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `join_room` | `{ roomId: string, username: string }` | Join room |
| `leave_room` | `void` | Leave current room |
| `draw_action` | `DrawAction` | Send drawing action |
| `cursor_move` | `Point` | Update cursor position |
| `undo` | `void` | Request global undo |
| `redo` | `void` | Request global redo |
| `clear_canvas` | `void` | Clear all drawings |
| `save_canvas` | `void` | Persist to disk |
| `create_room` | `string` | Create new room |
| `get_rooms` | `void` | Request room list |
| `send_chat` | `{ roomId: string, message: ChatMessage }` | Send chat message |

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `canvas_state` | `CanvasState` | Full state on join |
| `draw_action` | `DrawAction` | New action from peer |
| `cursor_update` | `{ odId: string, position: Point }` | Peer cursor moved |
| `undo_applied` | `{ odId: string, actionId: string }` | Action was undone |
| `redo_applied` | `{ odId: string, actionId: string }` | Action was redone |
| `canvas_cleared` | `string` | Canvas was cleared |
| `user_joined` | `User` | New user joined |
| `user_left` | `string` | User disconnected |
| `users_update` | `User[]` | Updated user list |
| `rooms_list` | `Room[]` | Available rooms |
| `room_created` | `Room` | New room created |
| `chat_message` | `ChatMessage` | New chat message |
| `chat_history` | `ChatMessage[]` | Chat history on join |

---

## 🎨 Drawing System Architecture

### Shape Rendering (useDraw.ts)

The drawing system supports multiple tools with optional fill:

```typescript
// Shape tools with fill support
const shapesWithFill = ['rectangle', 'circle', 'triangle', 'diamond'];

function drawShape(ctx: CanvasRenderingContext2D, action: DrawAction) {
    const [start, end] = action.points;
    
    ctx.strokeStyle = action.color;
    ctx.fillStyle = action.color;
    ctx.lineWidth = action.strokeWidth;
    
    switch (action.tool) {
        case 'rectangle':
            if (action.isFilled) {
                ctx.fillRect(start.x, start.y, end.x - start.x, end.y - start.y);
            }
            ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
            break;
            
        case 'triangle':
            drawTriangle(ctx, start, end, action.isFilled);
            break;
            
        case 'diamond':
            drawDiamond(ctx, start, end, action.isFilled);
            break;
            
        case 'arrow':
            drawArrowWithHead(ctx, start, end);
            break;
    }
}
```

### Hook Separation

| Hook | Responsibility |
|------|----------------|
| `useSocket` | WebSocket connection, room management, event routing |
| `useDraw` | Canvas drawing logic, shape rendering, coordinates |
| `useChat` | Chat messages, unread count, send/receive |

---

## 📦 State Management

### Server State (Single Source of Truth)

```typescript
// state-manager.ts
const rooms = new Map<string, RoomState>();
const MAX_CHAT_HISTORY = 100;

interface RoomState {
    id: string;
    name: string;
    actions: DrawAction[];
    undoneActions: Map<string, DrawAction[]>;
    users: Map<string, User>;
    chatHistory: ChatMessage[];      // NEW: Chat messages
    createdAt: number;
}
```

### Client State (React)

```typescript
// App.tsx - Main state
const [actions, setActions] = useState<DrawAction[]>([]);      // Canvas
const [remoteCursors, setRemoteCursors] = useState(new Map()); // Cursors
const [users, setUsers] = useState<User[]>([]);                // Users
const [isFilled, setIsFilled] = useState(false);               // Fill toggle

// useChat hook - Chat state
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [isOpen, setIsOpen] = useState(false);
const [unreadCount, setUnreadCount] = useState(0);
```

---

## ⚡ Performance Optimizations

### 1. Cursor Throttling
```typescript
// Throttle cursor updates to 50ms (20fps)
const lastCursorUpdateRef = useRef<number>(0);
const sendCursorMove = useCallback((position: Point) => {
    const now = Date.now();
    if (now - lastCursorUpdateRef.current > 50) {
        socket.emit('cursor_move', position);
        lastCursorUpdateRef.current = now;
    }
}, []);
```

### 2. Chat History Limit
```typescript
// Keep only last 100 messages per room
if (room.chatHistory.length > MAX_CHAT_HISTORY) {
    room.chatHistory = room.chatHistory.slice(-MAX_CHAT_HISTORY);
}
```

### 3. Canvas Redraw Optimization
- Only redraw on action array change
- Filter out `isUndone` actions before render
- Use `requestAnimationFrame` for smooth rendering

---

## 🔐 Security Considerations

| Aspect | Implementation |
|--------|----------------|
| **Input Validation** | Server validates action/message structure |
| **Rate Limiting** | Socket.IO connection limits |
| **Room Isolation** | Actions/chat only broadcast within room |
| **XSS Prevention** | No HTML in chat messages (text only) |
| **No Auth** | Intentional for demo - production would use JWT |

---

## 🚀 Scaling Considerations

For 1000+ concurrent users:

1. **Redis Adapter** - For multi-server Socket.IO
2. **Action Compression** - Reduce payload size with gzip
3. **Canvas Tiling** - Split large canvas into chunks
4. **WebRTC Data Channels** - P2P for cursor updates
5. **Database for Chat** - PostgreSQL/MongoDB instead of memory
6. **CDN for Static Assets** - Offload client bundle

---

## 🧪 Testing Checklist

### Core Features
- [ ] Draw appears on other browser instantly
- [ ] Undo removes last action for ALL users
- [ ] Redo restores correctly
- [ ] Fill toggle works for shapes
- [ ] Arrow/Triangle/Diamond render correctly

### Chat Features
- [ ] Messages appear instantly for all users
- [ ] Chat history loads on join
- [ ] Unread badge shows when chat closed
- [ ] Messages persist across refresh (within session)

### Edge Cases
- [ ] User disconnects during drawing
- [ ] Rapid undo/redo spam
- [ ] Very long chat messages
- [ ] Mobile touch drawing

---

*Document last updated: January 2026*
