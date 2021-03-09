import React, { Component } from "react";
import { notify } from "react-notify-toast";

export default class Logout extends Component {
  componentDidMount() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.props.history.push("/");
    notify.show("Te has deslogueado con éxito!", "success");
  }

  render() {
    return (
      <div>
        <h1>Cerrando sesión...</h1>
      </div>
    );
  }
}
