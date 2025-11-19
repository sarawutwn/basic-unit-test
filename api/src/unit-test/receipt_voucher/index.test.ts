import { describe, expect, it } from 'bun:test'

const url = 'http://localhost:3050/api'
describe('receipt_voucher', () => {
   
    function generateData() {
        return {
            order_no: Math.floor(Math.random() * 1000000),
            delivery_number: Math.floor(Math.random() * 10000),
            sender_name: 'TEST',
        }  
    }

    let Id: string | null = null;
    it('1.create receipt_voucher', async () => {
        const body = generateData();
        const response = await fetch(`${url}/receipt_voucher`, {
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

    it('2.get all receipt_voucher', async () => {
        const response = await fetch(`${url}/receipt_voucher`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('3.get receipt_voucher by id', async () => {
        const response = await fetch(`${url}/receipt_voucher/${Id}`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('4.get receipt_voucher by string error', async () => {
        const response = await fetch(`${url}/receipt_voucher/-1`);
        const data = await response.json()
        console.log(data)
        expect(response.status).toBe(400)
        expect(data.message).toBe("not found data by id -1");
    })

    it('5.update receipt_voucher', async () => {
        const body = generateData();
        const response = await fetch(`${url}/receipt_voucher/${Id}`, {
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


    it('6.delete receipt_voucher id', async () => {
        const response = await fetch(`${url}/receipt_voucher/${Id}`, {
            method: "DELETE", headers: {
                'Content-Type': 'application/json'
            },
        })
        const data = await response.json()
        expect(response.status).toBe(200);
        expect(data.message).toBe("deleted data");
    })
})

