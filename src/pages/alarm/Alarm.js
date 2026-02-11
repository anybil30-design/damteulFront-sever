import React, {useState} from 'react';
import './styles/alarm.css';
import { FaRegHeart } from "react-icons/fa";

const Alarm = () => {
  const [toggle, setToggle] = useState('trade');
  return (
    <main>
      {/* 탭 서식은 MyBuynSell 참조 */}
      <section className='alarm'>
        <ul className='myTabMenu'>
          <li onClick={()=>setToggle('trade')}
            className={toggle == 'trade'?'active':''}>거래</li>
          <li onClick={()=>setToggle('event')}
            className={toggle == 'event'?'active':''}>나눔/이벤트</li>
        </ul>

        <div className='alarmList'>
          <FaRegHeart />
          <p>'사용자'님이 찜하신 물건 가격이 떨어졌어요!</p>
          <span>00:00</span>
        </div>
      </section>
    </main>
  );
};

export default Alarm;