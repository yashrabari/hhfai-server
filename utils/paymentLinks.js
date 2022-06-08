const axios = require('axios');



function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}





exports.createPaymentLink = async ({
    customerName,
    customerPhone,
    customerEmail,
    paymentAmount,

}) => {
    const paymentLinkId = makeid(10);
    const url = process.env.APP_ENV === 'PROD' ? `https://api.cashfree.com/pg/links` : `https://sandbox.cashfree.com/pg/links`;
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-api-version': '2022-01-01',
            'x-client-id': process.env.APP_ENV === 'PROD' ? process.env.CASHFREE_APP_ID : process.env.CASHFREE_APP_ID_STAGGING,
            'x-client-secret': process.env.APP_ENV === 'PROD' ? process.env.CASHFREE_SECRETE_KEY : process.env.CASHFREE_SECRETE_KEY_STAGGING,
        }
    };
    const data = {
        "customer_details": {
            "customer_name": customerName,
            "customer_phone": customerPhone,
            "customer_email": customerEmail
        },
        "link_notify": {
            "send_sms": true,
            "send_email": true
        },
        "link_notes": {
            "key_1": "value_1",
            "key_2": "value_2"
        },
        "link_meta": {
            "notify_url": "",
            "upi_intent": true,
            "return_url": ""
        },
        "link_amount": paymentAmount,
        "link_currency": "INR",
        "link_minimum_partial_amount": 0,
        "link_id": paymentLinkId,
        "link_partial_payments": false,
        "link_purpose": "Thank you for your support",
        "link_auto_reminders": true
    };
    try {
        // console.log('data', url);
        const response = await axios.post(url, data, config);
        return {
            success: true,
            status: response.status,
            data: response.data
        }
    } catch (error) {
        console.log('error', error);
        return {
            success: false,
            status: error.response.status,
            data: error.response.data
        }
    }
}

