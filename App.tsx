import React, {
  useState,
  useEffect,
  createContext,
  useMemo,
  useContext,
} from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import DocPage from "./pages/DocPage";
import BlogListPage from "./pages/BlogListPage";
import BlogPostPage from "./pages/BlogPostPage";
import { RepoContext } from "./context/RepoContext";
import SettingsModal from "./components/modals/SettingsModal";

export const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { owner, repo } = useContext(RepoContext);

  useEffect(() => {
    const isDark =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        localStorage.theme = "dark";
        document.documentElement.classList.add("dark");
      } else {
        localStorage.theme = "light";
        document.documentElement.classList.remove("dark");
      }
      return newMode;
    });
  };

  const themeValue = useMemo(
    () => ({ isDarkMode, toggleDarkMode }),
    [isDarkMode]
  );

  const isRepoSet = owner && repo;

  return (
    <ThemeContext.Provider value={themeValue}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />

            {isRepoSet ? (
              <>
                <Route
                  path="/docs"
                  element={<Navigate to="/docs/README.md" replace />}
                />
                <Route path="/docs/*" element={<DocPage />} />
                <Route path="/blog" element={<BlogListPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
              </>
            ) : (
              <>
                <Route path="/docs/*" element={<Navigate to="/" replace />} />
                <Route path="/blog/*" element={<Navigate to="/" replace />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <SettingsModal />
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
