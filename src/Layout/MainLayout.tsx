import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header.tsx';

const MainLayout = () => {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Add your header, navigation, etc. here */}
      <Header />
      <div className="flex flex-col h-full w-full items-center justify-center dark:bg-black">
        <main>
          <Outlet />
        </main>
      </div>
      {/* Add your footer here */}
    </div>
  );
};

export default MainLayout;
