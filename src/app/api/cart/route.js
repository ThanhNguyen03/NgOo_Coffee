import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from  "@/app/api/auth/[...nextauth]/route";
import { Order } from "@/models/Order";
const crypto = require('crypto');
const https = require('https');

export async function POST(req, res) {
    mongoose.connect(process.env.MONGO_URL);

    const {info, cartProducts, paid, price, notes} = await req.json();

    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    const orderDocument = await Order.create({
        email,
        ...info,
        cartProducts,
        paid,
        price,
        notes,
    }); 
    if (paid?.name === 'COD') {
        return Response.json(orderDocument);
    }
    if (paid?.name === 'Momo') {
        const partnerCode = "MOMO";
        const accessKey = process.env.momo_ACCESS_KEY;
        const secretkey = process.env.momo_SECRET_KEY;
        const requestId = partnerCode + new Date().getTime();
        const orderId = orderDocument._id;
        const orderInfo = " NgOo Coffe id: " + orderId;
        const redirectUrl = "http://localhost:3000/checkout";
        const ipnUrl = "http://localhost:3000/checkout";
        const amount = price * 1000;
        const requestType = "payWithMethod"
        const extraData = "";
    
        const rawSignature =
            "accessKey=" + accessKey +
            "&amount=" + amount +
            "&extraData=" + extraData +
            "&ipnUrl=" + ipnUrl +
            "&orderId=" + orderId +
            "&orderInfo=" + orderInfo +
            "&partnerCode=" + partnerCode +
            "&redirectUrl=" + redirectUrl +
            "&requestId=" + requestId +
            "&requestType=" + requestType;
    
        const signature = crypto.createHmac('sha256', secretkey)
            .update(rawSignature)
            .digest('hex');
    
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            accessKey: accessKey,
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            extraData: extraData,
            requestType: requestType,
            signature: signature,
            lang: 'en'
        });
    
        try {
            const payUrl = await sendRequest(requestBody);
            return Response.json(payUrl);
        } catch (error) {
            // Handle error
            console.error("Error:", error);
            return Response.error("An error occurred while processing the request.");
        }
    }
    if (paid?.name === 'VNPay') {
        process.env.TZ = 'Asia/Ho_Chi_Minh';

        let date = new Date();
        let createDate = formatDate(date);
        
        let ipAddr = "127.0.0.1";
        
        let tmnCode = process.env.vnp_TmnCode;
        let secretKey = process.env.vnp_HashSecrect;
        let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        let bankCode = "";
        
        let locale = req.body.language;
        if(locale === null || locale === ''){
            locale = 'vn';
        }

        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderDocument._id;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho NgOo:' + orderDocument._id;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = price * 100000;
        vnp_Params['vnp_ReturnUrl'] = process.env.NEXTAUTH_URL + "/checkout";
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        //vnp_Params['vnp_Bill_Email'] = email;
        //vnp_Params['vnp_Bill_Mobile'] = orderDocument?.phone;
        if(bankCode !== null && bankCode !== ''){
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        return Response.json(vnpUrl);
    }
}

export async function GET() {
    mongoose.connect(process.env.MONGO_URL);
    return Response.json(await Order.find());
}

export async function PUT(req) {
    mongoose.connect(process.env.MONGO_URL);
    const updateData = await req.json();
    const {orderId, ...otherData} = updateData;
    const paidData = {...otherData};

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { paid: paidData });
    
    return Response.json(updatedOrder);
}

function sendRequest(requestBody) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        }

        const reqq = https.request(options, res => {
            let body = '';
            res.on('data', chunk => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const responseData = JSON.parse(body);
                    const payUrl = responseData.payUrl;
                    resolve(payUrl);
                } catch (error) {
                    reject(error);
                }
            });
            res.on('error', error => {
                reject(error);
            });
        });

        reqq.on('error', error => {
            reject(error);
        });

        reqq.write(requestBody);
        reqq.end();
    });
}

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1); // Tháng bắt đầu từ 0 nên cần cộng thêm 1
    const day = padZero(date.getDate());
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function padZero(number) {
    return number < 10 ? '0' + number : number.toString();
}