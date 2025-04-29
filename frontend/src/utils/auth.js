import { AUTH_TOKEN_KEY, API_BASE_URL } from "../config/config";
import { redirect } from "react-router-dom";

export const checkAuth = async () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return redirect("/login");

  try {
    const res = await fetch(`${API_BASE_URL}/auth/validate`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 204) {
      return {};
    }
    if (!res.ok) throw new Error("Invalid token");

    const { user } = await res.json();
    return user;
  } catch (err) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return redirect("/login");
  }
};

export const checkGuest = async () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    return null;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/validate`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      return redirect("/");
    }
  } catch (err) {
    console.error("Guest-check error:", err);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  return null;
};
