import React, { Component } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";

export default class LoadingScreen extends Component {
  render() {
    return (
      <Row className="d-flex vh-100-minus align-items-center justify-content-center">
        <Col md={3}>
          <Card className="p-4 text-center  shadow">
            <span>
              <Spinner animation="border" variant="primary" size="xl" />
            </span>
            <p className="mt-3 mb-0 lead">Cargando</p>
          </Card>
        </Col>
      </Row>
    );
  }
}
