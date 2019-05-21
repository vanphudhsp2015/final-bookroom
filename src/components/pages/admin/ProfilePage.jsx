import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HeaderLayout, FooterLayout, SiderLayout } from '../../layouts/admin';
import { ProfileComponent } from '../../shared/admin';

class ProfilePage extends Component {
    render() {
        return (
            <div className="wrapper">
                <HeaderLayout></HeaderLayout>
                <section className="b-dashboard-content">
                    <SiderLayout></SiderLayout>
                    <div className="right-form">
                        <div className="container-fluid">
                            <ProfileComponent></ProfileComponent>
                        </div>
                        <FooterLayout></FooterLayout>
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
export default connect(mapStateProps, {})(ProfilePage);