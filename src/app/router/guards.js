// src/app/router/guards.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// ✅ 유저 로그인 필요
export function RequireUserAuth({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("userToken");

  if (!token) {
    return <Navigate to="/introstart" replace state={{ from: location }} />;
  }
  return children;
}

// ✅ 유저가 이미 로그인 상태면 로그인/회원가입 접근 막기
export function RedirectIfUserAuthed({ children }) {
  const token = localStorage.getItem("userToken");
  if (token) return <Navigate to="/" replace />;
  return children;
}

// ✅ 관리자 로그인 필요
export function RequireAdminAuth({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("admin_token");

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return children;
}

// ✅ 관리자 로그인 상태면 /admin/login 접근 막기
export function RedirectIfAdminAuthed({ children }) {
  const token = localStorage.getItem("admin_token");
  if (token) return <Navigate to="/admin" replace />;
  return children;
}
