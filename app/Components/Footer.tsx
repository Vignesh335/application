import React from 'react';

const Footer = () => {
  return (
    <footer style={{ marginTop: '25px' }}>
      <div className="container foot-cont">
        <div className="col-sm-4">
          <b>About Us</b>
          <p>
            Slom Social Awareness Foundation Trust is for the purpose of carrying out the objects
            hereinafter set out without any distinction of caste, color or creed. It has no profit motive. With the
            sole
            aim of involving in social charitable, religious, promotional, educational and cultural.
          </p>
        </div>
        <div className="col-sm-3">
          <b>Address</b>
          <p style={{ fontSize: '15px' }}>Slom<br />
            {"{FLOOR, Building}"} <br />
            {"{LANDMARK, VILLAGE,}"} <br />
            {'{DISTRICT, TAMILNADU }'}<br />
            email:{"EMAIL"}
            <br />
          </p>
        </div>
        <div className="col-sm-5 scmsug">
        </div>
      </div>
      <div className=" smarti">
        <div className="container">
          <p>All Rights Reserved © Slom
            <i className="fa fa-twitter fico-s hidden-xs"></i>
            <i className="fa fa-pinterest-p fico-s hidden-xs"></i>
            <i className="fa fa-google-plus fico-s hidden-xs"></i>
            <i className="fa fa-facebook fico-s hidden-xs"></i>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;