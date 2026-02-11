import React from 'react';
import { Outlet } from 'react-router-dom';

import AllowHeader from '../components/header/AllowHeader'

const NoTabsLayout = () => {
  return (
    <div className='bodyParent'>
      <div className='bodyChild'>
        {/* 뒤로가기버튼 헤더가 있는 */}
        <AllowHeader />
        
        <Outlet />
      </div>
    </div>
  );
};

export default NoTabsLayout;