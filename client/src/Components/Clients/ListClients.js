import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ListGroup, Row, Col } from "react-bootstrap";
import Axios from "axios";

import { notify } from "react-notify-toast";
import LoadingScreen from "../Layout/LoadingScreen";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";

import SearchBox from "./SearchBox";
import Pagination from "../Layout/Pagination";
import ModifyClientDetails from "./ModifyClientDetails";

export default class ListClients extends Component {
  state = {
    fullClientsList: [],
    afterPaginationClientsList: [],
    activeClients: 0,
    addClientsModalShow: false,
    isLoading: true,
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    Axios.get("/api/clients/get", {
      headers: { "auth-token": localStorage.getItem("token") },
    })
      .then(({ data }) => {
        data = data.filter(element => element.unSubscribingDate === null);
        data =  data.sort ((a, b) => a.name.localeCompare (b.name));
        this.setState({
          fullClientsList: data,
          activeClients: data.filter(i => !Boolean(i.unSubscribingDate)).length,
          isLoading: false,
        });
      })
      .catch((err) => {
        notify.show("Hubo un error, vuelva a ingresar.", "error");
        localStorage.removeItem("token");
        this.props.history.push("/");
      });
  };

  onChangePage = (afterPaginationClientsList) => {
    this.setState({ afterPaginationClientsList });
  };

  render() {
    if (this.state.isLoading) {
      return <LoadingScreen />;
    } else {
      return (
        <>
          {/* Modal para agregar clientes */}

          <ModifyClientDetails
            isEdit={false}
            refresh={this.getData}
            notify={(message, type) => notify.show(message, type)}
            onHide={() => {
              this.setState((i) => ({
                addClientsModalShow: !i.addClientsModalShow,
              }));
            }}
            show={this.state.addClientsModalShow}
          />

          {/* Caja de búsqueda */}
          <h5 className="m-0 p-1 text-success">
            <i > (Clientes activos: {this.state.activeClients})</i>
          </h5>

          <Row>
            <Col className="p-3 mt-3 bg-light rounded shadow">
              <SearchBox
                setResults={(e) => this.setState({ fullClientsList: e })}
                refresh={this.getData}
              />
            </Col>
          </Row>
          <p className="m-1 p-1 bg-light text-success text-center" >
                    Agregar Cliente
                    <FontAwesomeIcon
                      className="ml-2 text-info"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        this.setState((i) => ({
                          addClientsModalShow: !i.addClientsModalShow,
                        }))
                      }
                      icon={faPlusSquare}
                    />
                  </p>

          {/* Lista de clientes */}

          <Row>
            <Col className="p-3 my-3 bg-light rounded shadow">
              <Row className="px-3 mb-3">
                <Col>
                 
                  <p className="m-0 p-0">
                    Nombre y Apellido
                   
                  </p>
                </Col>
                <Col>
                  <p className="m-0 p-0 text-left">Dirección</p>
                </Col>
                <Col md={2}>
                  <p className="m-0 p-0 text-right">Plan</p>
                </Col>
                <Col md={1}>
                  <p className="m-0 p-0 text-right">Precio</p>
                </Col>
              </Row>
              <ListGroup>
                {this.state.afterPaginationClientsList.map((i) => (
                  <Link
                    className="text-decoration-none text-dark"
                    key={i._id}
                    to={`/clients/details/${i._id}`}
                  >
                    <ListGroup.Item className={i.unSubscribingDate ? 'text-danger' : null}>
                      <Row>
                        <Col>
                          <p className="m-0 p-0">{`${i.name} ${i.unSubscribingDate ? ' (dado de baja)' : ""}`}</p>
                        </Col>
                        <Col>
                          <p className="m-0 p-0">{`${i.address} `}</p>
                        </Col>
                        <Col md={2}>
                          <p className="m-0 p-0 text-right">{i.plan}</p>
                        </Col>
                        <Col md={1}>
                          <p className="m-0 p-0 text-right">${i.price}</p>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </Link>
                ))}
              </ListGroup>
            </Col>
          </Row>
          <Row>
            <Col className="p-3 mb-3 bg-light rounded shadow d-flex justify-content-center">
              <Pagination
                items={this.state.fullClientsList}
                onChangePage={this.onChangePage}
                pageSize={5}
              />
            </Col>
          </Row>
        </>
      );
    }
  }
}
