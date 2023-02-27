/* eslint-disable @typescript-eslint/restrict-template-expressions */
import logo from "../../assets/Logo.svg";
import "./DemoNav.css";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { RxDropdownMenu as Hamburger } from "react-icons/rx";

const NavBarHome = () => {
	const [showNavbar, setShowNavbar] = useState(false);

	const handleShowNavbar = () => {
		setShowNavbar(!showNavbar);
	};

	return (
		<nav className="demo_navbar">
			<div className="demo_container">
				<div className="demo_logo">
					{/* <Brand /> */}
					<NavLink style={{ textDecoration: "none" }} to="/riders-dashboard">
						<img src={logo} />
					</NavLink>
					<span>
						<NavLink
							style={{ textDecoration: "none", color: "#081f87" }}
							to="/riders-dashboard"
						>
							klaus <br /> Cabz
						</NavLink>
					</span>
				</div>
				<div className="demo_menu-icon" onClick={handleShowNavbar}>
					<Hamburger style={{ fontSize: "40px" }} />
				</div>
				<div className={`nav-elements  ${showNavbar && "active"}`}>
					<ul className="ul-names"> 
						<li>
							<NavLink style={{ textDecoration: "none" }} to="/">
								<p>Home</p>
							</NavLink>
						</li>
						<li>
							<NavLink to="/about"><p>About us</p></NavLink>
						</li>
						<li>
							<NavLink to="/services"><p>Services</p></NavLink>
						</li>
						<li style={{ width: "100px" }}>
							<NavLink to="/contac-us"><p>Contact Us</p></NavLink>
						</li>
						<li>
							{/* <ReactSwitch checked={checked} onChange={handleChange} /> */}
						</li>

						<li className="li_moblile_s li_mobile_home">
							<NavLink to="/login"><p>Login</p></NavLink>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default NavBarHome;
