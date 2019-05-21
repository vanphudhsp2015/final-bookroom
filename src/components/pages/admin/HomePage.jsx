import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HeaderLayout, SiderLayout } from '../../layouts/admin';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
const cookies = new Cookies();
// import { DashboardComponent } from '../../shared/admin';
class HomePage extends Component {
    render() {
        if (cookies.get('data') !== undefined) {
            if (cookies.get('data').attributes.roles[0] !== 'super_admin') {
                return (
                    <Redirect to="/"></Redirect>
                )
            }
        }

        return (
            <div className="wrapper">
                <HeaderLayout></HeaderLayout>
                <section className="b-dashboard-content">
                    <SiderLayout></SiderLayout>
                    <div className="right-content">
                        <div className="container-fluid">

                        </div>
                    </div>

                </section>

            </div>
        );
    }
}

function mapStateProps(state) {
    return {

    }
}
export default connect(mapStateProps, {})(HomePage);