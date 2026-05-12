import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, amount, bankCode } = body;

    const tmnCode = process.env.VNP_TMNCODE || 'KOGW3BGB'; // Mã test sandbox
    const secretKey = process.env.VNP_HASHSECRET || 'UHSKWYRTEUJDZVOMJPOWIRNQMSLKJHDF'; // Mã test sandbox
    const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    const returnUrl = 'http://localhost:3000/checkout/vnpay-return';

    const date = new Date();
    const createDate = 
      date.getFullYear().toString() +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      ('0' + date.getDate()).slice(-2) +
      ('0' + date.getHours()).slice(-2) +
      ('0' + date.getMinutes()).slice(-2) +
      ('0' + date.getSeconds()).slice(-2);

    let vnp_Params: any = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang ' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = '127.0.0.1';
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode) {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    // Sort key
    vnp_Params = Object.keys(vnp_Params)
      .sort()
      .reduce((acc: any, key) => {
        acc[key] = vnp_Params[key];
        return acc;
      }, {});

    const signData = new URLSearchParams(vnp_Params).toString();
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;

    const paymentUrl = vnpUrl + '?' + new URLSearchParams(vnp_Params).toString();
    
    return NextResponse.json({ url: paymentUrl });
  } catch (error) {
    console.error('Lỗi VNPay Create URL:', error);
    return NextResponse.json({ error: 'Lỗi tạo URL thanh toán' }, { status: 500 });
  }
}
