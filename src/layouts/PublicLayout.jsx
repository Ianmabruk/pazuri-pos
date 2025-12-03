import React from 'react';
import { Outlet } from 'react-router-dom';
import SiteNavbar from '../components/layout/SiteNavbar';
import SiteFooter from '../components/layout/SiteFooter';

export default function PublicLayout() {
  return (
    <div style={{minHeight:'100vh', display:'flex', flexDirection:'column'}}>
      <SiteNavbar />
      <main style={{flex:1}}>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
