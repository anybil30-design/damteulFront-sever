// src/pages/chat/ChatStart.jsx (경로는 네 프로젝트 구조에 맞게 조정)
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { IoIosSend } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import "./styles/chatroom.css";
import { getUserId } from "components/getUserId/getUserId";
import api from "app/api/axios";

const ChatStart = () => {
  // ✅ outlet context가 undefined여도 안 죽게 방어
  const outlet = useOutletContext() || {};
  const setTitle = outlet.setTitle;

  const navigate = useNavigate();
  const { goods_id } = useParams(); // /chat/start/:goods_id
  const goodsId = Number(goods_id);

  const myUserId = Number(getUserId()); // buyer_id로 사용

  const [input, setInput] = useState("");
  const [checking, setChecking] = useState(true); // 방 존재 확인중
  const [sending, setSending] = useState(false);

  const inputRef = useRef(null);

  // 1) 진입 시: 이미 방이 있으면 바로 chatRoom으로 이동
  useEffect(() => {
    const checkRoom = async () => {
      if (!Number.isFinite(goodsId) || goodsId <= 0) {
        setChecking(false);
        return;
      }
      if (!myUserId) {
        setChecking(false);
        return;
      }

      try {
        const { data } = await api.get("/api/chat/room", {
          params: {
            goods_id: goodsId,
            buyer_id: myUserId,
          },
        });

        if (data?.success && data?.chat_id) {
          // ✅ 기존 방 존재 -> 바로 이동
          navigate(`/chat/chatroom/${data.chat_id}`, { replace: true });
          return;
        }
      } catch (err) {
        console.error("checkroom error:", err);
      } finally {
        setChecking(false);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    };

    checkRoom();
  }, [goodsId, myUserId, navigate]);

  // 제목 받아오기 기본값
    useEffect(() => {
      setTitle?.("채팅");
    }, [setTitle]);

  // 2) 첫 메시지 전송 (방 생성 + 첫 메시지 저장)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = input.trim();
    if (!text || sending) return;

    if (!Number.isFinite(goodsId) || goodsId <= 0) {
      alert("유효하지 않은 상품입니다.");
      return;
    }
    if (!myUserId) {
      alert("로그인이 필요합니다.");
      return;
    }

    setSending(true);
    try {
      const { data } = await api.post("/api/chat/send-first", {
        goods_id: goodsId,
        buyer_id: myUserId,
        content: text,
      });

      if (!data?.success || !data?.chat_id) {
        alert(data?.message || "첫 메시지 전송 실패");
        return;
      }

      // ✅ 방 생성/확보 되었으니 채팅방으로 이동
      navigate(`/chat/chatRoom/${data.chat_id}`, { replace: true });
    } catch (err) {
      console.error("send-first error:", err);
      alert("서버 오류");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="chatRoomWrap">
      <div className="chatRoomOut">
        <div className="chatRoomIn">
          <div className="chating">
            {checking ? (
              <p style={{ padding: 16 }}>채팅방 확인 중...</p>
            ) : (
              <p style={{ padding: 16, opacity: 0.8 }}>
                첫 메시지를 보내면 채팅방이 생성됩니다.
              </p>
            )}
            <div style={{ height: 90 }} />
          </div>

          <form className="chatingBox" onSubmit={handleSubmit}>
            <div className="chatingBoxOuter">
              <div className="chatingBoxInner">
                <button type="button" disabled={checking || sending}>
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
                  disabled={checking || sending}
                />

                <button
                  type="submit"
                  disabled={checking || sending || !input.trim()}
                >
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

export default ChatStart;
