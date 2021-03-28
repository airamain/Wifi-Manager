import React, { Component } from "react";
import { Container } from "react-bootstrap";
import Notifications from "react-notify-toast";

import moment from "moment";

import Home from "./Components/Home";
import ListClients from "./Components/Clients/ListClients.js";
import ListClientsBaja from "./Components/Clients/ListClientsBaja";
import DetailClients from "./Components/Clients/DetailClients";
import NavigationBar from "./Components/Layout/NavigationBar";

import Login from "./Components/Auth/Login";
import Logout from "./Components/Auth/Logout";

import BillScreen from "./Components/Bills/BillScreen";
import { BrowserRouter as Router, Route, withRouter } from "react-router-dom";

import "./styles/main.scss";
import PhysicalBill from "./Components/Bills/printing/PhysicalBill";
import BatchPrinting from "./Components/Bills/printing/BatchPrinting";

class App extends Component {
  render() {

    return (
      <>
        <Notifications options={{ zIndex: 9000 }} />
        <Router>
          <NavigationBar token={localStorage.getItem("token")} />
          <Container>
            {/* Auth routes */}

            <Route exact path="/login" render={(props) => <Login {...this.props} {...props} />} />
            <Route exact path="/logout" render={(props) => <Logout {...this.props} {...props} />} />
            <Route exact path="/" render={(props) => <Home {...this.props} {...props} />} />

            {/* Client routes */}

            <Route exact path="/clients/list" render={(props) => <ListClients {...this.props} {...props} />} />
            <Route exact path="/clients/list-baja" render={(props) => <ListClientsBaja {...this.props} {...props} />} />
            <Route exact path="/clients/details/:id" render={(props) => <DetailClients {...this.props} {...props} />} />

            {/* Bills routes */}

            <Route exact path="/bills/list/" render={(props) => <BillScreen {...this.props} {...props} />} />
            <Route exact path="/bills/print/:id" render={(props) => <PhysicalBill {...this.props} {...props} />} />
            <Route exact path='/bills/printAll' render={(props) => <BatchPrinting {...this.props} {...props} />} />
          </Container>
        </Router>
      </>
    );
  }
}

export default withRouter(App);
