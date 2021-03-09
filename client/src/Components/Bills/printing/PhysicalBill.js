import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Button, Row, Col, Container, Form } from "react-bootstrap";
import { savePDF } from "@progress/kendo-react-pdf";
import { drawDOM, exportPDF } from "@progress/kendo-drawing";
import Axios from "axios";
import { notify } from "react-notify-toast";
import moment from "moment";
import LoadingScreen from "../../Layout/LoadingScreen";

export default class PhysicalBill extends Component {
  constructor(props) {
    super(props);
    this.state = { isSendingEmail: false, isLoading: true, data: {}, clientData: {}, email: "", displayConfirmationEmail: false };
  }

  componentDidMount() {

    const HEADERSCONFIG = { headers: { "auth-token": localStorage.getItem("token") } }

    Axios.get(`/api/bills/get/${this.props.match.params.id}`, HEADERSCONFIG)
      .then(({ data }) => {
        if (data.success) {
          this.setState({ data: data.data[0] }); Axios.get(`/api/clients/get/${data.data[0].clientId}`, HEADERSCONFIG)
            .then(({ data }) => {
              if (data.success) { this.setState({ clientData: data.data[0], isLoading: false }); }
              else { notify.show(data.message, "error"); this.props.history.push("/"); }
            });
        } else { notify.show(data.message, "error"); this.props.history.push("/"); }
      });
  }

  handleSavePDF = () => {
    const PDFCONFIG = { paperSize: "A4", scale: 0.75, fileName: `${this.state.clientData.name} - ${moment(this.state.data.createdAt).format("L")}` }
    savePDF(ReactDOM.findDOMNode(this.bill), PDFCONFIG);
  };

  handleSendPDF = (obj) => {
    obj.preventDefault();

    this.setState({ isSendingEmail: true })
    const BILLELEMENT = document.getElementsByClassName("bill")[0];
    const DRAWCONFIG = { paperSize: "A4", scale: 0.75, fileName: `${this.state.clientData.name} - ${moment(this.state.data.createdAt).format("L")}` }
    const POSTCONFIG = { client: this.state.clientData.name, date: moment(this.state.data.createdAt).format("L"), email: this.state.clientData.email, }

    drawDOM(BILLELEMENT, DRAWCONFIG)
      .then((group) => { return exportPDF(group) })
      .then((dataUri) => {
        Axios.post(`/api/bills/send`, { ...POSTCONFIG, file: dataUri }, { headers: { "auth-token": localStorage.getItem("token") } })
          .then(res => {
            this.setState(i => ({ isSendingEmail: !i.isSendingEmail }))
            if (res.data.success) { notify.show(res.data.message, 'success'); this.props.history.push('/') }
            else { notify.show(res.data.message, 'error') }
          })
      });
  };

  handleChange = (obj) => {
    let { value } = obj.target;
    this.setState(i => ({ clientData: { ...i.clientData, email: value } }))
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingScreen />
    }

    return (
      <div>
        <Row>
          <Col />
          <Col className="bg-white mt-3 mb-5 text-center p-3 shadow rounded">
            <Row><Col>
              <Button variant="primary" onClick={this.handleSavePDF}>Guardar PDF</Button>
              <Button className="ml-3" variant="primary"
                onClick={() => { this.setState(i => ({ displayConfirmationEmail: true })) }} disabled={this.state.isSendingEmail}>Enviar por mail</Button>
            </Col></Row>
            <Row className={this.state.displayConfirmationEmail ? 'd-block text-left mt-3' : 'd-none'}><Col>
              <Form onSubmit={this.handleSendPDF}>
                <Form.Group>
                  <Form.Label>Confirme dirección de mail:</Form.Label>
                  <Form.Control required type="email" value={this.state.clientData.email} onChange={this.handleChange} name="email" />
                </Form.Group>
                <Button disabled={this.state.isSendingEmail} className='text-right' type='submit'>Enviar</Button>
              </Form>
            </Col></Row>
          </Col>
          <Col />
        </Row >
        <Row>
          <Col>
            <Container className="bg-white bill" ref={(bill) => (this.bill = bill)} style={{ fontFamily: "DejaVu Sans" }}>
              <Row>
                <Col md="4" className="border v-center text-center">
                  <img src={process.env.PUBLIC_URL + "/img/wifinetLogoFull.webp"} height="150" alt="WiFi Net Logo" />
                </Col>
                <Col>
                  <Row className="border v-center">
                    <Col className="v-center" md="3"><p className="lead m-0 py-2">Recibo N°</p></Col>
                    <Col>{this.state.data.billNumber}</Col>
                  </Row>
                  <Row className="border v-center">
                    <Col className="v-center" md="3"><p className="lead m-0 py-2">Fecha de Emisión</p></Col>
                    <Col>{moment(this.state.data.createdAt).format("L")}</Col>
                  </Row>
                  <Row className="border v-center">
                    <Col className="v-center" md="3"><p className="lead m-0 py-2">Fecha de Vencimiento</p></Col>
                    <Col>{moment(this.state.data.dueDate).format("L")}</Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col md="4" className="border v-center"><p className="lead m-0 py-2">Cliente:</p></Col>
                <Col className="border v-center">{this.state.clientData.name} - {this.state.clientData.address}</Col>
              </Row>
              <Row>
                <Col md="4" className="border v-center"><p className="lead m-0 py-2">A pagar:</p></Col>
                <Col className="border v-center">Pesos {this.state.data.priceText}.-</Col>
              </Row>
              <Row>
                <Col md="4" className="border v-center"><p className="lead m-0 py-2">Como:</p></Col>
                <Col className="border v-center">Abono del mes {this.state.data.month}</Col>
              </Row>
              <Row className="border v-center">
                <Col md="8">
                  <Row>
                    <Col className="border py-2">
                      <h1 className='bill-payment-title text-info'>Métodos de pago</h1>
                      <ul>
                        <li><h2 className='bill-payment-subtitle mt-3'>CBU - Santander Rio</h2></li>

                        <ul>
                          <li className='bill-payment-item'>N° de Cuenta: <strong>069-236693/5</strong></li>
                          <li className='bill-payment-item'>N° de CBU: <strong>0720069488000023669354</strong></li>
                          <li className='bill-payment-item'> Alias: <strong>adrian.iramain</strong></li>
                          <li className='bill-payment-item'>Titular: <strong>Jose Manuel Adrian Iramain</strong></li>
                          <li className='bill-payment-item'>CUIL / CUIT: <strong>20-25444278-0</strong></li>
                        </ul>

                        <li><h2 className='bill-payment-subtitle mt-3'>CBU - Rebanking (Transatlantica Compañía Financiera S.A.)</h2></li>

                        <ul>
                          <li className='bill-payment-item'>N° de Cuenta: <strong>999-180087/2</strong></li>
                          <li className='bill-payment-item'>N° de CBU: <strong>4150999718001800870027</strong></li>
                          <li className='bill-payment-item'>Alias: <strong>jma.iramain.ars</strong></li>
                          <li className='bill-payment-item'>Titular: <strong>Jose Manuel Adrian Iramain</strong></li>
                          <li className='bill-payment-item'>CUIL / CUIT: <strong>20-25444278-0</strong></li>
                        </ul>
                      </ul>

                      <p className='text-center text-info bill-payment-item m-0 mt-5'>Puede abonar con <strong>ualá</strong> en <strong>PagoFácil</strong> o <strong>RapiPago</strong> indicando el DNI: <strong>25444278</strong>.</p>
                      <p className='text-center text-info bill-payment-item m-0'>Enviar comprobante de pago por WhatsApp o por email a: <strong>info.wifi.net@gmail.com</strong></p>

                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <Col className="border-bottom h-100"><p className="lead m-0 py-2">Notas adicionales</p><p>{this.state.data.additionalNotes}</p></Col>
                  </Row>
                  <Row>
                    <Col className="h-100"><p className="lead m-0 py-2">Total:</p>{" "}<p>${this.state.data.price}.-</p></Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </div >
    );
  }
}
