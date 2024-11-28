import React from "react";
import Header from "./_components/Header";

function DashboardLayout({ children }) {
  return (
    <div>
      <Header />
      <div className="pt-20 px-10 md:px-20 lg:px-40 xl:px-60 2xl:px-96">
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
