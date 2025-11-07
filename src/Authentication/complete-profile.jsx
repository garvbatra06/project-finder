import { useState } from "react";
import { db, auth } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function CompleteProfile() {
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");
  const [techStack, setTechStack] = useState("");
  const [contact, setContact] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return alert("User not logged in!");

    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        year,
        course,
        techStack,
        contact,
      });

      alert("Profile completed successfully!");
      navigate("/dashboard"); // ✅ redirect to dashboard now
    } catch (err) {
      console.error(err);
      alert("Error saving profile: " + err.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-96 mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input placeholder="Year" className="border rounded px-3 py-2" value={year} onChange={(e) => setYear(e.target.value)} required />
        <input placeholder="Course (BCA, BTech, etc)" className="border rounded px-3 py-2" value={course} onChange={(e) => setCourse(e.target.value)} required />
        <input placeholder="Tech Stack (comma separated)" className="border rounded px-3 py-2" value={techStack} onChange={(e) => setTechStack(e.target.value)} required />
        <input placeholder="Phone number or LinkedIn URL" className="border rounded px-3 py-2" value={contact} onChange={(e) => setContact(e.target.value)} required />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Save</button>
      </form>
    </div>
  );
}

export default CompleteProfile;
