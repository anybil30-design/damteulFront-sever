import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { IoIosSend } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import "./styles/chatroom.css";
import { getUserId } from "components/getUserId/getUserId";
import api from "app/api/axios";
import { API_ORIGIN } from "app/api/apiOrigin";

/**
 * ⚠️ 기존 parseDateSafe는 Date 파싱 시 환경에 따라 UTC로 오해되어 +9시간 문제가 날 수 있음.
 * 그래서 DB DATETIME("YYYY-MM-DD HH:mm:ss")는 Date로 바꾸지 않고 "문자열 그대로" 유지.
 */
function parseDateSafe(v) {
  if (!v) return null;
  if (v instanceof Date) return v;

  const s = String(v);

  // DB DATETIME: "YYYY-MM-DD HH:mm:ss" -> 문자열 그대로 반환
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(s)) {
    return s;
  }

  // 기타: ISO(Z), timestamp 등은 Date로 fallback
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** =========================
 * ✅ 문자열 우선 추출 유틸 (타임존 이슈 원천 차단)
 * - createdAt이 DB DATETIME(KST) 문자열이면, Date 변환 없이 "그대로" 사용
 * - ISO(Z) 등만 Date로 fallback
 * ========================= */
function extractYMD(v) {
  if (!v) return "";
  if (typeof v === "string") {
    const m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  }

  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return "";

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function extractHM(v) {
  if (!v) return "";

  if (typeof v === "string") {
    // "YYYY-MM-DD HH:mm:ss"
    let m = v.match(/^\d{4}-\d{2}-\d{2}\s(\d{2}):(\d{2}):\d{2}/);
    if (m) return `${m[1]}:${m[2]}`;

    // "YYYY-MM-DDTHH:mm:ss" (Z/offset 유무 상관없이 일단 문자열에서 시:분만)
    m = v.match(/T(\d{2}):(\d{2}):\d{2}/);
    if (m) return `${m[1]}:${m[2]}`;

    // 이미 "HH:mm"
    m = v.match(/^(\d{2}):(\d{2})$/);
    if (m) return v;
  }

  // fallback: Date로 포맷 (ISO Z 등)
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return "";

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

/**
 * ✅ createdAt이 없을 때만 쓰는 로컬 KST 문자열(형태 통일용)
 * (가능하면 서버가 createdAt 내려주는 게 베스트)
 */
function nowKstDatetimeString() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const get = (type) => parts.find((p) => p.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

/* =========================
   KST 포맷 유틸 (✅ 문자열 우선)
========================= */
function formatKSTTime(dateValue) {
  return extractHM(dateValue);
}

function formatKSTDateLabel(dateValue) {
  const ymd = extractYMD(dateValue);
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-");
  return `${y}년 ${m}월 ${d}일`;
}

function getKSTYMD(dateValue) {
  return extractYMD(dateValue);
}

/* =========================
   메시지 그룹 판정
========================= */
function isSameMinute(prevAt, currAt) {
  if (!prevAt || !currAt) return false;

  // 문자열(DB DATETIME 등)이면 문자열에서 분 단위까지 직접 비교 (타임존 변환 없음)
  if (typeof prevAt === "string" && typeof currAt === "string") {
    const p = prevAt.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}):(\d{2})/);
    const c = currAt.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}):(\d{2})/);
    if (p && c) return p[1] === c[1] && p[2] === c[2] && p[3] === c[3];
  }

  // fallback: Date 비교
  const prev = prevAt instanceof Date ? prevAt : new Date(prevAt);
  const curr = currAt instanceof Date ? currAt : new Date(currAt);
  if (Number.isNaN(prev.getTime()) || Number.isNaN(curr.getTime())) return false;

  return (
    prev.getFullYear() === curr.getFullYear() &&
    prev.getMonth() === curr.getMonth() &&
    prev.getDate() === curr.getDate() &&
    prev.getHours() === curr.getHours() &&
    prev.getMinutes() === curr.getMinutes()
  );
}

function isNewGroup(prev, curr) {
  if (!prev) return true;
  if (prev.user_id !== curr.user_id) return true;
  if (!isSameMinute(prev.createdAt, curr.createdAt)) return true;
  return false;
}

function isGroupEnd(curr, next) {
  if (!next) return true;
  return isNewGroup(curr, next);
}

const ChatRoom = () => {
  const outlet = useOutletContext() || {};
  const setTitle = outlet.setTitle;

  const { chat_id } = useParams();
  const chatId = Number(chat_id);
  const myUserId = Number(getUserId());

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const listRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const didInitialScrollRef = useRef(false);

  const scrollToBottom = (smooth = false) => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end",
      });
      return;
    }
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    setTitle?.("채팅");
  }, [setTitle, chatId]);

  useEffect(() => {
    didInitialScrollRef.current = false;
  }, [chatId]);

  useLayoutEffect(() => {
    if (messages.length === 0) return;
    scrollToBottom(false);
    const id = requestAnimationFrame(() => scrollToBottom(false));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, messages.length]);

  useEffect(() => {
    if (messages.length === 0) return;
    if (!didInitialScrollRef.current) {
      didInitialScrollRef.current = true;
      return;
    }
    scrollToBottom(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const isSameKSTDate = (a, b) => getKSTYMD(a) === getKSTYMD(b);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!Number.isFinite(chatId) || chatId <= 0) return;
      if (!myUserId) return;

      try {
        const { data } = await api.get("/api/chat/messages", {
          params: { chat_id: chatId, user_id: myUserId },
        });

        if (!data?.success) return;
        setMessages(Array.isArray(data.messages) ? data.messages : []);
      } catch (err) {
        console.error("fetchMessages error:", err);
      }
    };

    fetchMessages();
  }, [chatId, myUserId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    try {
      const { data } = await api.post("/api/chat/send", {
        chat_id: chatId,
        user_id: myUserId,
        content: text,
      });

      if (!data?.success) {
        alert(data?.message || "전송 실패");
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: data.message_id ?? Date.now(),
          user_id: myUserId,
          nickname: null,
          profile: "defaultProfile.png",
          text,
          createdAt: data.createdAt || nowKstDatetimeString(),
        },
      ]);

      setInput("");
      requestAnimationFrame(() => inputRef.current?.focus());
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || "서버 오류");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="chatRoomWrap">
      <div className="chatRoomOut">
        <div className="chatRoomIn">
          <div className="chating" ref={listRef}>
            {messages.map((msg, idx) => {
              const prev = messages[idx - 1];
              const next = messages[idx + 1];

              const isMine = Number(msg.user_id) === myUserId;
              const showDate = !prev || !isSameKSTDate(prev.createdAt, msg.createdAt);
              const showProfile = !isMine && isNewGroup(prev, msg);
              const showTime = isGroupEnd(msg, next);

              return (
                <React.Fragment key={msg.id ?? `${idx}-${String(msg.createdAt)}`}>
                  {showDate && (
                    <p className="chatDate">
                      <span>{formatKSTDateLabel(msg.createdAt)}</span>
                    </p>
                  )}

                  <div className={isMine ? "chatBuyer" : "chatSeller"}>
                    {!isMine && showProfile && (
                      <div className="profile">
                        <img
                          src={
                            msg.profile && msg.profile !== "defaultProfile.png"
                              ? `${API_ORIGIN}${msg.profile}`
                              : `${process.env.PUBLIC_URL}/images/defaultProfile.png`
                          }
                          alt="프로필"
                        />
                      </div>
                    )}

                    {!isMine && !showProfile && <div className="profilePlaceholder" />}

                    {/* ✅ 시간: 내/상대 모두 동일하게 formatKSTTime 적용 */}
                    {isMine && showTime && <p className="time">{formatKSTTime(msg.createdAt)}</p>}

                    <div className="messageBox">
                      <p>{msg.text}</p>
                    </div>

                    {!isMine && showTime && <p className="time">{formatKSTTime(msg.createdAt)}</p>}
                  </div>
                </React.Fragment>
              );
            })}

            <div style={{ height: 90 }} />
            <div ref={bottomRef} />
          </div>

          <form className="chatingBox" onSubmit={handleSubmit}>
            <div className="chatingBoxOuter">
              <div className="chatingBoxInner">
                <button type="button">
                  <FaPlus />
                </button>

                <label htmlFor="chatBar" style={{ display: "none" }}>
                  채팅바
                </label>

                <input
                  ref={inputRef}
                  type="text"
                  id="chatBar"
                  placeholder="메세지 입력"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />

                <button type="submit" disabled={sending || !input.trim()}>
                  <IoIosSend />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ChatRoom;