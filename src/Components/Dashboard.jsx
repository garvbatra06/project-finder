import { useState } from "react";
import FindProjects from "./FindProjects";
import PostProject from "./PostProject";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("find");

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 text-center py-10">
      <h2 className="text-3xl font-bold mb-6">Welcome to Campus Link Dashboard 🎓</h2>

      {/* 🔁 Navigation Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("find")}
          className={`px-6 py-2 rounded-lg font-semibold ${
            activeTab === "find"
              ? "bg-blue-600 text-white"
              : "bg-white border border-blue-500 text-blue-600 hover:bg-blue-50"
          }`}
        >
          🔍 Find a Project
        </button>

        <button
          onClick={() => setActiveTab("post")}
          className={`px-6 py-2 rounded-lg font-semibold ${
            activeTab === "post"
              ? "bg-green-600 text-white"
              : "bg-white border border-green-500 text-green-600 hover:bg-green-50"
          }`}
        >
          🚀 Post a Project
        </button>
      </div>

      {/* 🧭 Conditional Rendering of Components */}
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6">
        {activeTab === "find" ? <FindProjects /> : <PostProject />}
      </div>
    </div>
  );
}

export default Dashboard;
