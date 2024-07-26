import { ErrorBoundary } from '@/components/common/error'
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { ThemeProvider } from "./components/common/theme-provider"
import { useAccessStore } from '@/store';
import Authentication from '@/components/user/authentication';
import { hasPagePermission, routers } from '@/router';
import NotFoundPage from '@/components/common/404';
import { Path } from './constant';
import { SideMenu } from './components/menu/side-menu';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Screen />
      </Router>
    </ErrorBoundary>
  )
}

function Screen() {
  const access = useAccessStore();
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {access.isAuthorized() ? (
        <div className="flex">
          <SideMenu />
          <div className="h-screen w-full">
            <Routes>
              {routers.flatMap(router => {
                return hasPagePermission(router, access) ? [<Route {...router.routeProps} key={router.itemKey} />] : [];
              })}
              {/* Landing page */}
              <Route path={Path.Base} element={<Navigate to={Path.Dashboard} />} />
              {/* Default page */}
              <Route path="*" element={<NotFoundPage />} key={"*"} />
            </Routes>
          </div>
        </div>
      ) : (
        <Authentication />
      )}
      <Toaster />
    </ThemeProvider>
  );
}


export default App