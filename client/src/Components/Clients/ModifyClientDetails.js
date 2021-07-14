import React, { Component } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import moment from "moment";
import Axios from "axios";
import { notify } from "react-notify-toast";

export default class AddClients extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      address: "",
      dni:"",
      inscriptionDate: "",
      plan: "",
      price: "",
      priceText: "",
      priceInstall: "",
      phone: "",
      phoneAlt: "",
      email: "",
      ipAddress: "",
      unSubscribingDate: "",
      unSubscribingReason: "",
      isDown: false,
      isSaving: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      if (this.props.clientToEdit) {
        let { clientToEdit } = this.props;

        this.setState({
          ...clientToEdit,
          inscriptionDate: moment(clientToEdit.inscriptionDate).format(
            "MM-DD-YYYY"
          ),
          unSubscribingDate: clientToEdit.unSubscribingDate
            ? moment(clientToEdit.unSubscribingDate).format("MM-DD-YYYY")
            : "",
        });
      }
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ isSaving: true });
    // Chequea si tiene que editar o guardar el cliente, si es el caso
    // se realiza un PUT.
    if (this.props.isEdit) {
      Axios.put(
        `/api/clients/edit/${this.props.clientToEdit._id}`,
        this.state,
        {
          headers: { "auth-token": localStorage.getItem("token") },
        }
      )
        .then((i) => {
          if (i.data.success) {
            notify.show(i.data.message, "success");
            this.clearInputs();
            this.props.refresh();
            this.props.onHide();
            this.setState({ isSaving: false });
          } else {
            notify.show(i.data.message, "error");
            this.setState({ isSaving: false });
          }
        })
        .catch((i) => {
          notify.show(i.message, "error");
          this.setState({ isSaving: false });
        });
    }

    // En caso de que no se edite, se realiza un POST
    else {
      Axios.post(`/api/clients/create`, this.state, {
        headers: { "auth-token": localStorage.getItem("token") },
      })
        .then((i) => {
          if (i.data.success) {
            notify.show(i.data.message, "success");
            this.clearInputs();
            this.props.refresh();
            this.props.onHide();
            this.setState({ isSaving: false });
          } else {
            notify.show(i.data.message, "error");
            this.setState({ isSaving: false });
          }
        })
        .catch((i) => {
          notify.show(i.message, "error");
          this.setState({ isSaving: false });
        });
    }
  };

  handleChange = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  clearInputs = () => {
    this.setState({
      name: "",
      address: "",
      dni:"",
      inscriptionDate: "",
      plan: "",
      price: "",
      priceText: "",
      priceInstall: "",
      phone: "",
      phoneAlt: "",
      email: "",
      ipAddress: "",
      unSubscribingDate: "",
      unSubscribingReason: "",
      isDown: false,
    });
  };

  render() {
    let requiredStar = (
      <small className="font-weight-bold text-danger">*</small>
    );

    return (
      <Modal size="lg" show={this.props.show} onHide={this.props.onHide}>
        <Form className="px-3" onSubmit={this.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {this.props.isEdit
                ? "Modificar un cliente."
                : "Agregar un cliente."}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Nombre {requiredStar}</Form.Label>
              <Form.Control
                value={this.state.name}
                onChange={this.handleChange}
                type="text"
                name="name"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Domicilio {requiredStar}</Form.Label>
              <Form.Control
                value={this.state.address}
                onChange={this.handleChange}
                type="text"
                name="address"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>DNI {requiredStar}</Form.Label>
              <Form.Control
                value={this.state.dni}
                onChange={this.handleChange}
                type="text"
                name="dni"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Fecha de alta {requiredStar}</Form.Label>
              <Form.Control
                value={this.state.inscriptionDate}
                onChange={this.handleChange}
                type="date"
                name="inscriptionDate"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Plan {requiredStar}</Form.Label>
              <Form.Control
                value={this.state.plan}
                onChange={this.handleChange}
                as="select"
                name="plan"
                required
              >
                <option value="">Seleccione una opción</option>
                <option>3MB</option>
                <option>5MB</option>
                <option>10MB</option>
                <option>15MB</option>
                <option>20MB</option>
                <option>30MB</option>
                <option>50MB</option>
                <option>80MB</option>
                <option>100MB</option>
                <option>150MB</option>
                <option>200MB</option>
                <option>250MB</option>
                <option>300MB</option>
                <option>350MB</option>
                <option>400MB</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Precio {requiredStar}</Form.Label>
              <Form.Control
                value={this.state.price}
                onChange={this.handleChange}
                type="number"
                name="price"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Precio (Expresado en letras) {requiredStar}
              </Form.Label>
              <Form.Control
                value={this.state.priceText}
                onChange={this.handleChange}
                type="text"
                name="priceText"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Precio de instalación</Form.Label>
              <Form.Control
                value={this.state.priceInstall}
                onChange={this.handleChange}
                type="text"
                name="priceInstall"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Teléfono {requiredStar}</Form.Label>
              <Form.Control
                value={this.state.phone}
                onChange={this.handleChange}
                type="text"
                name="phone"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Teléfono (Alternativo)</Form.Label>
              <Form.Control
                value={this.state.phoneAlt}
                onChange={this.handleChange}
                type="text"
                name="phoneAlt"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={this.state.email}
                onChange={this.handleChange}
                type="email"
                name="email"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Dirección IP</Form.Label>
              <Form.Control
                value={this.state.ipAddress}
                onChange={this.handleChange}
                type="text"
                name="ipAddress"
              />
            </Form.Group>

            <Form.Group>
              <Form.Check
                checked={this.state.isDown}
                onChange={() => {
                  this.setState((i) => ({ isDown: !i.isDown }));
                }}
                type="checkbox"
                label="¿Dado de baja?"
              />
            </Form.Group>

            <div className={this.state.isDown ? "d-block" : "d-none"}>
              <Form.Group>
                <Form.Label>Fecha de baja</Form.Label>
                <Form.Control
                  value={this.state.unSubscribingDate}
                  onChange={this.handleChange}
                  type="date"
                  name="unSubscribingDate"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Razón de baja</Form.Label>
                <Form.Control
                  value={this.state.unSubscribingReason}
                  onChange={this.handleChange}
                  type="text"
                  name="unSubscribingReason"
                />
              </Form.Group>
            </div>

            <Modal.Footer>
              <Button variant="secondary" onClick={this.props.onHide}>
                Cerrar
              </Button>
              <Button
                disabled={this.state.isSaving}
                type="submit"
                variant="primary"
              >
                Guardar
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </Form>
      </Modal>
    );
  }
}
