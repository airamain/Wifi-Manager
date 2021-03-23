import React, { Component } from "react";
import { Form, Col, Button } from "react-bootstrap";
import Axios from "axios";

export default class SearchBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      address: "",
    };
  }

  cleanInputs = () => {
    this.setState({
      name: "",
      address: "",
    });
    this.props.refresh();
  };

  handleChange = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
    Axios.post(`/api/clients/search`, this.state, {
      headers: { "auth-token": localStorage.getItem("token") },
    }).then(({ data }) => this.props.setResults(data.data)); 
  };

  onSubmit = (e) => {
    e.preventDefault();
    Axios.post(`/api/clients/search`, this.state, {
      headers: { "auth-token": localStorage.getItem("token") },
    }).then(({ data }) => this.props.setResults(data.data));
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Row>
          <Form.Group as={Col} className="my-auto" controlId="name">
            <Form.Control
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
              placeholder="Nombre"
            />
          </Form.Group>

          <Form.Group as={Col} className="my-auto" controlId="address">
            <Form.Control
              type="text"
              name="address"
              value={this.state.address}
              onChange={this.handleChange}
              placeholder="Dirección"
            />
          </Form.Group>

          <Col className="my-auto text-right" md="3">
            <Button variant="primary" type="submit">
              Buscar
            </Button>

            <Button
              variant="danger"
              onClick={this.cleanInputs}
              className="ml-3"
            >
              Limpiar búsqueda
            </Button>
          </Col>
        </Form.Row>
      </Form>
    );
  }
}
