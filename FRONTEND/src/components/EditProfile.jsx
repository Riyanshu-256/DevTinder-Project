// FILE: src/components/EditProfile.jsx
// UPDATED to fully match backend USER_SAFE_DATA
// FIXES: age Number, correct Redux update, clean form sync

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const EditProfile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  // 🔹 FIX: Form keys exactly match backend schema
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: 18, // FIX: default number (Mongo expects Number)
    gender: "",
    about: "",
    skills: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* 🔹 Prefill data from Redux */
  useEffect(() => {
    if (!user) return;

    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      age: user.age ?? 18, // FIX: fallback number
      gender: user.gender || "",
      about: user.about || "",
      skills: user.skills || [],
    });
  }, [user]);

  /* 🔹 Generic field update */
  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* 🔹 Skill handlers */
  const addSkill = () => {
    const value = skillInput.trim();
    if (!value || form.skills.includes(value)) return;

    setForm((prev) => ({
      ...prev,
      skills: [...prev.skills, value],
    }));
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  /* 🔹 Save profile */
  const saveProfile = async () => {
    try {
      setLoading(true);
      setError("");

      // FIX: Send form exactly as backend expects
      const res = await axios.patch(`${BASE_URL}/profile/edit`, form, {
        withCredentials: true,
      });

      // FIX: Backend returns { data: user }
      dispatch(addUser(res.data.data));
    } catch (err) {
      setError(err.response?.data || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-base-200 flex justify-center pt-16 px-4">
      <div className="w-full max-w-xl bg-base-300 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

        {/* Error */}
        {error && <p className="text-error text-sm mb-4">{error}</p>}

        {/* Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            className="input input-bordered w-full"
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
          />
          <input
            className="input input-bordered w-full"
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
          />
        </div>

        {/* Age + Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="number"
            min={18}
            className="input input-bordered w-full"
            placeholder="Age"
            value={form.age}
            // FIX: Convert string → Number (Mongo expects Number)
            onChange={(e) => updateField("age", Number(e.target.value))}
          />
          <select
            className="select select-bordered w-full"
            value={form.gender}
            onChange={(e) => updateField("gender", e.target.value)}
          >
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <label className="text-sm font-medium block mb-1">Tech Stack</label>

          <div className="flex gap-2">
            <input
              className="input input-bordered flex-1"
              placeholder="React, Java, DSA..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <button
              className="btn btn-primary"
              type="button"
              onClick={addSkill}
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {form.skills.map((skill) => (
              <span key={skill} className="badge badge-neutral gap-2">
                {skill}
                <button
                  className="text-error"
                  onClick={() => removeSkill(skill)}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="mb-6">
          <textarea
            className="textarea textarea-bordered w-full"
            rows={4}
            placeholder="Tell something about yourself..."
            value={form.about}
            onChange={(e) => updateField("about", e.target.value)}
          />
        </div>

        {/* Save */}
        <button
          className="btn btn-primary w-full"
          onClick={saveProfile}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
