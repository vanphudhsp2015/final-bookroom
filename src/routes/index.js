import React from 'react';
import {
  HomePage,
  CalenderInfoPage
} from '../components/pages/home';
import {
  RoomPage,
  UserPage,
  EventAdminPage
} from '../components/pages/admin';
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    cookies.get('data') !== undefined
      ?
      cookies.get('data').attributes.roles[0] === 'super_admin' ?
        <Component {...props} /> : <Redirect to='/' />
      : <Redirect to='/' />
  )} />
)
const Routes = () => (
  <Switch>
    <Route path="/" exact={true} component={HomePage}></Route>
    <Route path="/new" exact={true} component={CalenderInfoPage}></Route>
    <PrivateRoute path="/admin/room" exact={true} component={RoomPage}></PrivateRoute>
    <PrivateRoute path="/admin/user" exact={true} component={UserPage}></PrivateRoute>
    <PrivateRoute path="/admin/event" exact={true} component={EventAdminPage}></PrivateRoute>
    <Route path="/:calender/:date" exact={true} component={CalenderInfoPage}></Route>
    <Route path="/exception/:exception/:date" exact={true} component={CalenderInfoPage}></Route>
  </Switch>
);
export default Routes;
