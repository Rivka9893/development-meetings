import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AboutPage } from "./pages/AboutPage";
import { AddMeetingPage } from "./pages/AddMeetingPage";
import { EditMeetingPage } from "./pages/EditMeetingPage";
import { HomePage } from "./pages/HomePage";
import { MeetingsPage } from "./pages/MeetingsPage";

function App() {
    return (
        <div className="app-shell">
            <div className="bg-orb bg-orb-a" />
            <div className="bg-orb bg-orb-b" />
            <div className="bg-orb bg-orb-c" />

            <Navbar />

            <main className="content-wrap">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/meetings" element={<MeetingsPage />} />
                    <Route path="/meetings/new" element={<AddMeetingPage />} />
                    <Route path="/meetings/:meetingId/edit" element={<EditMeetingPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
