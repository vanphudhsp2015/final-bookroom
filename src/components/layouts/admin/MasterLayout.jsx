import React, { Component } from 'react';
import HeaderLayout from './HeaderLayout';
import FooterLayout from './FooterLayout';
import SiderLayout from './SiderLayout';
class MasterLayout extends Component {
  render() {
    const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {}))
    return (
      <div className="wrapper">
        <HeaderLayout></HeaderLayout>
        <section className="b-dashboard-content">
          <SiderLayout></SiderLayout>
          <div className="right-content">
            <div className="container-fluid">
              {childrenWithProps}
            </div>
            <FooterLayout></FooterLayout>
          </div>
        </section>

      </div>
    );
  }
}

export default MasterLayout;
