import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
export default class NavigationBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "(No loggeado)",
      token: "",
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => this.updateData(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateData = () => {
    if (localStorage.getItem("token") !== this.state.token) {
      this.setState({ token: localStorage.getItem("token") });
      Axios.get("/api/user/getUserInfo", {
        headers: { "auth-token": localStorage.getItem("token") },
      }).then(({ data }) => this.setState({ ...data }, console.log("updated")));
    }
  };

  render() {
    return (
      <Navbar bg="primary" variant="dark" expand="lg">
        <Link to="/">
          <Navbar.Brand>Wi-Fi Net Client Manager</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Item>
              <Nav.Link href="/clients/list">Clientes Activos</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/clients/list-bajas">Clientes Dados de Baja</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/bills/list">Boletas</Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav className="ml-auto">
            <NavDropdown
              title={`Usuario: ${this.state.name}`}
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item>
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                Cambiar contraseña
              </NavDropdown.Item>
              <NavDropdown.Item href="/logout">
                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                Cerrar sesión
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
