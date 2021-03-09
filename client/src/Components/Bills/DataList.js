import React, { Component } from "react";
import { ListGroup, Row, Col, Button, Modal } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPrint } from "@fortawesome/free-solid-svg-icons";

import { notify } from 'react-notify-toast'

import Axios from 'axios'
import moment from "moment";

export default class DataList extends Component {

  state = {
    showDeleteModal: false,
    deleteModalId: ""
  }

  handleBillDelete = () => {
    const HEADERSCONFIG = { headers: { "auth-token": localStorage.getItem("token") } }

    Axios.delete(`/api/bills/deleteBill/${this.state.deleteModalId}`, HEADERSCONFIG)
      .then(({ data }) => {
        if (data.success) { this.setState({ showDeleteModal: false }, () => { this.props.refresh(); notify.show(data.message, 'success'); }) }
        else { this.setState({ showDeleteModal: false }, () => { this.props.refresh(); notify.show(data.message, 'error'); }) }
      }).catch(err => { this.setState({ showDeleteModal: false }, () => { this.props.refresh(); notify.show(err.message, 'error'); }) })
  }

  render() {
    return (
      <>
        <Modal centered show={this.state.showDeleteModal} onHide={() => { this.setState(i => ({ showDeleteModal: !i.showDeleteModal })) }}>
          <Modal.Header closeButton><Modal.Title>Borrar boleta</Modal.Title></Modal.Header>
          <Modal.Body>Estas a punto de borrar una boleta, ¿seguro que deseas continuar? </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { this.setState(i => ({ showDeleteModal: !i.showDeleteModal })) }}>Cerrar</Button>
            <Button variant="danger" onClick={this.handleBillDelete}>Save Changes</Button>
          </Modal.Footer>
        </Modal>

        <div className="mt-3 p-3 bg-light shadow rounded">
          <ListGroup>
            <Row>
              <Col>
                <Button className='w-100' onClick={() => this.props.addBill()}>Registrar pago</Button>
              </Col><Col>
                <Button className='w-100' onClick={() => { this.props.history.push('/bills/printAll') }}>Imprimir boletas para todos los clientes</Button>
              </Col>
            </Row>
            <ListGroup.Item className="mt-3 lead" active>
              <Row>
                <Col>Nombre</Col>
                <Col className="text-center">Fecha</Col>
                <Col className="text-center">Plan</Col>
                <Col className="text-right">Monto</Col>
                <Col md={2} className="text-right">Vence</Col>
                <Col md={1} className="text-center" />
              </Row>
            </ListGroup.Item>
            {this.props.data.map((i) => {
              const client = this.props.clientList.filter((cl) => cl._id === i.clientId)[0];

              return (
                <ListGroup.Item key={Math.random()} variant={i.partial ? "info" : "light"}>
                  <Row>
                    <Col className="text-truncate">{client.name}</Col>
                    <Col className="text-center">{moment(i.createdAt).format("L")}</Col>
                    <Col className="text-center">{client.plan}</Col>
                    <Col className="text-right">${i.price}</Col>
                    <Col md={2} className="text-right">{moment(i.dueDate).fromNow()}</Col>
                    <Col md={1} className="text-center">
                      <FontAwesomeIcon className='text-danger' style={{ cursor: "pointer" }} onClick={() => { this.setState({ deleteModalId: i._id, showDeleteModal: true }); }} icon={faTrash} />
                      <FontAwesomeIcon className='text-info ml-2' style={{ cursor: "pointer" }} onClick={() => { this.props.history.push(`/bills/print/${i._id}`); }} icon={faPrint} />
                    </Col>
                  </Row>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      </>
    );
  }
}
