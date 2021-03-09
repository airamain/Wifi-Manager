const router = require("express").Router();
const auth = require("./verifyToken");
const Bill = require("../model/Bill");
const Client = require("../model/Client");
const BillCount = require("../model/BillCount");
const nodemailer = require('nodemailer')

const moment = require("moment");

router.post("/send", auth, (req, res) => {

  // Plantilla HTML del mail que se va a enviar

  const HTMLTEMPLATE = `
            <h1>¡Hola, ${req.body.client}!</h1> 
            <hr> 
            <p>Tu comprobante de WiFi-Net ya está disponible para que la descargues</p>
            <p>Muchísimas gracias por seguir con nosotros.</p>
            <br>
            <p>WiFi Net</p>`

    , TRANSPORTCONFIG = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: process.env.SENDERMAILACCOUNT, pass: process.env.SENDERMAILPASSWOR },
      tls: { rejectUnauthorized: false, ciphers: "SSLv3", },
    }

    , SENDMAILCONFIG = {
      from: `WiFi Net <${process.env.SENDERMAILACCOUNT}>`, to: req.body.email, subject: "Tu comprobante de WiFi-Net", html: HTMLTEMPLATE,
      attachments: { filename: `comprobante-${req.body.date}-${req.body.client}.pdf`, path: req.body.file },
    }

  nodemailer.createTransport(TRANSPORTCONFIG).sendMail(SENDMAILCONFIG)
    .then((info) => { res.send({ success: true, message: "¡Mail enviado!" }); })
    .catch((err) => { res.send({ success: false, message: `Ocurrió un error enviando el mail: ${err.message}` }) });

});

router.get("/get", auth, (req, res) => {
  Bill.find()
    .sort({ createdAt: -1 })
    .then((i) => res.send({ success: true, data: i }))
    .catch((err) => res.send({ success: false, message: err.message }));
});

router.get(`/get/:id`, auth, (req, res) => {
  Bill.find({ _id: req.params.id })
    .then((i) => res.send({ success: true, data: i }))
    .catch((err) => res.send({ success: false, message: err.message }));
});

router.post("/create", auth, (req, res) => {
  let billNumber = 0;

  BillCount.find()
    .then((i) => {
      billNumber = i[0].billCount;

      new Bill({
        billNumber,
        userInfo: { createdBy: req.user._id },
        ...req.body,
      })
        .save()
        .then((i) => {
          var aidi = i._id;
          BillCount.findOneAndUpdate(billNumber._id, {
            billCount: ++billNumber,
          }).then((i) => {
            res.send({
              success: true,
              message: `Se ha guardado la boleta.`,
              id: aidi,
            });
          });
        })
        .catch((err) =>
          res.send({
            success: false,
            message: `Ha ocurrido un error, ${err.message}`,
          })
        );
    })
    .catch((err) =>
      res.send({
        success: false,
        message: `Ha ocurrido un error, ${err.message}`,
      })
    );
});

router.post(`/search`, auth, (req, res) => {
  let query = {};
  let { dateFrom, dateTo } = req.body;

  if (dateFrom && !dateTo) {
    query.createdAt = { $gte: moment(dateFrom).startOf("day").format() };
  }
  if (dateTo && !dateFrom) {
    query.createdAt = { $lte: moment(dateTo).endOf("day").format() };
  }

  if (dateFrom && dateTo) {
    query.createdAt = {
      $gte: moment(dateFrom).startOf("day").format(),
      $lte: moment(dateTo).endOf("day").format(),
    };
  }

  Bill.find(query)
    .sort({ createdAt: -1 })
    .then((i) => res.send({ success: true, data: i }))
    .catch((err) => res.send({ success: false, message: err.message }));
});

router.post(`/startCount`, (req, res) => {
  new BillCount({ billCount: 0 }).save().then((i) => res.send(i));
});

router.delete(`/deleteBill/:id`, (req, res) => {
  Bill.findOneAndDelete({ _id: req.params.id })
    .then(i => res.send({ success: true, message: "Boleta eliminada" }))
    .catch(err => (res.send({ success: false, message: `Ocurrió un error: ${err.message}` })))
})

module.exports = router;
