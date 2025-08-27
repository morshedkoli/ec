"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

type UserProfile = {
  fullName: string;
  fatherName: string;
  educationalQualification: string;
  profession: string;
  village: string;
  union: string;
  upazila: string;
  district: string;
  electionSeatNo: string;
  phoneNumber: string;
  favoriteParty: string;
  email: string;
};
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    // Fetch user profile from API
    fetch("/api/user/me").then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        // API returns the user object directly
        setForm({
          fullName: data.fullName || "",
          fatherName: data.fatherName || "",
          educationalQualification: data.educationalQualification || "",
          profession: data.profession || "",
          village: data.village || "",
          union: data.union || "",
          upazila: data.upazila || "",
          district: data.district || "",
          electionSeatNo: data.electionSeatNo || "",
          phoneNumber: data.phoneNumber || "",
          favoriteParty: data.favoriteParty || "",
          email: data.email || "",
        });
      }
      setLoading(false);
    });
  }, [session, status, router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!form) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => prev ? { ...prev, [e.target.name]: e.target.value } : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await fetch("/api/user/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSuccess("Profile updated successfully.");
    } else {
      setError("Failed to update profile.");
    }
  };

  return (
    <div className="max-w-2xl p-8 mx-auto mt-10 bg-white rounded shadow">
      <h1 className="mb-6 text-3xl font-bold">My Profile</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input name="fullName" value={form.fullName} onChange={handleChange} className="p-2 border rounded" required />
        <input name="fatherName" value={form.fatherName} onChange={handleChange} className="p-2 border rounded" />
        <input name="educationalQualification" value={form.educationalQualification} onChange={handleChange} className="p-2 border rounded" />
        <input name="profession" value={form.profession} onChange={handleChange} className="p-2 border rounded" />
        <input name="village" value={form.village} onChange={handleChange} className="p-2 border rounded" />
        <input name="union" value={form.union} onChange={handleChange} className="p-2 border rounded" />
        <input name="upazila" value={form.upazila} onChange={handleChange} className="p-2 border rounded" />
        <input name="district" value={form.district} onChange={handleChange} className="p-2 border rounded" />
        <input name="electionSeatNo" value={form.electionSeatNo} onChange={handleChange} className="p-2 border rounded" />
        <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="p-2 border rounded" />
        <input name="favoriteParty" value={form.favoriteParty} onChange={handleChange} className="p-2 border rounded" />
        <input name="email" value={form.email} className="p-2 border rounded bg-gray-100" disabled />
        {/* Add more fields as needed, disable non-editable fields */}
        <div className="col-span-2 flex flex-col gap-2 mt-4">
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}
          <button type="submit" className="py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700">Save Changes</button>
        </div>
      </form>
    </div>
  );
}
