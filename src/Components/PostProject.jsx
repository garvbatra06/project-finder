import { useState } from "react";
import { db, auth } from "../Authentication/firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import './PostProject.css';

function PostProject() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [techInput, setTechInput] = useState("");
  const [techStack, setTechStack] = useState([]);
  const [teamSize, setTeamSize] = useState(1);
  const [contactType, setContactType] = useState(""); // "phone" or "linkedin"
  const [contactValue, setContactValue] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAddTech = (tech) => {
    if (tech && !techStack.includes(tech)) {
      setTechStack([...techStack, tech]);
    }
    setTechInput("");
  };

  const handleRemoveTech = (tech) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (description.length < 100) {
      setError("Description must be at least 100 characters.");
      return;
    }
    if (teamSize > 5) {
      setError("You can only require up to 5 teammates.");
      return;
    }
    if (contactType && !contactValue) {
      setError(`Please provide your ${contactType} link/number.`);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to post a project.");
        return;
      }

      // Fetch user details if available
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      await addDoc(collection(db, "projects"), {
        ownerId: user.uid,
        projectName,
        description,
        domain,
        techStack,
        teamSize,
        createdAt: serverTimestamp(),
        uploaderName: userData.fullName || user.displayName || "Not Available",
        ownerEmail: user.email || "Unknown",
        ownerPhone: contactType === "phone" ? contactValue : null,
        ownerLinkedin: contactType === "linkedin" ? contactValue : null,
      });

      alert("✅ Project posted successfully!");
      navigate("/dashboard", { replace: true });
      setTimeout(() => window.location.reload(), 200);
    } catch (err) {
      console.error(err);
      setError("Failed to post project.");
    }
  };

  const domainOptions = [
    "AI/ML",
    "Web Development",
    "App Development",
    "Blockchain",
    "Cybersecurity",
    "IoT",
    "Game Development",
  ];

  return (
    <div className="post-container">
      <div className="post-card">
        <h2 className="post-heading">🚀 Post Your Project</h2>
        <form onSubmit={handleSubmit} className="post-form">
          <input
            type="text"
            placeholder="Project Name"
            className="input-box"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />

          <textarea
            placeholder="Project Description (min 100 characters)"
            className="input-box desc-box"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <select
            className="input-box"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
          >
            <option value="">Select Domain</option>
            {domainOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <div className="tech-stack">
            <input
              type="text"
              placeholder="Add tech stack (Press Enter)"
              className="input-box"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTech(techInput);
                }
              }}
            />
            <div className="tech-tags">
              {techStack.map((tech, idx) => (
                <span key={idx} className="tech-tag">
                  {tech}
                  <button
                    type="button"
                    className="remove-tag"
                    onClick={() => handleRemoveTech(tech)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <input
            type="number"
            placeholder="Team members required (max 5)"
            min="1"
            max="5"
            className="input-box"
            value={teamSize}
            onChange={(e) => setTeamSize(Number(e.target.value))}
            required
          />

          <div className="contact-section">
            <p className="contact-label">How can teammates contact you?</p>
            <div className="contact-options">
              <label>
                <input
                  type="radio"
                  name="contact"
                  value="phone"
                  checked={contactType === "phone"}
                  onChange={(e) => setContactType(e.target.value)}
                />{" "}
                Phone
              </label>
              <label>
                <input
                  type="radio"
                  name="contact"
                  value="linkedin"
                  checked={contactType === "linkedin"}
                  onChange={(e) => setContactType(e.target.value)}
                />{" "}
                LinkedIn
              </label>
            </div>

            {contactType && (
              <input
                type={contactType === "phone" ? "tel" : "url"}
                placeholder={
                  contactType === "phone"
                    ? "Enter your phone number"
                    : "Enter your LinkedIn profile URL"
                }
                className="input-box"
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                required
              />
            )}
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="submit-btn">
            Post Project
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostProject;
