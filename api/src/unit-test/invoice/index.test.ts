import { describe, expect, it } from 'bun:test'
const url = 'http://localhost:3050/api'
describe('invoice', () => {

    function generateInvoice() {
        return {
            bill_id: Math.floor(Math.random() * 1000) + 1,
            member_id: Math.floor(Math.random() * 1000) + 1,
            account_name: `Member` + Math.floor(Math.random() * 1000) + 1,
            invoice_no: `INV-${(Math.random() * 1000000).toFixed(0).padStart(6, '0')}`
        }
    }

    let Id: string | null = null;

    it('1. create invoice', async () => {
        const body = generateInvoice();
        const response = await fetch(`${url}/invoice`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        Id = data.data.id;
        console.log(data);
        expect(response.status).toBe(200);
    })


    it('2. get all invoice', async () => {
        const response = await fetch(`${url}/invoice`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('3. get invoice by id', async () => {
        const response = await fetch(`${url}/invoice/${Id}`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('4. get invoice by  string error', async () => {
        const response = await fetch(`${url}/invoice/-1`);
        const data = await response.json()
        console.log(data)
        expect(response.status).toBe(400)
        expect(data.message).toBe("not found data by id -1");
    })

    it('5. update invoice', async () => {
        const body = generateInvoice();
        const response = await fetch(`${url}/invoice/${Id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = response.json();
        console.log(data);
        expect(response.status).toBe(200);
    })

    it('6. delete invoice id', async () => {
        const response = await fetch(`${url}/invoice/${Id}`, {
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

