import React from "react";
import { Link } from "react-router-dom";
import { API_ORIGIN } from "app/api/apiOrigin";

function truncate(text, max = 28) {
  const s = (text ?? "").trim();
  if (!s) return "";
  return s.length > max ? s.slice(0, max) + "..." : s;
}

/**
 * ✅ 어떤 환경에서도 동일한 "절대 시각(ms)"으로 변환
 * - DB가 KST로 저장된 DATETIME("YYYY-MM-DD HH:mm:ss")이면 -> "KST로 확정"해서 epoch(ms) 생성
 * - ISO(Z / +09:00 등) 형태면 -> new Date로 그대로 epoch(ms)
 *
 * 핵심: "타임존 없는 문자열"을 new Date로 그냥 파싱하지 말고,
 *       우리가 'KST'라고 확정할 수 있는 형식은 직접 파싱해서 변환한다.
 */
function toEpochMs(v) {
  if (!v) return null;

  if (v instanceof Date) {
    const t = v.getTime();
    return Number.isNaN(t) ? null : t;
  }

  const s = String(v).trim();
  if (!s) return null;

  // 1) DB DATETIME: "YYYY-MM-DD HH:mm:ss" (KST로 저장된 값)
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    const hh = Number(m[4]);
    const mm = Number(m[5]);
    const ss = Number(m[6]);

    // KST(+09:00) -> UTC epoch: hour에서 9 빼서 Date.UTC로 만든다
    const utcMs = Date.UTC(y, mo - 1, d, hh - 9, mm, ss);
    return Number.isNaN(utcMs) ? null : utcMs;
  }

  // 2) 타임존 없는 ISO 비슷한 문자열: "YYYY-MM-DDTHH:mm:ss" (Z/offset 없음)
  //    이것도 서버가 KST 문자열로 준 케이스가 있을 수 있으니 KST로 확정 처리
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/);
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    const hh = Number(m[4]);
    const mm = Number(m[5]);
    const ss = Number(m[6]);
    const utcMs = Date.UTC(y, mo - 1, d, hh - 9, mm, ss);
    return Number.isNaN(utcMs) ? null : utcMs;
  }

  // 3) ISO with Z/offset, RFC 등: new Date로 안전하게 epoch 생성 가능
  const dt = new Date(s);
  const t = dt.getTime();
  return Number.isNaN(t) ? null : t;
}

function timeAgo(dateValue) {
  const t = toEpochMs(dateValue);
  if (!t) return "";

  const diffMs = Date.now() - t;
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
  const profileSrc =
    room?.otherProfile !== "defaultProfile.png"
      ? `${API_ORIGIN}${room.otherProfile}`
      : `${process.env.PUBLIC_URL}/images/defaultProfile.png`;

  const badge = badgeText(room?.unreadCount);
  console.log("lastMessageAt:", room.lastMessageAt);

  return (
    <li>
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
                  {/* ✅ 어떤 환경에서도 동일한 기준(절대시각 ms)으로 "n분 전" 계산 */}
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
