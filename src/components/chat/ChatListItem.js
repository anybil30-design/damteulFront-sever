import React from "react";
import { Link } from "react-router-dom";
import {API_ORIGIN} from "app/api/apiOrigin";

function truncate(text, max = 28) {
  const s = (text ?? "").trim();
  if (!s) return "";
  return s.length > max ? s.slice(0, max) + "..." : s;
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const diffMs = Date.now() - d.getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return "방금 전";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}분 전`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;
  const day = Math.floor(hour / 24);
  return `${day}일 전`;
}

function badgeText(n) {
  const v = Number(n || 0);
  if (v <= 0) return "";
  return v > 99 ? "99+" : String(v);
}

const ChatListItem = ({ room }) => {
  // 프로필 주소
  const profileSrc =
    room?.otherProfile!=="defaultProfile.png"?
        `${API_ORIGIN}${room.otherProfile}`
      : `${process.env.PUBLIC_URL}/images/defaultProfile.png`;

  const badge = badgeText(room?.unreadCount);

  return (
    <li>
      {/* ✅ 여기만 변경 */}
      <Link to={`/chat/chatroom/${room.chat_id}`} title="채팅바로가기">
        <div className="chatParent">
          <div className="chatContWrap">
            <div className="chatCont">
              <div className="chatImg">
                <img src={profileSrc} alt="상대 프로필" />
              </div>

              <div className="chatTxt">
                <div>
                  <h3>{room.otherNickname || "상대"}</h3>
                  <span>{timeAgo(room.lastMessageAt)}</span>
                </div>

                <p>{truncate(room.lastText, 28)}</p>
              </div>
            </div>

            {badge && <span className="chatBadge">{badge}</span>}
          </div>
        </div>
      </Link>
    </li>
  );
};

export default ChatListItem;
