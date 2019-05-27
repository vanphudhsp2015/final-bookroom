import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HeaderLayout, SiderLayout, FooterLayout } from '../../layouts/admin';
import { TableComponent } from '../../shared/admin';
import { requestGetUsers } from '../../../actions/user';

class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            views: 'LIST',
        }
    }
    componentDidMount() {
        this.props.requestGetUsers();
    }

    render() {
        const mainContent = () => {
            switch (this.state.views) {
                case "LIST":
                    return (
                        <TableComponent choice="USER" onChangerView={this.onChangerView} data={this.props.users} onDelete={this.onDelete}></TableComponent>
                    )

                default:
                    return (
                        <></>
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
                            {mainContent()}
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

        users: state.user.all,
    }
}
export default connect(mapStateProps, { requestGetUsers })(UserPage);
