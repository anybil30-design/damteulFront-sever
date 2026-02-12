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
 *
 * 규칙
 * 1) 타임존 없는 문자열
 *    - "YYYY-MM-DD HH:mm:ss(.SSS)?"  -> KST로 확정
 *    - "YYYY-MM-DDTHH:mm:ss(.SSS)?" -> KST로 확정
 *
 * 2) 타임존 있는 문자열
 *    - "....Z" / "....+09:00" / "....+00:00" 등 -> new Date로 처리 (절대시각 확정)
 *
 * 핵심: 타임존 없는 문자열을 new Date로 파싱하면 "환경(서버/브라우저 타임존)"에 따라 달라질 수 있으니,
 *       우리가 KST라고 확정할 수 있는 포맷은 직접 epoch로 변환한다.
 */
function toEpochMs(v) {
  if (!v) return null;

  // Date 객체면 그대로
  if (v instanceof Date) {
    const t = v.getTime();
    return Number.isNaN(t) ? null : t;
  }

  const s = String(v).trim();
  if (!s) return null;

  // 1) "YYYY-MM-DD HH:mm:ss(.SSS)?"  -> KST로 확정
  let m = s.match(
    /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/
  );
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    const hh = Number(m[4]);
    const mm = Number(m[5]);
    const ss = Number(m[6]);
    const ms = m[7] ? Number(m[7].padEnd(3, "0")) : 0;

    // KST(+09:00) -> UTC epoch : hour - 9
    const utcMs = Date.UTC(y, mo - 1, d, hh - 9, mm, ss, ms);
    return Number.isNaN(utcMs) ? null : utcMs;
  }

  // 2) "YYYY-MM-DDTHH:mm:ss(.SSS)?" + (타임존 없음) -> KST로 확정
  //    (단, 뒤에 Z/+09:00/+00:00 등이 붙으면 아래 3)에서 처리)
  m = s.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/
  );
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    const hh = Number(m[4]);
    const mm = Number(m[5]);
    const ss = Number(m[6]);
    const ms = m[7] ? Number(m[7].padEnd(3, "0")) : 0;

    const utcMs = Date.UTC(y, mo - 1, d, hh - 9, mm, ss, ms);
    return Number.isNaN(utcMs) ? null : utcMs;
  }

  // 3) 타임존이 포함된 ISO/RFC 형태면 new Date로 절대시각 생성
  //    예: 2026-02-11T03:10:00.000Z, 2026-02-11T12:10:00+09:00
  const dt = new Date(s);
  const t = dt.getTime();
  return Number.isNaN(t) ? null : t;
}

function timeAgo(dateValue) {
  const t = toEpochMs(dateValue);
  if (!t) return "";

  const diffMs = Date.now() - t;

  // 미래 시간이 들어오면(서버/직렬화 문제로 +9h 등) 이상하게 보이니 최소 방어
  if (diffMs < 0) return "방금 전";

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
                  {/* ✅ 환경/타임존에 흔들리지 않게 KST 확정 파싱 후 "n분 전" */}
                  <span>{room.lastMessageAt}</span>
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