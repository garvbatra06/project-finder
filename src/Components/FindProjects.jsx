// src/Components/FindProjects.jsx
import { useEffect, useState } from "react";
import { db } from "../Authentication/firebase";
import { collection, getDocs } from "firebase/firestore";
import "./FindProjects.css";

function FindProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // ✅ Updated: Universal Read More function (works for all users)
  const handleReadMore = async (project) => {
    try {
      const uploaderData = {
        name:
          project.uploaderName ||
          project.ownerName ||
          project.owner ||
          "Not Available",
        email:
          project.uploadedBy ||
          project.ownerEmail ||
          project.postedBy ||
          "Not Available",
        phone:
          project.ownerPhone ||
          project.contactNumber ||
          project.phone ||
          "Not Provided",
        linkedin:
          project.ownerLinkedin ||
          project.linkedin ||
          "Not Provided",
      };

      setSelectedProject({ ...project, uploaderData });
    } catch (error) {
      console.error("Error loading project details:", error);
    }
  };

  const closeModal = () => setSelectedProject(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-600">
        Loading projects...
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <h2 className="text-2xl font-bold mb-3">No Projects Available 😔</h2>
        <p className="text-gray-600">
          Looks like no one has posted a project yet. Be the first to{" "}
          <span className="text-blue-600 font-semibold">create one!</span>
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Available Projects 🔍
      </h2>

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="border rounded-xl p-5 bg-white shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-1 text-gray-800">
              {proj.projectName}
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Uploaded by: {proj.uploadedBy || proj.ownerEmail || proj.postedBy || "Unknown"}
            </p>

            <p className="text-gray-700 text-sm mb-4">
              {proj.description?.length > 100
                ? proj.description.slice(0, 100) + "..."
                : proj.description}
            </p>

            <div className="text-sm text-gray-600 mb-2">
              <strong>Domain:</strong> {proj.domain || "N/A"}
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <strong>Tech Stack:</strong>{" "}
              {Array.isArray(proj.techStack)
                ? proj.techStack.join(", ")
                : proj.techStack || "N/A"}
            </div>

            <button
              onClick={() => handleReadMore(proj)}
              className="bg-blue-600 text-white text-sm py-2 px-3 rounded hover:bg-blue-700 transition"
            >
              Read More
            </button>
          </div>
        ))}
      </div>

      {/* Modal for Read More */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-8 w-11/12 md:w-2/3 lg:w-1/2 shadow-2xl relative animate-fadeIn">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl font-bold"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold mb-2 text-gray-800">
              {selectedProject.projectName}
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Uploaded by:{" "}
              {selectedProject.uploaderData?.email || "Unknown"}
            </p>

            <p className="text-gray-700 mb-4">{selectedProject.description}</p>

            <p className="text-sm mb-2">
              <strong>Domain:</strong> {selectedProject.domain}
            </p>
            <p className="text-sm mb-2">
              <strong>Tech Stack:</strong>{" "}
              {Array.isArray(selectedProject.techStack)
                ? selectedProject.techStack.join(", ")
                : selectedProject.techStack}
            </p>
            <p className="text-sm mb-2">
              <strong>Teammates Needed:</strong> {selectedProject.teamSize}
            </p>

            <hr className="my-4" />
            <h4 className="text-lg font-semibold mb-2">Uploader Details</h4>
            <p>
              <strong>Name:</strong>{" "}
              {selectedProject.uploaderData?.name || "Not Available"}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {selectedProject.uploaderData?.email || "Not Available"}
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              {selectedProject.uploaderData?.phone || "Not Provided"}
            </p>
            <p>
              <strong>LinkedIn:</strong>{" "}
              {selectedProject.uploaderData?.linkedin &&
              selectedProject.uploaderData.linkedin !== "Not Provided" ? (
                <a
                  href={selectedProject.uploaderData.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  {selectedProject.uploaderData.linkedin}
                </a>
              ) : (
                "Not Provided"
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FindProjects;
