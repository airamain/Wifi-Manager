import React, { Component } from "react";
import { Container, Row, Col } from 'react-bootstrap'
import axios from "axios";
import jsPDF from "jspdf";
import moment from 'moment';
import { img } from './img'
import "moment/locale/es"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { notify } from "react-notify-toast";


export default class BatchPrinting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      billNumber: 0,
      currentDate: "",
      vencimiento: "",
      quantityPerBatch: 8,
    };
  }

  async componentDidMount() {
    console.log(img)
    // await axios.get("/api/bill/billNumber").then(billNumber => { this.setState({ billNumber: billNumber.data.billNumber }); this.print(); })
    moment.locale('es');
    this.setState({ currentDate: new moment().format("L"), vencimiento: new moment().add(10, "days").calendar() })
    this.print()
  }


  print = async () => {

    const HEADERSCONFIG = { headers: { "auth-token": localStorage.getItem("token") } }

    function timer(ms) { return new Promise(res => setTimeout(res, ms)) }

    await axios.get("/api/clients/get", HEADERSCONFIG)
      .then(async out => {

        var chunk = 10;

        for (let i = 0; i < out.data.length; i += chunk) {
          var temparray = out.data.slice(i, i + chunk);

          temparray.map(async client => {
            if (client.unSubscribingDate) {
              console.log(`Cliente ${client.name} dado de baja`);
              return null;
            }
            else {

              // Comienza JSPDF
              this.setState(prevState => ({
                billNumber: ++prevState.billNumber
              }));

              // Actual PDF scaffolding

              var doc = new jsPDF();

              doc.addImage(img, "JPEG", 0.8, 0, 67, 67);

              doc.setDrawColor(200, 200, 200);

              // Horizontal (x1, y1, x2, y2, style)
              doc.line(70, 28, 240, 28);
              doc.line(70, 48, 240, 48);
              doc.line(0, 68, 240, 68);
              doc.line(0, 88, 240, 88);
              doc.line(0, 108, 240, 108);
              doc.line(0, 128, 240, 128);
              doc.line(110, 198, 240, 198);
              doc.line(0, 218, 240, 218);

              // Vertical Lines (x1, y1, x2, y2, style)
              doc.line(110, 128, 110, 218);
              doc.line(70, 0, 70, 128);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(12);
              doc.text("Numero de recibo:", 75, 20);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(10);
              doc.text(`${this.state.billNumber}`, 119, 20);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(12);
              doc.text("Fecha de emision:", 75, 40);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(10);
              doc.text(`${this.state.currentDate}`, 119, 40);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(12);
              doc.text("Fecha de vencimiento:", 75, 60);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(10);
              doc.text(`${this.state.vencimiento}`, 119, 60);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(12);
              doc.text("Cliente:", 5, 80);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(10);
              doc.text(`${client.name}`, 75, 80);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(12);
              doc.text("A Pagar:", 5, 100);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(10);
              doc.text(`Pesos ${client.priceText}`, 75, 100);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(12);
              doc.text("Como:", 5, 120);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(10);
              doc.text(`Abono mes: ${moment().format('MMMM [del año] YYYY')}`, 75, 120);

              // 

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(10);
              doc.text("Banco Santander", 115, 140);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(10);
              doc.text("Tipo y número de cuenta: Cuentas en Pesos  069-236693/5", 115, 150);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(10);
              doc.text("Número de CBU: 0720069488000023669354 ", 115, 160);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(10);
              doc.text("Alias de CBU: adrian.iramain", 115, 170);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(10);
              doc.text("Titular de la cuenta: Iramain Jose Manuel Adrian", 115, 180);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(10);
              doc.text("Tipo y número de documento: DNI - 25444278", 115, 190);

              // 

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(10);
              doc.text("Total:", 115, 210);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(10);
              doc.text(`$ ${client.price}-.`, 127, 210);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(10);
              doc.text("Rebanking (Transatlantica Compañía Financiera S.A.)", 5, 140);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(10);
              doc.text("Número de cuenta ($): 999-180087/2", 5, 150);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(10);
              doc.text("CBU: 4150999718001800870027", 5, 160);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(10);
              doc.text("Alias: jma.iramain.ars", 5, 170);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(10);
              doc.text("Titular de la cuenta: Jose Manuel Adrian Iramain", 5, 180);

              doc.setTextColor(0, 0, 0);
              doc.setFontSize(10);
              doc.text("CUIT: 20254442780", 5, 190);

              doc.setTextColor(255, 0, 0);
              doc.setFontSize(10);
              doc.text("LOS ABONOS PUEDEN SER PAGADOS EN RAPI PAGO O PAGO FACIL. INDICANDO CARGA DE 'UALA' CON DNI: 25444278", 5, 225);

              doc.setTextColor(255, 0, 0);
              doc.setFontSize(10);
              doc.text("Enviar comprobante de pago por email: info.wifi.net@gmail.com o por WhatsApp", 5, 230);

              doc.save(`cliente-${client.name}.pdf`);

              console.log("Cliente")

              return null;
            }
            // Termina JSPDF

          })
          // Termina el .map
          await timer(1000)
        }
      }).then(() => { notify.show('Boletas guardadas correctamente.', 'success'); this.props.history.push('/') })
      .catch(err => console.log(err));

    // axios.put('/api/bill/billNumber', { billNumber: this.state.billNumber }).catch(err => console.log(err))
  };

  render() {
    return (
      <Container>
        <Row className='v-center vh-100-minus'>
          <Col />
          <Col className='bg-white shadow p-5 rounded text-center m-0'>
            <FontAwesomeIcon size='2x' icon={faSpinner} spin />
            <br />
            <h3 className="">Guardando boletas...</h3>
          </Col>
          <Col />
        </Row>
      </Container>
    );
  }
}
