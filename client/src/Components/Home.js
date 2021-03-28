import React, { Component } from "react";
import { Row, Col, Button, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";

export default class Home extends Component {
  componentDidMount() {
    const TOKEN = localStorage.getItem("token");

    if (TOKEN) {
      this.props.history.push("/clients/list-baja");
    } else {
      localStorage.removeItem("token");
      this.props.history.push("/");
    }
  }

  render() {
    return (
      <Row className="vh-100-minus">
        <Col />
        <Col
          md={4}
          className="my-auto w-auto py-3 text-center justify-content-center bg-light shadow rounded"
        >
          <Image
            className="mb-3"
            src={process.env.PUBLIC_URL + "/img/logo.png"}
            height={200}
          />

          <h1 className="lead">
            Necesitas estar logueado para ver el contenido de esta página
          </h1>
          <br />
          <Button
            variant="success"
            onClick={() => {
              this.props.history.push("/login");
            }}
          >
            <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
            Ingresar
          </Button>
        </Col>
        <Col />
      </Row>
    );
  }
}
