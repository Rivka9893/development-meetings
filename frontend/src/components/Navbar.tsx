import { NavLink } from "react-router-dom";

const links = [
    { to: "/", label: "Home", end: true },
    { to: "/about", label: "About", end: true },
    { to: "/meetings", label: "Meetings", end: true },
    { to: "/meetings/new", label: "Add Meeting", end: true },
];

export const Navbar = () => {
    return (
        <header className="glass topbar">
            <h1 className="brand">Development Meetings</h1>
            <nav className="nav-links">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) =>
                            `nav-link ${isActive ? "nav-link-active" : ""}`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>
        </header>
    );
};
