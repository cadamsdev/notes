import NoteView from "./components/NoteView";
import NotesView from "./components/NotesView";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <div className="flex h-full">
      <Sidebar />

      <NotesView />

      <div className="flex-grow p-4">
        <NoteView />
      </div>
    </div>
  )
}

