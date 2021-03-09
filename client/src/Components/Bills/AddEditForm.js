import React, { Component } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Axios from "axios";
import moment from "moment";
import { notify } from "react-notify-toast";

export default class AddEditForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dueDate: moment().add(10, "d").format("YYYY-MM-DD"),
      clientId: "",
      name: "",
      plan: "",
      price: 0,
      priceText: "",
      month: moment().add(10, "d").format("YYYY-MM"),
      additionalNotes: "",
      partial: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      if (this.props.selectedClient) {
        this.setState({
          clientId: this.props.selectedClient._id,
          name: this.props.name,
          plan: this.props.plan,
          price: this.props.selectedClient.price,
          priceText: this.props.selectedClient.priceText,
        });
      }
    }
  }

  handleChange = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  onSubmit = (e) => {
    e.preventDefault();

    Axios.post("/api/bills/create", { ...this.state, dueDate: moment(this.state.dueDate).endOf('day') }, { headers: { "auth-token": localStorage.getItem("token") }, })
      .then((i) => {
        if (i.data.success) {
          notify.show(i.data.message, "success");
          this.props.refresh();
          this.props.askToPrint(i.data.id);
          this.props.onHide();
        } else {
          notify.show(i.data.message, "error");
        }
      })
      .catch((err) => notify.show(err.message, "error"));
  };

  render() {
    let req = <small className="text-danger font-weight-bold">*</small>;

    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Form onSubmit={this.onSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Registrar un pago</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Cliente</Form.Label>
              <Form.Control as="select" required value={this.state.clientId} onChange={this.handleChange} name="clientId">
                <option value="">Seleccione un cliente...</option>
                {this.props.clientList.map((client) => (<option key={client._id} value={client._id}>{client.name}</option>))}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Check type="checkbox" label="Es pago parcial" checked={this.state.partial} onChange={() => this.setState((i) => ({ partial: !i.partial }))} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Fecha de vencimiento{req}</Form.Label>
              <Form.Control required type="date" value={this.state.dueDate} onChange={this.handleChange} name="dueDate" />
            </Form.Group>

            <Form.Group>
              <Form.Label>Precio{req}</Form.Label>
              <Form.Control
                required
                type="number"
                value={this.state.price}
                onChange={this.handleChange}
                name="price"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Precio (expresado verbalmente){req}</Form.Label>
              <Form.Control
                required
                type="text"
                value={this.state.priceText}
                onChange={this.handleChange}
                name="priceText"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Mes a cobrar{req}</Form.Label>
              <Form.Control
                required
                type="month"
                value={this.state.month}
                onChange={this.handleChange}
                name="month"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Notas adicionales</Form.Label>
              <Form.Control
                type="text"
                value={this.state.additionalNotes}
                onChange={this.handleChange}
                name="additionalNotes"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.onHide}>
              Cerrar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}
