import { Routes, Route } from 'react-router-dom';
import Home from 'src/pages/common/home';
import UserDetails from 'src/pages/common/userDetails';

export function MainRoutes() {
  return (
    <Routes>
      <Route path="/" Component={Home} />
      <Route path="/details/:login" Component={UserDetails} />
    </Routes>
  );
}
