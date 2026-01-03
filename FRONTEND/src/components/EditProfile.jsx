import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

/* 🔐 Cloudinary Config */
const CLOUD_NAME = "YOUR_CLOUD_NAME";
const UPLOAD_PRESET = "YOUR_UPLOAD_PRESET";

const EditProfile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: 18,
    gender: "",
    about: "",
    skills: [],
    photoUrl: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  /* 🔹 Prefill from Redux */
  useEffect(() => {
    if (!user) return;

    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      age: user.age ?? 18,
      gender: user.gender || "",
      about: user.about || "",
      skills: user.skills || [],
      photoUrl: user.photoUrl || "",
    });
  }, [user]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* 🔹 Skills */
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

  /* 🔹 Avatar Upload */
  const uploadAvatar = async (file) => {
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    try {
      setUploading(true);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const result = await res.json();
      updateField("photoUrl", result.secure_url);
    } catch {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* 🔹 Save */
  const saveProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.patch(`${BASE_URL}/profile/edit`, form, {
        withCredentials: true,
      });

      dispatch(addUser(res.data.data));
    } catch (err) {
      setError(err.response?.data || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-base-200 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-base-100 rounded-xl shadow-lg p-6">
        {/* <h2 className="text-xl font-semibold mb-6">Edit Profile</h2> */}

        <h1 className="text-3xl font-bold tracking-tight text-center">
          Edit Your Profile
        </h1>

        {error && <p className="text-error mb-4">{error}</p>}

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="avatar">
            <div className="w-20 rounded-full ring ring-primary ring-offset-2">
              <img
                src={
                  form.photoUrl ||
                  "https://cdn-icons-png.flaticon.com/512/4140/4140047.png"
                }
                alt="avatar"
              />
            </div>
          </div>

          <label className="btn btn-outline btn-sm">
            {uploading ? "Uploading..." : "Change Avatar"}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => uploadAvatar(e.target.files[0])}
            />
          </label>
        </div>

        {/* Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            className="input input-bordered"
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
          />
          <input
            className="input input-bordered"
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
            className="input input-bordered"
            placeholder="Age"
            value={form.age}
            onChange={(e) => updateField("age", Number(e.target.value))}
          />
          <select
            className="select select-bordered"
            value={form.gender}
            onChange={(e) => updateField("gender", e.target.value)}
          >
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <label className="text-sm font-medium">Tech Stack</label>
          <div className="flex gap-2 mt-1">
            <input
              className="input input-bordered flex-1"
              placeholder="React, Java, DSA..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
            />
            <button
              className="btn w-14 btn-primary btn-sm rounded-md"
              onClick={addSkill}
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {form.skills.map((skill) => (
              <span key={skill} className="badge badge-neutral gap-2">
                {skill}
                <button onClick={() => removeSkill(skill)}>✕</button>
              </span>
            ))}
          </div>
        </div>

        {/* About */}
        <textarea
          className="textarea textarea-bordered w-full mb-5"
          rows={3}
          placeholder="Tell something about yourself..."
          value={form.about}
          onChange={(e) => updateField("about", e.target.value)}
        />

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
