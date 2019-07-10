import React, { Component } from 'react';
class DescriptionComponent extends Component {
  render() {
    return (
      <div className="b-page-description">
        <div className="b-heading">
          <h2 className="b-text-title">
            Mô Tả
          </h2>
        </div>
        <div className="b-content">
          <div className="b-content-block">
            <p className="b-text-norm">
              Của Tôi
            </p>
          </div>
          <div className="b-content-right">
            <div className="b-shape" />
          </div>
        </div>
      </div>
    );
  }
}
export default DescriptionComponent;
