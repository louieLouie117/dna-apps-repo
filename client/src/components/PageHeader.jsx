import React from 'react';
import logo from '../assets/img/logo.png'; // Adjust the path as needed

const PageHeader = () => (
    <div className="logo">
        <h1 className="hidden">Project DNA Apps</h1>
        <a href="/">
            <img src={logo} alt="Project DNA Logo" />
        </a>
    </div>
);

export default PageHeader;