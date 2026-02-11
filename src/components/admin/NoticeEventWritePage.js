// src/components/admin/NoticeEventWritePage.js
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../admin/styles/NoticeDetailPage.module.css";
import api from "app/api/axios";
import { uploadSingleImage } from "../uploadImage/uploadSingleImages";
import { API_ORIGIN } from "app/api/apiOrigin";

const NoticeEventWritePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ querystring에서 defaultTab 읽기: ?defaultTab=event | notice
  const defaultTabFromQuery = useMemo(() => {
    const qs = new URLSearchParams(location.search);
    const v = (qs.get("defaultTab") || "").toLowerCase();
    return v === "event" ? "event" : "notice";
  }, [location.search]);

  // ✅ 탭(초기값은 query값 따라감)
  const [tab, setTab] = useState(defaultTabFromQuery);

  // query가 바뀌면 탭도 동기화(팝업을 같은 페이지로 재사용할 수도 있으니)
  useEffect(() => {
    setTab(defaultTabFromQuery);
  }, [defaultTabFromQuery]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ 공지/이벤트 공통 폼 상태
  const [form, setForm] = useState({
    title: "",
    content: "",
    startDate: "", // 이벤트에서만 사용
    endDate: "",   // 이벤트에서만 사용
    image: "",     // 저장된 이미지 URL(생성에서는 보통 안 씀)
  });

  // ✅ 상세페이지와 동일한 단일 이미지 업로드 상태
  const [imgChange, setImageChange] = useState({
    changed: false,
    previewUrl: "",
    file: null,
  });

  const resolveImageUrl = (p) => {
    if (!p) return "";
    if (p.startsWith("blob:")) return p;
    if (/^https?:\/\//i.test(p)) return p;
    return `${API_ORIGIN}${p.startsWith("/") ? "" : "/"}${p}`;
  };

  const toDateOnly = (v) => (v ? String(v).slice(0, 10) : "");

  // ✅ blob URL 정리
  useEffect(() => {
    return () => {
      if (imgChange.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(imgChange.previewUrl);
      }
    };
  }, [imgChange.previewUrl]);

  // ✅ 탭 바뀌면 “탭 전용 필드” 정리(원하지 않으면 삭제 가능)
  useEffect(() => {
    // 탭 전환 시 이벤트 날짜값은 공지에선 의미 없으니 비움
    if (tab === "notice") {
      setForm((prev) => ({ ...prev, startDate: "", endDate: "" }));
    }
  }, [tab]);

  // ✅ 폼 변경(이벤트일 때만 start/end 보정)
  const onChangeForm = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const next = { ...prev, [name]: value };

      // 이벤트일 때만 날짜 관계 보정
      if (tab === "event") {
        if (name === "startDate") {
          if (next.endDate && next.endDate < value) next.endDate = value;
        }
        if (name === "endDate") {
          if (next.startDate && value < next.startDate) next.endDate = next.startDate;
        }
      }

      return next;
    });
  };

  // ✅ 이미지 선택(단일)
  const onChangeImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setImageChange({
      changed: true,
      previewUrl,
      file,
    });

    e.target.value = "";
  };

  const removeImage = () => {
    if (imgChange.previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(imgChange.previewUrl);
    }
    setImageChange({ changed: false, previewUrl: "", file: null });
    setForm((prev) => ({ ...prev, image: "" }));
  };

  // ✅ 공통 검증
  const validate = () => {
    if (!form.title?.trim()) return "제목을 입력해주세요";
    if (!form.content?.trim()) return "내용을 입력해주세요";
    if (!imgChange.file) return "이미지를 등록해주세요";

    if (tab === "event") {
      if (!toDateOnly(form.startDate)) return "시작일을 선택해주세요";
      if (!toDateOnly(form.endDate)) return "종료일을 선택해주세요";
    }

    return "";
  };

  // ✅ 탭별 저장 함수 분리
  const saveEvent = async () => {
    // 1) 이미지 업로드
    const imageUrl = await uploadSingleImage(imgChange.file, "event");

    // 2) payload (네 상세페이지 update payload와 키 맞춤)
    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      image: imageUrl,
      startDate: toDateOnly(form.startDate),
      endDate: toDateOnly(form.endDate),
    };

    // 3) POST (네 백엔드에 맞게 필요시 URL 수정)
    return api.post("/api/admin/event/create", payload);
  };

  const saveNotice = async () => {
    // 1) 이미지 업로드 (폴더 정책: notice 따로면 "notice", 같이면 "event")
    const imageUrl = await uploadSingleImage(imgChange.file, "notice");

    // 2) payload (공지: start/end 없음)
    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      image: imageUrl,
    };

    // 3) POST (네 백엔드에 맞게 필요시 URL 수정)
    return api.post("/api/admin/notice/create", payload);
  };

  // ✅ 저장 핸들러(탭 따라 실행)
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    const msg = validate();
    if (msg) return alert(msg);

    try {
      setLoading(true);

      const res = tab === "event" ? await saveEvent() : await saveNotice();
      const { data } = res;

      if (!data?.success) throw new Error(data?.message || "저장 실패");

      alert("등록 완료!");

      // 메인 리스트 새로고침 신호(팝업)
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: "UPDATED" }, window.location.origin);
      }

      // 팝업이면 닫기, 아니면 뒤로
      if (window.opener) window.close();
      else navigate(-1);
    } catch (err) {
      console.error(err);
      const emsg = err?.response?.data?.message || err?.message || "서버 오류";
      setError(emsg);
      alert(emsg);
    } finally {
      setLoading(false);
    }
  };
  const today = toDateOnly(new Date().toISOString());

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.wrapper}>
        {/* 헤더 */}
        <div className={styles.adminHeader}>
          <h2 className={styles.adminTitle}>
            {tab === "event" ? "이벤트 작성" : "공지사항 작성"}
          </h2>
          <span className={styles.adminDesc}>
            {tab === "event"
              ? "새 이벤트를 작성합니다."
              : "새 공지사항을 작성합니다."}
          </span>
        </div>

        {error ? <div className={styles.pageWrapper}>{error}</div> : null}

        {/* ✅ 탭 토글 (초기 활성화는 defaultTab 쿼리로 결정됨) */}
        <div style={{ display: "flex", gap: "12px", marginBottom: 12 }}>
          <button
            type="button"
            onClick={() => setTab("event")}
            disabled={loading}
            style={{
              border: tab === "event" ? '1px solid #58A563' : '1px solid #D7D7D7',
              background: tab === "event" ? "#58A563" : "#fff",
              color: tab === "event" ? '#fff' : '#1A1C19',
              padding: "10px 31px",
              borderRadius: "12px",
              cursor:"pointer",
            }}
          >
            이벤트
          </button>

          <button
            type="button"
            onClick={() => setTab("notice")}
            disabled={loading}
            style={{
              border: tab === "notice" ? '1px solid #58A563' : '1px solid #D7D7D7',
              background: tab === "notice" ? "#58A563" : "#fff",
              color: tab === "notice" ? '#fff' : '#1A1C19',
              borderRadius: "12px",
              padding: "10px 24px",
              cursor:"pointer",
            }}
          >
            공지사항
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSave} className={styles.adminBody}>
          {/* 제목 */}
          <div className={styles.inputGroup}>
            <label>제목</label>
            <input name="title" value={form.title} onChange={onChangeForm} />
          </div>

          {/* 내용 */}
          <div className={styles.inputGroup}>
            <label>설명</label>
            <textarea
              name="content"
              value={form.content}
              onChange={onChangeForm}
              rows={4}
            />
          </div>

          {/* ✅ 이벤트일 때만 기간 표시 */}
          {tab === "event" && (
            <>
              <div className={styles.inputGroup}>
                <label>시작일</label>
                <input
                  type="date"
                  name="startDate"
                  value={toDateOnly(form.startDate)}
                  onChange={onChangeForm}
                  min={today}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>종료일</label>
                <input
                  type="date"
                  name="endDate"
                  value={toDateOnly(form.endDate)}
                  onChange={onChangeForm}
                  min={toDateOnly(form.startDate) || undefined}
                />
              </div>
            </>
          )}

          {/* 이미지(단일) */}
          <div className={styles.inputGroup}>
            <label>이미지</label>

            {(imgChange.previewUrl || form.image) && (
              <img
                src={resolveImageUrl(imgChange.previewUrl || form.image)}
                alt={form.title || "preview"}
                style={{ width: "100%", borderRadius: "6px" }}
              />
            )}

            <input type="file" accept="image/*" onChange={onChangeImage} />

            {(imgChange.previewUrl || form.image) && (
              <button type="button" onClick={removeImage} style={{
                    background:'#E06868',
                    borderRadius:"12px", 
                    padding: "12px 0",
                    marginTop:"5px",
                    border: 'none',
                    width:"25%",
                    color: "#fff",
                    cursor: "pointer"
                }}>
                이미지 제거
              </button>
            )}
          </div>

          {/* 저장 */}
          <div className={styles.actionButtons}>
            <button type="submit" className={styles.primary} disabled={loading}>
              {loading ? "저장중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticeEventWritePage;
