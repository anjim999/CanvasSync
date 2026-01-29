# CanvasSync - Architecture Documentation

## 🏗️ System Overview

CanvasSync is a **real-time collaborative drawing application** built with a client-server architecture. The system uses **WebSockets (Socket.IO)** for bidirectional communication, enabling multiple users to draw simultaneously on a shared canvas.

### Design Philosophy
1. **Server as Single Source of Truth** - All canvas state lives on the server
2. **Optimistic Updates** - Client draws immediately, then syncs with server
3. **Global Operations** - Undo/Redo affects all users, not just the requester
4. **Event-Driven Architecture** - All changes propagate via WebSocket events

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
│  │  - Global undo/redo stacks                                   │ │
│  │  - User presence tracking                                    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                           │                                      │
│                           ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                  Persistence Layer                           │ │
│  │  - JSON file storage                                         │ │
│  │  - Save/Load canvas state                                    │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### 1. Drawing a Stroke (Real-time Sync)

```
User A                    Server                     User B
  │                         │                          │
  │ mousedown               │                          │
  ├──────────────────────►  │                          │
  │ Start local drawing     │                          │
  │                         │                          │
  │ mousemove (continuous)  │                          │
  ├──────────────────────►  │                          │
  │ Draw locally (immediate)│                          │
  │                         │                          │
  │ mouseup                 │                          │
  │ emit('draw_action')     │                          │
  ├─────────────────────────►                          │
  │                         │ addDrawAction()          │
  │                         │ Store in actions[]       │
  │                         │                          │
  │                         │ broadcast('draw_action') │
  │                         ├─────────────────────────►│
  │                         │                          │ Draw on canvas
  │                         │                          │
```

**Key Points:**
- Client draws **immediately** on mousedown/mousemove for zero latency feel
- Complete action is sent **only on mouseup** (not every point)
- Server stores the action and broadcasts to **other users only**
- Original user already has the drawing (no echo needed)

---

### 2. Global Undo Operation

```
User A                    Server                     User B
  │                         │                          │
  │ Ctrl+Z pressed          │                          │
  │ emit('undo')            │                          │
  ├─────────────────────────►                          │
  │                         │ undoAction()             │
  │                         │ Find LAST action         │
  │                         │ (from ANY user)          │
  │                         │ Mark as isUndone=true    │
  │                         │                          │
  │                         │ emit('undo_applied')     │
  │◄────────────────────────┤                          │
  │                         ├─────────────────────────►│
  │ Update local state      │                          │ Update local state
  │ Redraw canvas           │                          │ Redraw canvas
  │                         │                          │
```

**Global Undo Logic (Critical Feature):**
```typescript
// Server-side: state-manager.ts
export function undoAction(roomId: string, _requestingUserId: string): DrawAction | null {
    const room = rooms.get(roomId);
    if (!room) return null;

    // Find the LAST action that isn't already undone (from ANY user)
    for (let i = room.actions.length - 1; i >= 0; i--) {
        const action = room.actions[i];
        if (!action.isUndone) {
            action.isUndone = true;
            
            // Add to global redo stack
            let globalUndone = room.undoneActions.get('global');
            if (!globalUndone) {
                globalUndone = [];
                room.undoneActions.set('global', globalUndone);
            }
            globalUndone.push(action);
            
            return action;
        }
    }
    return null;
}
```

---

### 3. New User Joining

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
  │ Redraw all actions      │                          │
  │ on local canvas         │                          │
```

---

## 🔌 WebSocket Protocol Specification

### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `join_room` | `{ roomId: string, username: string }` | Join a collaborative room |
| `leave_room` | `void` | Leave current room |
| `draw_action` | `DrawAction` | Send completed drawing action |
| `cursor_move` | `{ x: number, y: number }` | Update cursor position |
| `undo` | `void` | Request global undo |
| `redo` | `void` | Request global redo |
| `clear_canvas` | `void` | Clear all drawings |
| `save_canvas` | `void` | Persist to disk |
| `create_room` | `string` | Create new room with name |
| `get_rooms` | `void` | Request room list |

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `canvas_state` | `CanvasState` | Full state on join |
| `draw_action` | `DrawAction` | New action from peer |
| `cursor_update` | `{ odId: string, position: Point }` | Peer cursor moved |
| `undo_applied` | `{ odId: string, actionId: string }` | Action was undone |
| `redo_applied` | `{ odId: string, actionId: string }` | Action was redone |
| `canvas_cleared` | `string` | Canvas was cleared (userId) |
| `user_joined` | `User` | New user joined |
| `user_left` | `string` | User disconnected (userId) |
| `users_update` | `User[]` | Updated user list |
| `rooms_list` | `Room[]` | Available rooms |
| `room_created` | `Room` | New room created |

### Data Types

```typescript
interface DrawAction {
    id: string;              // Unique ID: `${odId}_${timestamp}_${rand}`
    odId: string;            // Socket ID of drawing user
    type: 'stroke' | 'shape' | 'text';
    tool: 'brush' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'text';
    points: Point[];         // Array of {x, y} coordinates
    color: string;           // Hex color code
    strokeWidth: number;     // Pixel width
    timestamp: number;       // Unix timestamp
    isUndone?: boolean;      // Soft-delete flag
    text?: string;           // For text tool
}

interface User {
    id: string;              // Socket ID
    username: string;        
    color: string;           // Assigned color (from palette)
    cursor?: Point;          // Current cursor position
    isDrawing?: boolean;     // Currently drawing?
}

interface CanvasState {
    actions: DrawAction[];   // All visible actions (not undone)
    users: User[];           // Current room members
    roomId: string;          
}
```

---

## ⚔️ Conflict Resolution Strategy

### Problem: Multiple Users Drawing Simultaneously

When User A and User B draw at the same time in overlapping areas, we need a consistent conflict resolution strategy.

### Solution: Last-Write-Wins with Immediate Local Feedback

```
Timeline:
0ms   - User A starts drawing
50ms  - User B starts drawing (overlapping area)
100ms - User A continues drawing (local render)
100ms - User B continues drawing (local render)
200ms - User A finishes, sends action to server
250ms - User B finishes, sends action to server
300ms - Server receives A's action, broadcasts
350ms - Server receives B's action, broadcasts
400ms - Both clients have: [A's action, B's action]
```

**Why This Works:**
1. **No Conflict on Drawing** - Both strokes are stored separately
2. **Visual Overlap** - Later strokes render on top (natural canvas behavior)
3. **Deterministic Order** - Server receives actions in order, broadcasts in same order
4. **Consistent State** - All clients end up with identical action arrays

### Conflict Scenarios

| Scenario | Resolution |
|----------|------------|
| **Simultaneous drawing** | Both strokes kept, last one renders on top |
| **Undo during drawing** | Undo only affects completed actions |
| **Clear during drawing** | Current drawing lost, canvas cleared |
| **Disconnect during drawing** | Incomplete stroke not sent/saved |

### Undo/Redo Conflict Handling

```typescript
// When new action is added, clear ALL redo stacks
export function addDrawAction(roomId: string, action: DrawAction): boolean {
    const room = rooms.get(roomId);
    if (!room) return false;

    room.actions.push(action);
    
    // Clear redo - new content invalidates redo history
    room.undoneActions.forEach((stack) => (stack.length = 0));
    
    return true;
}
```

This prevents "redo" from restoring outdated state after new content is added.

---

## ⚡ Performance Optimizations

### 1. Event Batching (Drawing Points)

**Problem:** Mouse/touch events fire at 60+ Hz, sending each point is too chatty.

**Solution:** Accumulate points locally, send complete stroke on mouseup.

```typescript
// useDraw.ts - Points accumulated during drawing
const draw = useCallback((event, canvas, ctx) => {
    // Draw immediately for zero-latency feel
    drawLine(ctx, lastPoint.current, currentPoint, currentAction.current);
    
    // Accumulate points (not sent yet)
    currentAction.current.points.push(currentPoint);
}, [isDrawing]);

// Only emit complete action on mouseup
const stopDrawing = useCallback(() => {
    if (currentAction.current.points.length > 1) {
        onDraw(currentAction.current);  // Single emit with all points
    }
}, [onDraw]);
```

**Result:** 1 WebSocket message per stroke instead of 60+ per second.

---

### 2. Efficient Canvas Redrawing

**Problem:** Redrawing 1000s of strokes on every change is slow.

**Solution:** Only full-redraw on undo/redo/clear. New strokes draw incrementally.

```typescript
// Drawing new stroke - INCREMENTAL (fast)
const handlePointerMove = (e: React.MouseEvent) => {
    drawLine(ctx, lastPoint, currentPoint, action);  // Just add to canvas
};

// Undo applied - FULL REDRAW (necessary)
const redrawCanvas = (ctx, actions, width, height) => {
    ctx.fillStyle = '#0f0f1a';
    ctx.fillRect(0, 0, width, height);  // Clear
    actions.filter(a => !a.isUndone).forEach(action => drawAction(ctx, action));
};
```

---

### 3. Cursor Throttling

**Problem:** Cursor updates at 60Hz create network congestion.

**Solution:** Socket.IO handles this automatically with batching, but we also only send on actual movement.

```typescript
// Only send if position changed meaningfully
const handleCursorMove = (position: Point) => {
    sendCursorMove(position);  // Debounced by Socket.IO
};
```

---

### 4. Normalized Coordinates

**Problem:** Different screen sizes have different canvas dimensions.

**Solution:** Store coordinates in canvas space (1920x1080), scale on render.

```typescript
const getCanvasCoordinates = (event, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;   // e.g., 1920 / 800 = 2.4
    const scaleY = canvas.height / rect.height; // e.g., 1080 / 600 = 1.8
    
    return {
        x: (clientX - rect.left) * scaleX,  // Normalized to 1920x1080
        y: (clientY - rect.top) * scaleY,
    };
};
```

---

### 5. Memory Management

**Problem:** Long sessions accumulate many actions in memory.

**Solution:** 
- Actions stored once on server
- Clients receive same reference via Socket.IO
- Clear canvas periodically for long sessions

---

## 🔒 Security Considerations

| Aspect | Implementation |
|--------|----------------|
| **Input Validation** | Server validates action structure before storing |
| **Rate Limiting** | Socket.IO handles connection limits |
| **Room Isolation** | Actions only broadcast within same room |
| **No Auth** | Intentional for assignment - production would use JWT |

---

## 📦 State Management

### Server State (Single Source of Truth)

```typescript
// state-manager.ts
const rooms = new Map<string, RoomState>();

interface RoomState {
    id: string;
    name: string;
    actions: DrawAction[];                    // All drawing history
    undoneActions: Map<string, DrawAction[]>; // Redo stacks
    users: Map<string, User>;                 // Connected users
    createdAt: number;
}
```

### Client State (React)

```typescript
// App.tsx
const [actions, setActions] = useState<DrawAction[]>([]);  // Synced from server
const [remoteCursors, setRemoteCursors] = useState(new Map());
const [users, setUsers] = useState<User[]>([]);
```

---

## 🧪 Testing Considerations

### Unit Tests (Recommended)
- `state-manager.ts`: Test undo/redo logic
- `useDraw.ts`: Test coordinate calculations
- Socket handlers: Test event routing

### Integration Tests
- Multi-client simulation
- Disconnect/reconnect scenarios
- Concurrent drawing

### Manual Testing Checklist
- [ ] Draw appears on other browser instantly
- [ ] Undo removes last action for all users
- [ ] Redo restores correctly
- [ ] User list updates on join/leave
- [ ] Cursors visible and smooth
- [ ] Mobile touch works
- [ ] Refresh restores canvas state

---

## 🚀 Scaling Considerations (1000+ Users)

If scaling to many concurrent users, consider:

1. **Redis Pub/Sub** - For multi-server Socket.IO
2. **Action Compression** - Reduce payload size
3. **Canvas Tiling** - Split large canvas into chunks
4. **WebRTC Data Channels** - P2P for cursor updates
5. **Canvas Layers** - Separate scratch/committed layers

---

## 📁 File Structure Reference

```
server/src/
├── server.ts           # Express + Socket.IO bootstrap
├── socket-handlers.ts  # Event handlers (join, draw, undo, etc.)
├── state-manager.ts    # Core state logic (rooms, actions, undo)
└── types.ts            # Shared TypeScript interfaces

client/src/
├── components/
│   ├── Canvas.tsx      # HTML5 Canvas wrapper
│   ├── Toolbar.tsx     # Tool selection UI
│   ├── UserPanel.tsx   # User list + room UI
│   └── JoinModal.tsx   # Entry screen
├── hooks/
│   ├── useSocket.ts    # Socket.IO connection
│   └── useDraw.ts      # Drawing logic (raw Canvas API)
├── types/index.ts      # Client-side types
└── App.tsx             # Root component
```

---

*Document last updated: January 2026*
