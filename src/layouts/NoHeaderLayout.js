import React from 'react';
import { Outlet } from 'react-router-dom';

import HaveNavi from '../components/nav/HaveNavi'

const NoHeaderLayout = () => {
  return (
    <div className='bodyParent'>
      <div className='bodyChild'>
      {/* 헤더가 없는 */}
      
      <Outlet />
      
      {/* 푸터가 있는 */}
      <HaveNavi />
      </div>
    </div>
  );
};

export default NoHeaderLayout;