# DocMind - AI Document Q&A (RAG) Frontend

DocMind is a modern, responsive, full-featured RAG (Retrieval-Augmented Generation) document intelligence frontend built with Vite, React (JSX), Tailwind CSS v4, and Lucide icons.

---

## 🚀 How to Run Locally

1. **Install Dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Ensure `.env` in the root directory contains:
   ```env
   VITE_API_URL=http://localhost:8081/api/v1
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173` (or the port assigned by Vite).

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🗺️ Routes & Pages

- `/login` - Split-screen authentication page for existing users with form validation and error handling.
- `/register` - Split-screen account registration page with instant client-side validation.
- `/` - **Dashboard (Main Application)** (Protected):
  - Left collapsible/slide-over sidebar featuring multi-file Drag & Drop upload (`PDF`, `DOCX`, `TXT`, `MD`, `CSV` up to 25 MB), scope filter ("All Documents" vs specific document), user profile, role badge, theme toggle, and sign out.
  - Interactive chat window with Markdown formatting (`react-markdown` + `remark-gfm`), code syntax blocks with copy button, response time metrics, and collapsible source citations.
- `/search` - **Vector Similarity Search Page** (Protected):
  - Allows standalone query testing across all documents or a target document with adjustable Top-K and minimum similarity threshold sliders.

---

## 💡 Key Design Assumptions & Backend Behavior Notes

1. **Streaming & Citations Paradox**:
   - The backend `/chat/stream` endpoint streams plain text (`Flux<String>`) and does NOT return source citations.
   - When **Stream responses** mode is toggled ON (default), `useChat` fires `/chat/stream` and `/chat/search/similarity` in parallel, stitching the returned similarity matches as source citation cards underneath the streaming answer once retrieved.
   - When **Stream responses** mode is OFF, `useChat` uses `/chat/query`, which directly provides answer text, citations, and response timing.

2. **Client-Side Conversation Memory**:
   - The backend has no server-side conversation memory. Chat histories are saved locally in `localStorage` keyed by logged-in user ID and active document scope (`doc_<id>` vs `all`).

3. **Authentication & Token Handling**:
   - JWT tokens last 1 hour without refresh token support.
   - The client parses token expiration (`exp`) on app load and periodically checks token validity. Expired tokens or HTTP `401`/`403` responses automatically trigger a clean session logout and redirect to `/login`.
   - Failed logins return HTTP `400` with wrapper `{ success: false, message: "An unexpected error occurred: Bad credentials" }`. Registering a duplicate username returns HTTP `400` with message `"Username already exists"`. The frontend transforms these into clean, user-friendly messages.

4. **Synchronous Document Processing**:
   - File uploads are synchronous on the backend (parsing + vector embedding generation blocks until finished). Uploads feature real-time progress indicators via `axios` `onUploadProgress` followed by an indeterminate processing state.
