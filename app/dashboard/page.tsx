"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const user = session.user;

  return (
    <div className="max-w-2xl p-8 mx-auto mt-10 bg-white rounded shadow">
      <h1 className="mb-6 text-3xl font-bold">Welcome, {user.name || user.email}</h1>
      <div className="mb-4">
        <strong>Email:</strong> {user.email}
      </div>
      <div className="mb-4">
        <strong>Role:</strong> {user.role}
      </div>
      {/* Add more user info fields here as needed */}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="px-4 py-2 mt-6 font-bold text-white bg-red-600 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
