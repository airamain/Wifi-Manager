import React, { Component } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  Accordion,
  Card,
} from "react-bootstrap";
import Axios from "axios";

export default class SearchBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dateFrom: "",
      dateTo: "",
    };
  }

  onSubmit = (e) => {
    e.preventDefault();

    Axios.post(`/api/bills/search`, this.state, {
      headers: { "auth-token": localStorage.getItem("token") },
    })
      .then(({ data }) => this.props.setResults(data.data))
      .catch((err) => alert(err.message));
  };

  clean = () => {
    this.setState({
      dateFrom: "",
      dateTo: "",
    });
    this.props.refresh();
  };

  handleChange = (e) => {
    let { name, value } = e.target;

    this.setState({ [name]: value });
  };

  render() {
    return (
      <Row className="bg-light shadow rounded mt-3">
        <Col className="p-3">
          <Accordion>
            <Card>
              <Accordion.Toggle
                as={Card.Header}
                style={{ cursor: "pointer" }}
                eventKey="0"
              >
                <p className="lead m-0 p-0">Búsqueda</p>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Form onSubmit={this.onSubmit}>
                  <Card.Body>
                    <Row>
                      <Form.Group as={Col}>
                        <InputGroup>
                          <InputGroup.Prepend><InputGroup.Text>Desde</InputGroup.Text></InputGroup.Prepend>
                          <Form.Control type="date" name="dateFrom" value={this.state.dateFrom} onChange={this.handleChange} />
                        </InputGroup>
                      </Form.Group>
                      <Form.Group as={Col}>
                        <InputGroup>
                          <InputGroup.Prepend><InputGroup.Text>Hasta</InputGroup.Text></InputGroup.Prepend>
                          <Form.Control type="date" name="dateTo" value={this.state.dateTo} onChange={this.handleChange} />
                        </InputGroup>
                      </Form.Group>
                    </Row>
                    <Row>
                      <Col className="text-right">
                        <Button type="submit">Buscar</Button>
                        <Button onClick={this.clean} className="ml-3" variant="secondary">Limpiar</Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Form>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Col>
      </Row>
    );
  }
}
