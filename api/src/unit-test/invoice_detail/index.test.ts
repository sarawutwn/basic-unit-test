import { describe, expect, it } from 'bun:test'

const url = 'http://localhost:3050/api'
describe('invoice_detail', () => {

    function generateData() {
        return {
            invoice_id: Math.floor(Math.random() * 1000000),
            date_invoice: Math.floor(Math.random() * 10000),
            bill_no: 'NO' + Math.floor(Math.random() * 10000).toString(),
            price: parseFloat((Math.random() * 1000).toFixed(2)),

        }
    }

    let Id: string | null = null;
    it('1.create invoice_detail', async () => {
        const body = generateData();
        const response = await fetch(`${url}/invoice_detail`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data =    await   response.json()
        Id = data.data.id;
        console.log(data);
        expect(response.status).toBe(200);
    })

    it('2.get all invoice_detail', async () => {
        const response = await fetch(`${url}/invoice_detail`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('3.get invoice_detail by id', async () => {
        const response = await fetch(`${url}/invoice_detail/${Id}`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('4.get invoice_detail by  string error', async () => {
        const response = await fetch(`${url}/invoice_detail/-1`);
        const data = await response.json()
        console.log(data)
        expect(response.status).toBe(400)
        expect(data.message).toBe("not found data by id -1");
    })

    it('5.update invoice_detail', async () => {
        const body = generateData();
        const response = await fetch(`${url}/invoice_detail/${Id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json()
        console.log(data);
        expect(response.status).toBe(200);
    })

    it('6.delete invoice_detail id', async () => {
        const response = await fetch(`${url}/invoice_detail/${Id}`, {
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

