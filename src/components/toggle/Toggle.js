import React, { useState } from 'react';

function Toggle({id}) {
  const [isOn, setIsOn] = useState(false);

  // 컨테이너 스타일 (label 역할)
  const labelStyle = {
    position: "relative",
    display: "inline-block",
    width: "3rem",
		minWidth:"3rem",
		maxWidth:"3rem",
    height: "30px",
    backgroundColor: isOn ? "#4cd964" : "#e0e0e0",
    borderRadius: "25px",
    cursor: "pointer",
    transition: "background-color 0.3s ease-out",
  };

  // 내부 원 스타일 (::after 역할)
  const circleStyle = {
    content: '""',
    position: "absolute",
    top: "3px",
    left: isOn ? "1.4rem" : "3px",
    width: "1.5rem",
    height: "1.5rem",
    backgroundColor: "white",
    borderRadius: "50%",
    transition: "left 0.3s ease-out",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
  };

  // 체크박스는 숨김 처리
  const checkboxStyle = {
    display: "none"
  };

  return (
    <div style={{ transform:"translateY(20%)"}}>
      <input 
        type="checkbox" 
        id={id}
        checked={isOn}
        onChange={() => setIsOn(!isOn)}
        style={checkboxStyle} 
      />
      <label 
        htmlFor={id}
        style={labelStyle}
      >
        <span style={circleStyle}></span>
      </label>
      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
      </span>
    </div>
  );
}

export default Toggle;