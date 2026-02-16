import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Dashboard } from "./pages/Dashboard"
import { CreateApp } from "./pages/CreateApp"
import { ImportGit } from "./pages/ImportGit"
import { ProjectDevelopment } from "./pages/ProjectDevelopment"
import { Settings } from "./pages/Settings"
import { BlankPage } from "./pages/BlankPage"

function App() {
  return (
  <AuthProvider>
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreateApp /></ProtectedRoute>} />
          <Route path="/import" element={<ProtectedRoute><ImportGit /></ProtectedRoute>} />
          <Route path="/project/:id" element={<ProtectedRoute><ProjectDevelopment /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<BlankPage />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  </AuthProvider>
  )
}

export default App