import React, { Component } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faUserEdit,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import moment from "moment";
import LoadingScreen from "../Layout/LoadingScreen";
import ModifyClientDetails from "./ModifyClientDetails";
import { notify } from "react-notify-toast";
import AddEditForm from "../Bills/AddEditForm";
import DeleteConfirmation from "./DeleteConfirmation";
import AskForPrint from "../Bills/AskForPrint";

export default class DetailClients extends Component {
  constructor(i) {
    super(i);
    this.state = {
      data: [],
      allClients: [],
      isLoading: true,
      addClientsModalShow: false,
      showBills: false,
      deleteConfirmationShow: false,
      modalState: {
        askToPrint: false,
      },
      idToPrint: "",
    };
  }

  componentDidMount() {
    this.getClientInfo();
  }

  getClientInfo = () => {
    const singleClient = Axios.get(
      `/api/clients/get/${this.props.match.params.id}`,
      { headers: { "auth-token": localStorage.getItem("token") } }
    );

    const allClients = Axios.get(`/api/clients/get/`, {
      headers: { "auth-token": localStorage.getItem("token") },
    });

    Axios.all([singleClient, allClients])
      .then(
        Axios.spread((...i) => {
          console.log(i);

          this.setState({
            data: i[0].data.data[0],
            allClients: i[1].data,
            isLoading: false,
          });
        })
      )
      .catch((err) => notify.show(err.message, "error"));
  };

  askToPrint = (id) => {
    this.setState((i) => ({
      modalState: { askToPrint: !i.modalState.askToPrint },
      idToPrint: id ? id : "",
    }));
  };

  render() {
    if (this.state.isLoading) {
      return <LoadingScreen />;
    }
    return (
      <>
        <DeleteConfirmation
          id={this.props.match.params.id}
          goHome={() => {
            this.props.history.push("/");
          }}
          show={this.state.deleteConfirmationShow}
          onHide={() =>
            this.setState((i) => ({
              deleteConfirmationShow: !i.deleteConfirmationShow,
            }))
          }
        />
        <AddEditForm
          show={this.state.showBills}
          onHide={() => {
            this.setState((i) => ({ showBills: !i.showBills }));
          }}
          refresh={this.getClientInfo}
          clientList={this.state.allClients}
          selectedClient={this.state.data}
          askToPrint={(i) => this.askToPrint(i)}
        />
        <AskForPrint
          {...this.props}
          show={this.state.modalState.askToPrint}
          onHide={this.askToPrint}
          id={this.state.idToPrint}
        />

        <ModifyClientDetails
          isEdit={true}
          clientToEdit={this.state.data}
          refresh={this.getClientInfo}
          notify={(message, type) => notify.show(message, type)}
          onHide={() => {
            this.setState((i) => ({
              addClientsModalShow: !i.addClientsModalShow,
            }));
          }}
          show={this.state.addClientsModalShow}
        />
        <Row className="mt-3">
          <Col md={4} className="shadow bg-light rounded p-3">
            <small className="text-muted text-uppercase">
              Nombre del cliente:
            </small>
            <h1 className="display-4 display-5">{this.state.data.name}</h1>
            <small className='text-danger'><strong>{this.state.data.unSubscribingDate ? "Cliente dado de baja" : ""}</strong></small>
          </Col>
          <Col md={3} />
          <Col
            className="shadow bg-light rounded p-3 text-center d-flex justify-content-center my-auto"
            style={{ height: 70 }}
          >
            <Button
              onClick={() => {
                this.setState((i) => ({
                  addClientsModalShow: !i.addClientsModalShow,
                }));
              }}
              size="sm"
              className="mr-2"
            >
              <FontAwesomeIcon icon={faFileInvoice} className="mr-2" />
              Editar cliente
            </Button>
            <Button
              onClick={() => {
                this.setState((i) => ({ showBills: !i.showBills }));
              }}
              size="sm"
              className="mr-2"
            >
              <FontAwesomeIcon icon={faUserEdit} className="mr-2" />
              Generar pago
            </Button>
            <Button
              size="sm"
              onClick={() =>
                this.setState((i) => ({
                  deleteConfirmationShow: !i.deleteConfirmationShow,
                }))
              }
              variant="danger"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              Eliminar cliente
            </Button>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={4} className="shadow bg-light rounded p-3">
            <small className="text-muted text-uppercase text-weigth-bold">
              Datos principales:
            </small>
            <ul className="mt-3">
              <li>
                <span className="text-muted">Dirección:</span>{" "}
                {this.state.data.address}
              </li>
              <li>
                <span className="text-muted">Teléfono:</span>{" "}
                {this.state.data.phone} /{" "}
                {this.state.data.phoneAlt ? this.state.data.phoneAlt : ""}
              </li>
              <li>
                <span className="text-muted">E-mail:</span>{" "}
                {this.state.data.email}
              </li>
              <li>
                <span className="text-muted">DNI:</span>{" "}
                {this.state.data.dni}
              </li>
            </ul>
          </Col>
          <Col className="shadow bg-light rounded p-3 ml-3 ">
            <small className="text-muted text-uppercase text-weigth-bold">
              Datos adicionales:
            </small>
            <ul className="mt-3">
              <li>
                <span className="text-muted">Fecha de alta:</span>{" "}
                {moment(this.state.data.inscriptionDate).format("L")}
              </li>
              <li>
                <span className="text-muted">Plan:</span> {this.state.data.plan}
              </li>
              <li>
                <span className="text-muted">Precio:</span> $
                {this.state.data.price}
              </li>
              <li>
                <span className="text-muted">Precio de instalación:</span> $
                {this.state.data.priceInstall}
              </li>
              <li>
                <span className="text-muted">Dirección IP:</span>{" "}
                {this.state.data.ipAddress}
              </li>
            </ul>

            <div
              className={this.state.unSubscribingDate ? "d-block" : "d-none"}
            >
              <small className="text-muted text-uppercase text-weigth-bold">
                Datos de baja:
              </small>
              <ul className="mt-3">
                <li>
                  <span className="text-muted">Fecha de baja:</span>{" "}
                  {moment(this.state.data.unSubscribingDate).format("L")}
                </li>
                <li>
                  <span className="text-muted">Motivo de baja:</span>{" "}
                  {this.state.data.unSubscribingReason}
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </>
    );
  }
}
