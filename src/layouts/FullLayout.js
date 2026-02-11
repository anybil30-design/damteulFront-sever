import React from 'react';
import { Outlet } from 'react-router-dom';

const FullLayout = () => {
  return (
    <div className='bodyParent'>
      <div className='bodyChild'>
        {/* 헤더와 푸터 없이 내용만 렌더링 */}
        <Outlet />
      </div>
    </div>
  );
};

export default FullLayout;