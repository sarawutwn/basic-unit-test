import { describe, expect, it } from 'bun:test'

const url = 'http://localhost:3050/api'
describe('credit_product', () => {

    function generateCreditProduct() {
        return {
            bill_no: Math.floor(Math.random() * 1000000),
            member_id: Math.floor(Math.random() * 10000),
            client_type: 'retail',
            total: parseFloat((Math.random() * 1000).toFixed(2)),
            sale_type: 'cash',
        }
    }
    let Id: string | null = null;
    it('1.create credit_product', async () => {
        const body = generateCreditProduct();
        const response = await fetch(`${url}/credit_product`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data =  await response.json()
        console.log(data);
        Id = data.data.id;
        expect(response.status).toBe(200);
    })

    it('2.get all credit_product', async () => {
        const response = await fetch(`${url}/credit_product`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('3.get credit_product by id', async () => {
        const response = await fetch(`${url}/credit_product/${Id}`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('4.get credit_product by  string error', async () => {
        const response = await fetch(`${url}/credit_product/-1`);
        const data = await response.json()
        // status 400
        console.log(data)
        expect(response.status).toBe(400)
        expect(data.message).toBe("not found data by id -1");
    })

   it('5.update credit_product', async () => {
        const body = generateCreditProduct();
        const response = await fetch(`${url}/credit_product/${Id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data =  await  response.json()
        console.log(data);
        expect(response.status).toBe(200);
    })


    it('6.delete credit_product id', async () => {
        const response = await fetch(`${url}/credit_product/${Id}`, {
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

