import { Outlet } from "react-router";
import styles from "./MainLayout.module.css";

function MainLayout() {
  return (
    <>
      <div className={styles.wrapper}>
        <header>
          <h1 className="text-center bold text-header bg-white">Todo App</h1>
        </header>
        <div className={styles.outletContainer}>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default MainLayout;
