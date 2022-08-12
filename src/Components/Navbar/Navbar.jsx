import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom';

export default function Navbar({crrUser , removeUser}) {
    
return <>
<nav className="navbar navbar-expand-sm navbar-dark">
<div className="container w-75">
    <a className="navbar-brand" href="#"><i className="fa-solid fa-note-sticky"></i> Notes</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center mt-2 py-2">
        {
            crrUser?
            <>
                <li className="nav-item">
                    <p className="text-warning userName d-inline" >{crrUser.first_name + " " + crrUser.last_name + " "}</p>
                </li>
                <li className="ms-2 nav-item logout">
                    <a className="nav-link" aria-current="page" href="#" onClick={ removeUser }>Logout</a>
                </li>
            </>
            
            :
            <>
                <li className="nav-item  me-3 text-white login">
                    <Link to='login' className="dropdown-item" href="#">Log in</Link>
                </li>
                <li className="nav-item text-white">
                    <Link to='signup' className="dropdown-item" href="#">Sign up</Link>
                </li>
            </>
        }
        
    </ul>

    </div>
</div>
</nav>
</>
}
