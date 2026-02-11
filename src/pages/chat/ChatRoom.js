import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { IoIosSend } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import "./styles/chatroom.css";
import { getUserId } from "components/getUserId/getUserId";
import api from "app/api/axios";
import { API_ORIGIN } from "app/api/apiOrigin";

/* =========================
   KST 포맷 유틸
========================= */
function formatKSTTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

function formatKSTDateLabel(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const s = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);

  const clean = s.replace(/\./g, "").trim();
  const [y, m, day] = clean.split(/\s+/);
  return `${y}년 ${m}월 ${day}일`;
}

function getKSTYMD(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/* =========================
   메시지 그룹 판정
========================= */
function isSameMinute(prevAt, currAt) {
  const prev = new Date(prevAt);
  const curr = new Date(currAt);
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

  // ✅ outlet context가 undefined여도 안 죽게 방어
  const outlet = useOutletContext() || {};
  const setTitle = outlet.setTitle;

  const { chat_id } = useParams(); // /chat/chatroom/:chat_id
  const chatId = Number(chat_id);
  const myUserId = Number(getUserId());
  console.log(myUserId);
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
  
  // 제목 받아오기 기본값
  useEffect(() => {
    setTitle?.("채팅");
  }, [setTitle, chatId]);




  // ✅ chatId 바뀌면 초기 스크롤 플래그 리셋
  useEffect(() => {
    didInitialScrollRef.current = false;
  }, [chatId]);

  // ✅ 첫 로딩 / chatId 변경 시: 강제 맨 아래
  useLayoutEffect(() => {
    if (messages.length === 0) return;
    scrollToBottom(false);
    const id = requestAnimationFrame(() => scrollToBottom(false));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, messages.length]);

  // ✅ 이후 메시지 추가 시: 부드럽게 맨 아래
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

  // ✅ 메시지 불러오기
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
      createdAt: data.createdAt || new Date().toISOString(),
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
                <React.Fragment key={msg.id ?? `${idx}-${msg.createdAt}`}>
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

                    {isMine && showTime && (
                      <p className="time">{formatKSTTime(msg.createdAt)}</p>
                    )}

                    <div className="messageBox">
                      <p>{msg.text}</p>
                    </div>

                    {!isMine && showTime && (
                      <p className="time">{formatKSTTime(msg.createdAt)}</p>
                    )}
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
