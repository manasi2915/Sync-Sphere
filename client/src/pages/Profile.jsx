import React from "react";
import { auth } from "../utils/auth";

export default function Profile() {
  const user = auth.user();

  if (!user) return <div className="p-6">No user found.</div>;

  return (
    <div className="space-y-6 p-4">

      <h1 className="text-3xl font-bold">My Profile</h1>
      <p className="text-gray-600">View and manage your account details.</p>

      <div className="card p-6 space-y-4">

        <div>
          <label className="text-sm text-gray-500">Name</label>
          <div className="text-lg font-semibold">{user.name}</div>
        </div>

        <div>
          <label className="text-sm text-gray-500">Email</label>
          <div className="text-lg">{user.email}</div>
        </div>

        <div>
          <label className="text-sm text-gray-500">Role</label>
          <div className="capitalize text-lg">{user.role}</div>
        </div>

      </div>

    </div>
  );
}
