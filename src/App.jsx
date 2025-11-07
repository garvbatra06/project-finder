import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./Authentication/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import PrivateRoute from "./Authentication/PrivateRoute";
import SignUp from "./Authentication/SignUp";
import Login from "./Authentication/Login";
import CompleteProfile from "./Authentication/complete-profile";
import Dashboard from "./Components/Dashboard";
import PostProject from "./Components/PostProject";
import FindProjects from "./Components/FindProjects";
import { db } from "./Authentication/firebase";
import "./App.css";

const defaultAvatar = "https://www.w3schools.com/howto/img_avatar.png";

function App() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userProjects, setUserProjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [canAccessProjects, setCanAccessProjects] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Track auth state and profile completion
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists() && userDoc.data().profileCompleted) {
          setCanAccessProjects(true);
        } else {
          setCanAccessProjects(false);
        }
      } else {
        setCanAccessProjects(false);
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fetch projects posted by user
  const fetchUserProjects = async () => {
    if (!user) return;
    const q = query(collection(db, "projects"), where("ownerId", "==", user.uid));
    const snapshot = await getDocs(q);
    setUserProjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  // ✅ Handle dropdown options
  const handleDropdownClick = async (option) => {
    setDropdownOpen(false);
    if (option === "previous") {
      await fetchUserProjects();
      setModalOpen(true);
    } else if (option === "logout") {
      await signOut(auth);
      window.location.href = "/login";
    }
  };

  // ✅ Handle "Mark as Done"
  const handleMarkAsDone = async (projectId, projectName) => {
    if (window.confirm(`Mark "${projectName}" as done? This will remove it.`)) {
      try {
        await deleteDoc(doc(db, "projects", projectId));
        setUserProjects(userProjects.filter((p) => p.id !== projectId));
        alert("Project marked as done ✅");
      } catch (err) {
        console.error("Error deleting project:", err);
        alert("Failed to mark as done.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-center">
        {/* Navbar */}
        <div className="navbar">
          <div className="logo">Campus Link 🚀</div>

          <div className="flex items-center">
            {user && canAccessProjects && (
              <div className="nav-buttons flex items-center">
                <Link to="/post-project" className="post">
                  Post a Project
                </Link>
                <Link to="/find-projects" className="find">
                  Find a Project
                </Link>
              </div>
            )}

            {user && (
              <div className="avatar-dropdown ml-4">
                <img
                  src={user.photoURL || defaultAvatar}
                  alt="avatar"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <button onClick={() => handleDropdownClick("previous")}>
                      Previous Team Ups
                    </button>
                    <button onClick={() => handleDropdownClick("logout")}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Welcome text for not logged in users */}
        {!user && (
          <div className="mt-12 space-x-4">
            <Link
              to="/signup"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            >
              Login
            </Link>
          </div>
        )}

        {/* Page Routes */}
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/complete-profile"
            element={
              <PrivateRoute user={user}>
                <CompleteProfile setCanAccessProjects={setCanAccessProjects} />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute user={user}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/post-project"
            element={
              <PrivateRoute user={user}>
                <PostProject />
              </PrivateRoute>
            }
          />
          <Route
            path="/find-projects"
            element={
              <PrivateRoute user={user}>
                <FindProjects />
              </PrivateRoute>
            }
          />
        </Routes>

        {/* ✅ Modal for Previous Team Ups */}
        {modalOpen && (
          <div className="modal-bg" onClick={() => setModalOpen(false)}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-btn"
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
              <h3 className="text-2xl font-bold mb-4">Your Previous Team Ups</h3>

              {userProjects.length === 0 ? (
                <p>No projects posted yet.</p>
              ) : (
                <ul className="space-y-3">
                  {userProjects.map((proj) => (
                    <li
                      key={proj.id}
                      className="card text-left relative p-3 border rounded-md shadow-sm"
                    >
                      <h4 className="font-semibold">{proj.projectName}</h4>
                      <p className="text-gray-600 text-sm">
                        {proj.description.length > 100
                          ? proj.description.slice(0, 100) + "..."
                          : proj.description}
                      </p>
                      <p className="text-sm">
                        <strong>Domain:</strong> {proj.domain}
                      </p>
                      <p className="text-sm">
                        <strong>Tech Stack:</strong>{" "}
                        {Array.isArray(proj.techStack)
                          ? proj.techStack.join(", ")
                          : proj.techStack}
                      </p>
                      <p className="text-sm">
                        <strong>Teammates Needed:</strong> {proj.teamSize}
                      </p>

                      {/* ✅ Mark as Done button */}
                      <button
                        onClick={() =>
                          handleMarkAsDone(proj.id, proj.projectName)
                        }
                        className="absolute top-2 right-2 bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700 transition"
                      >
                        Mark as Done
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
