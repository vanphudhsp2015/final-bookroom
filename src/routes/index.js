import React from 'react';
import { HomePage, CalenderInfoPage } from '../components/pages/home';
import { HomePage as HomeAdminPage, RoomPage, ProfilePage, UserPage, EventAdminPage } from '../components/pages/admin';
import { Route, Switch } from 'react-router-dom';
const Routes = () => (
    <Switch>
        <Route path="/" exact={true} component={HomePage}></Route>
        <Route path="/new" exact={true} component={CalenderInfoPage}></Route>
        <Route path="/admin/" exact={true} component={HomeAdminPage}></Route>
        <Route path="/admin/room" exact={true} component={RoomPage}></Route>
        <Route path="/admin/profile" exact={true} component={ProfilePage}></Route>
        <Route path="/admin/user" exact={true} component={UserPage}></Route>
        <Route path="/admin/event" exact={true} component={EventAdminPage}></Route>
        <Route path="/:calender/:date" exact={true} component={CalenderInfoPage}></Route>
        <Route path="/exception/:exception/:date" exact={true} component={CalenderInfoPage}></Route>
    </Switch>
);
export default Routes;