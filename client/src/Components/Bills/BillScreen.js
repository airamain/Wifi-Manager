import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import Axios from "axios";

import SearchBox from "./SearchBox";
import AddEditForm from "./AddEditForm";
import DataList from "./DataList";
import Pagination from "../Layout/Pagination";
import LoadingScreen from "../Layout/LoadingScreen";
import AskForPrint from "./AskForPrint";

export default class BillScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clientList: [],
      data: [],
      pagedData: [],
      modalState: { addBill: false, askToPrint: false },
      idToPrint: "",
      isLoading: true,
    };
  }

  componentDidMount() { this.getData() }
  addBill = () => { this.setState((i) => ({ modalState: { ...i.modalState, addBill: !i.modalState.addBill }, })) }
  getData = () => {

    const HEADERSCONFIG = { headers: { "auth-token": localStorage.getItem("token") } }
      , GETBILLS = Axios.get(`/api/bills/get`, HEADERSCONFIG)
      , GETCLIENTS = Axios.get("/api/clients/get", HEADERSCONFIG);

    Axios.all([GETBILLS, GETCLIENTS]).then(Axios.spread((...responses) => this.setState({ data: responses[0].data.data, clientList: responses[1].data, isLoading: false })));
  };

  onChangePage = (pagedData) => { this.setState({ pagedData }) };
  askToPrint = (id) => { this.setState((i) => ({ modalState: { ...i.modalState, askToPrint: !i.modalState.askToPrint }, idToPrint: id ? id : "", })) };

  render() {
    if (this.state.isLoading) {
      return <LoadingScreen />;
    }
    return (
      <>
        <AddEditForm show={this.state.modalState.addBill} onHide={this.addBill} refresh={this.getData} clientList={this.state.clientList} askToPrint={(i) => this.askToPrint(i)} />
        <AskForPrint {...this.props} show={this.state.modalState.askToPrint} onHide={this.askToPrint} id={this.state.idToPrint} />

        <Row>
          <Col>
            <Row>
              <Col><SearchBox refresh={this.getData} setResults={(i) => this.setState({ data: i })} /></Col>
            </Row>
            <Row>
              <Col><DataList data={this.state.pagedData} clientList={this.state.clientList} addBill={this.addBill} refresh={this.getData} {...this.props} /></Col>
            </Row>
            <Row>
              <Col className="p-3 my-3 bg-light rounded shadow d-flex justify-content-center">
                <Pagination items={this.state.data} onChangePage={this.onChangePage} pageSize={5} />
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  }
}
