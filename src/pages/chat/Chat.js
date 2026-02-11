import React, { useEffect, useMemo, useState } from "react";
import ChatListItem from "components/chat/ChatListItem";
import "./styles/chat.css";
import api from "app/api/axios";
import { getUserId } from "components/getUserId/getUserId";

const Chat = () => {
  const [tab, setTab] = useState(0); // 0=전체, 1=안읽음
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const myUserId = Number(getUserId());

  const fetchRooms = async () => {
    if (!myUserId) return;

    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/chat/rooms", {
        params: { user_id: myUserId },
      });

      if (!data?.success) {
        setRooms([]);
        setError(data?.message || "채팅 목록 조회 실패");
        return;
      }

      setRooms(data.rooms || []);
    } catch (e) {
      console.error("fetchRooms error:", e);
      setRooms([]);
      setError("서버 오류(채팅 목록)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUserId]);

  const filtered = useMemo(() => {
    if (tab === 0) return rooms;
    return rooms.filter((r) => Number(r.unreadCount || 0) > 0);
  }, [rooms, tab]);

  return (
    <main className="chatPageWrap">
      <h2 className="title">채팅</h2>

      <div className="btnContainer">
        <button onClick={() => setTab(0)} className={tab === 0 ? "btnActive" : ""}>
          전체
        </button>
        <button onClick={() => setTab(1)} className={tab === 1 ? "btnActive" : ""}>
          안읽음
        </button>
      </div>

      {loading && <p style={{ padding: 12 }}>불러오는 중...</p>}
      {!loading && error && <p style={{ padding: 12 }}>{error}</p>}

      <ul className="chatList">
        {!loading && !error && filtered.length === 0 && (
          <p style={{ padding: 12 }}>채팅이 없습니다.</p>
        )}

        {filtered.map((room) => (
          <ChatListItem key={room.chat_id} room={room} />
        ))}
      </ul>
    </main>
  );
};

export default Chat;
