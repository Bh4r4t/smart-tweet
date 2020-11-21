import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/head.styles.css";
import { Layout } from "antd";
import logo from '../assets/logo/logo.png';

const { Header } = Layout;


function Head() {
  return (
    <div className="header-wrapper">
      <Header>
        <Link to="/">
          <img src={logo} className="logo" alt='Smart Tweet' />
        </Link>
      </Header>
    </div>
  );
}

export default Head;

