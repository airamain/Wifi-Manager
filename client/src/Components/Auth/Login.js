import React, { Component } from "react";
import { Row, Col, Button, Card, Form, Image } from "react-bootstrap";
import Axios from "axios";
import { notify } from "react-notify-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";

export default class Home extends Component {
  state = {
    email: "",
    password: "",
  };

  handleChange = (obj) => {
    let { name, value } = obj.target;
    this.setState({ [name]: value });
  };

  onSubmit = (obj) => {
    obj.preventDefault();
    Axios.post("/api/user/login", { ...this.state })
      .then((res) => {
        this.setState({ id: res.data.id });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({ username: res.data.name, id: res.data.id })
        );
        notify.show(res.data.message, "success");
        this.props.history.push("/");
        this.setState({ loading: false });
      })
      .catch((err) => {
        console.log(err.response.status);
        if (err.response.status === 400) {
          notify.show("Email o contraseña incorrecta.", "error");
        } else {
          console.log("Hubo un problema grave");
          notify.show("err.response", "error");
        }
      });
  };

  render() {
    return (
      <Row className="vh-100-minus">
        <Col md={5} className="my-auto justify-content-center">
          <Card className="p-4 shadow rounded">
            <Form onSubmit={this.onSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Dirección de correo</Form.Label>
                <Form.Control
                  value={this.state.email}
                  name="email"
                  onChange={this.handleChange}
                  type="email"
                  placeholder="Ingrese la dirección de correo"
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  type="password"
                  placeholder="********"
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                Ingresar
              </Button>
            </Form>
          </Card>
        </Col>
        <Col className="my-auto text-center justify-content-center">
          {/* <h1 className="display-4">WiFi Net</h1> */}
          <Image src={process.env.PUBLIC_URL + "/img/logo.png"} height={300} />
        </Col>
      </Row>
    );
  }
}
