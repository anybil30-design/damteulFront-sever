// src/pages/Start.js
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Start.css";

const STORAGE_KEY = "firstEnter";
const TTL_MS = 30 * 60 * 1000; // 30분
const SHOW_MS = 2000; // 2초 후 바로 이동
const NEXT_PATH = "/intro";

const Start = () => {
  const navigate = useNavigate();

  const shouldShowSplash = useMemo(() => {
    const v = localStorage.getItem(STORAGE_KEY);
    if (!v) return true;

    const expiresAt = Number(v);
    if (!Number.isFinite(expiresAt)) return true;

    return Date.now() > expiresAt;
  }, []);

  useEffect(() => {
    // 30분 이내 재방문 → 바로 이동
    if (!shouldShowSplash) {
      navigate(NEXT_PATH, { replace: true });
      return;
    }

    // 첫 방문 → 만료 시각 저장
    localStorage.setItem(STORAGE_KEY, String(Date.now() + TTL_MS));

    // 2초 뒤 바로 이동 (페이드 없음)
    const timer = setTimeout(() => {
      navigate(NEXT_PATH, { replace: true });
    }, SHOW_MS);

    return () => clearTimeout(timer);
  }, [navigate, shouldShowSplash]);

  return (
    <main className="splashScreen">
      <div className="logo_container">
        <img
          src={`${process.env.PUBLIC_URL}/images/logo3.png`}
          alt="메인로고3"
        />
      </div>
    </main>
  );
};

export default Start;
