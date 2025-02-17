import React from 'react';

const Header = () => {
  return (
    <header className="hidden-xs">
      <nav className="navmenu">
        <div style={{ margin: 'auto' }}>
          <div className="nav-content shado-1">
            <div className="container">
              <div style={{ height: '94px', overflow: 'hidden' }} className="col-md-4 col-sm-12">
                <img style={{ width: '90px', height: '70px' }} className="logo" src="/assets/images/logo.jpg" alt="logo" />
                <h1 style={{ width: '70%' }}>PSR WORLD</h1>
                <b style={{ marginLeft: '4px' }}></b>
              </div>
              <div style={{ height: '94px', overflow: 'hidden' }} className="hidden-sm">
                <button data-toggle="modal" data-target="#myModal" className="btn btn-sm btn-donat">
                  <i className="fa fa-inr"></i> Donate Now
                </button>
                <ul className="top-right">
                  <li><i className="fa fa-linkedin-square"></i></li>
                  <li><i className="fa fa-google-plus-square"></i></li>
                  <li><i className="fa fa-tumblr-square"></i></li>
                  <li><i className="fa fa-instagram"></i></li>
                  <li className="bll-o"><i className="fa fa-facebook-square"></i></li>
                </ul>
                <div className="exu">
                  <i className="fa fa-phone"></i> : {"PhoneNo"}
                  <i className="fa fa-navicon smal-menu-ico cp"></i>
                  <i style={{ marginLeft: '30px' }} className="fa fa-envelope"></i> : {"email"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="header-top shado-6">
        <div style={{ zIndex: 999999 }} className="container">
          <ul className="top-left">
            <li className="rit-border"> Donate </li>
            <li className="rit-border"> Join Volunteer </li>
            <li> 9159449499 </li>
          </ul>
          <ul className="top-right">
            <li><i className="fa fa"></i></li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;