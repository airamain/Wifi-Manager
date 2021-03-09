import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

export default class AskForPrint extends Component {
  print = () => {
    this.props.history.push(`/bills/print/${this.props.id}`);
    this.props.onHide();
  };

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Imprimir boleta</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Deseas imprimir / enviar por mail la boleta?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.onHide}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={this.print}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
