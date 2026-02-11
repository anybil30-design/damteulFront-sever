import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../admin/styles/Dashboard.css';
// axios
import api from "app/api/axios";

/* =================================================
  1️⃣ KPI 데이터

================================================= */
const formatDateNumber = (dateValue) => {
  // 서버에서 "YYYY-MM-DD" 형태로 오면 그대로 사용
  if (typeof dateValue === "string" && dateValue.length >= 10) {
    return dateValue.slice(0, 10);
  }

  // 혹시 Date 객체로 온 경우만 처리
  const d = new Date(dateValue);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const KPIBlock = ({ title, today, month, onClick }) => (
  <div className="kpiCard">
    {/* 상단 영역 */}
    <div className="kpiHeader">
      <h4>{title}</h4>

      {/* 이동 화살표 버튼 */}
      <button
        className="arrowButton"
        onClick={onClick}
        aria-label={`${title} 이동`}
      />

    </div>

    {/* 수치 영역 */}
    <div className="kpiBody">
      <p className="today">오늘: {today}</p>
      <p className="month">이번 달: {month}</p>
    </div>
  </div>
);

/* =================================================
  5️⃣ Dashboard 메인 컴포넌트
================================================= */
const Dashboard = () => {
  const navigate = useNavigate(); // 관리자 페이지 이동용

  // ✅ 서버에서 가져올 데이터들
  const [kpiData, setKpiData] = useState(null);
  const [summaryData, setSummaryData] = useState([]);
  const [eventsData, setEventsData] = useState([]);

  // ✅ 로딩/에러
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ 대시보드 API 호출
        const res = await api.get("/api/admin/dashboard");

        if (!alive) return;

        const data = res.data;

        setKpiData(data.kpiData);
        setSummaryData(data.summaryData || []);
        setEventsData(data.eventsData || []);
      } catch (err) {
        console.error(err);
        if (!alive) return;

        setError(
          err?.response?.data?.message ||
          "대시보드 데이터를 불러오지 못했어요."
        );
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    fetchDashboard();

    return () => {
      alive = false;
    };
  }, []);

  /* ================== 안전한 기본값 ================== */
  const todayUsers = kpiData?.today?.users ?? 0;
  const monthUsers = kpiData?.month?.users ?? 0;

  const todayReports = kpiData?.today?.reports ?? 0;
  const monthReports = kpiData?.month?.reports ?? 0;

  const todayPosts = kpiData?.today?.posts ?? 0;
  const monthPosts = kpiData?.month?.posts ?? 0;


  return (
    <div className="dashboardContainer">

      {/* ================= 운영 현황 KPI ================= */}
      <div className="kpiSection">
        <h2 className="sectionTitle">운영 현황</h2>

        <div className="kpiCards">
          {/* 사용자 관리 페이지 연동 */}
          <KPIBlock
            title="오늘 가입자"
            today={todayUsers}
            month={monthUsers}
            onClick={() => navigate('/admin/users')}
          />

          {/* 신고 관리 페이지 연동 */}
          <KPIBlock
            title="오늘 신고 내역"
            today={todayReports}
            month={monthReports}
            onClick={() => navigate('/admin/reports')}
          />

          {/* 게시글 관리 페이지 연동 */}
          <KPIBlock
            title="오늘 총 게시물"
            today={todayPosts}
            month={monthPosts}
            onClick={() => navigate('/admin/posts')}
          />
        </div>
      </div>

      {/* ================= 하단 영역 ================= */}
      <div className="lowerSection">

        {/* -------- 좌측: 일자별 요약 -------- */}
        <div className="summaryBox">
          <h3>일자별 요약</h3>

          <ul>
            {summaryData.map(item => (
              <li key={formatDateNumber(item.date)}>
                <strong>{item.date}</strong>
                <span> 가입자 {item.users}</span>
                <span> · 신고 {item.reports}</span>
                <span> · 게시물 {item.posts}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* -------- 우측: 이벤트 / 공지사항 -------- */}
        <div className="eventBox">
          <h3>이벤트 / 공지사항</h3>

          <table>
            <thead>
              <tr>
                <th>제목</th>
                <th>구분</th>
                <th>날짜</th>
              </tr>
            </thead>

            <tbody>
              {eventsData.map(item => (

                <tr key={item.id}>
                  <td
                    className="clickableCell"
                    onClick={() =>
                      navigate('/admin/events', {
                        state: { activeTab: item.type } // '공지사항' | '이벤트'
                      })
                    }
                  >
                    {item.title}
                  </td>
                  <td>{item.type===0?'이벤트':'공지사항'}</td>
                  <td>{formatDateNumber(item.date)}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
