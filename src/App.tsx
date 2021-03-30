import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { RootState } from './feature';
import { userLoginActions } from './feature/usersignin/userloginService';
import UserLogin from './feature/usersignin/UserLogin';
import UserJoin from './feature/userjoin/UserJoin';
import MainPage from './feature/mainpage/MainPage';
import Rank from './feature/rank/Rank';

// 라우팅
// Islogin
const App: React.FC = () => {
  const isLogin = useSelector((state: RootState) => state.userLogin.isLogin);
  // const dispatch = useDispatch();
  // dispatch(actions.setDarkmode({ darkmode: true }));
  return (
    <Switch>
      <Route exact path="/join" component={UserJoin} />
      <Route exact path="/login" component={UserLogin} />
      <Route
        exact
        path="/main"
        render={() => {
          if (!isLogin) {
            return <Redirect to="/login" />;
          }
          return <MainPage />;
        }}
      />
      <Route exact path="/rank" component={Rank} />
      <Route
        path="/"
        render={() => {
          if (!isLogin) {
            return <Redirect to="/login" />;
          }
          return <MainPage />;
        }}
      />
    </Switch>
  );
}

export default App;
