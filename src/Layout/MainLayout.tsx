import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header.tsx';

const MainLayout = () => {
  return (
    <div className="h-full w-full flex flex-col">
      {/* Add your header, navigation, etc. here */}
      <Header />
      <main>
        <Outlet />
      </main>
      {/* Add your footer here */}
    </div>
  );
};

export default MainLayout;
