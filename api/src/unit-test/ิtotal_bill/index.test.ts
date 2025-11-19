import { describe, expect, it } from 'bun:test'
const url = 'http://localhost:3050/api'
describe('total_bill', () => {

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomString(options) {
        return options[getRandomInt(0, options.length - 1)];
    }

    const randomBill = {
        bill_Included_number: getRandomInt(1000, 9999),
        note: getRandomString([
            'จ่ายแล้ว',
            'ค้างชำระ',
            'รอใบเสร็จ',
            'ส่วนลดพิเศษ',
            'เคลียร์ยอดแล้ว'
        ]),
        dealer_id: getRandomInt(1, 50),
        total: getRandomInt(1000, 50000),
        receipt_voucher_id: getRandomInt(100, 999),
        status: getRandomString([
            'pending',
            'paid',
            'cancelled',
            'refunded'
        ])
    };

    let Id: string | null = null;

    it('1.create total_bill', async () => {
        const body = randomBill;
        const response = await fetch(`${url}/total_bill`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = response.json()
        Id = data.id;
        console.log(data);
        expect(response.status).toBe(200);
    })

    it('2.get all total_bill', async () => {
        const response = await fetch(`${url}/total_bill`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('3.get total_bill by id', async () => {
        const response = await fetch(`${url}/total_bill/${Id}`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('4.get total_bill by string error', async () => {
        const response = await fetch(`${url}/total_bill/-1`);
        const data = await response.json()
        console.log(data)
        expect(response.status).toBe(400)
        expect(data.message).toBe("not found data by id -1");
    })


    it('5.update total_bill', async () => {
        const body = randomBill;
        const response = await fetch(`${url}/total_bill/${Id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = response.json()
        console.log(data);
        expect(response.status).toBe(200);
    })

    it('6.delete total_bill by id', async () => {
        const response = await fetch(`${url}/total_bill/${Id}`, {
            method: "DELETE", headers: {
                'Content-Type': 'application/json'
            },
        })
        const data = await response.json()
        console.log(data);
        expect(response.status).toBe(200);
        expect(data.message).toBe("deleted data");
    })
})

