import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import Axios from "axios";
import { notify } from "react-notify-toast";

export default class DeleteConfirmation extends Component {
  deleteClient = () => {
    Axios.delete(`/api/clients/delete/${this.props.id}`, {
      headers: { "auth-token": localStorage.getItem("token") },
    }).then((i) => {
      if (i.data.success) {
        notify.show(i.data.message, "success");
        this.props.goHome();
      } else {
        notify.show(i.data.message, "error");
        this.props.onHide();
      }
    });
  };

  render() {
    return (
      <Modal centered show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Borrar cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Seguro que querés borrar el cliente?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.props.onHide}>
            Cerrar
          </Button>
          <Button variant="danger" onClick={this.deleteClient}>
            Borrar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
