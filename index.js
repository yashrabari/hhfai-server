require('dotenv').config();
const app = require('express')();
const bodyParser = require('body-parser');
const port = process.env.PORT || 6657;
const cors = require('cors');
const { createPaymentLink } = require('./utils/paymentLinks');



app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




app.post('/api/donate', async (req, res) => {
    console.log('req.body', req.body);
    var paymentData = {
        customerName: req.body.name,
        customerEmail: req.body.email,
        customerPhone: req.body.phone,
        paymentAmount: req.body.amount,
    }
    var responseFromPaymentLinkServer = await createPaymentLink(paymentData);
    if (responseFromPaymentLinkServer.success) {
        res.json({ ...responseFromPaymentLinkServer, data: responseFromPaymentLinkServer.data.link_url });
    } else {
        res.json(responseFromPaymentLinkServer)
    }
});









app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});