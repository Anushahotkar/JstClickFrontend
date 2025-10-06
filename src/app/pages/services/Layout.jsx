// src/app/pages/services/Layout.jsx

import { Outlet } from "react-router";
import { Page } from "components/shared/Page";
import { Header } from "app/layouts/MainLayout/Header";
import { Sidebar } from "app/layouts/MainLayout/Sidebar";

export default function ServicesLayout() {
  return (
    <Page title="Services">
      <Header />
      <main className="main-content">
    
          {/* All child service pages will render here */}
          <Outlet />
       
      </main>
      <Sidebar />
    </Page>
  );
}
