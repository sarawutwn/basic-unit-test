
import { describe, expect, it } from 'bun:test'

const url = 'http://localhost:3050/api'
describe('selling_sku', () => {


    function generateData() {
        return {
            product_id: Math.floor(Math.random() * 1000000),
            sku: 'SKU' + Math.floor(Math.random() * 10000).toString(),
            percent: Math.floor(Math.random() * 10000),
            price_mode: 'แพง',
            price_selling: parseFloat((Math.random() * 1000).toFixed(2)),
        }
    }

    let Id: string | null = null;
    it('1.create selling_sku', async () => {
        const body = generateData();
        const response = await fetch(`${url}/selling_sku`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = response.json();
        Id = data.id;
        console.log(data);
        expect(response.status).toBe(200);
    })

    it('2.get all selling_sku', async () => {
        const response = await fetch(`${url}/selling_sku`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('3.get selling_sku by id', async () => {
        const response = await fetch(`${url}/selling_sku/${Id}`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('4.get selling_sku by string error', async () => {
        const response = await fetch(`${url}/selling_sku/-1`);
        const data = await response.json()
        console.log(data)
        expect(response.status).toBe(400)
        expect(data.message).toBe("not found data by id -1");
    })

    it('5.update selling_sku', async () => {
        const body = generateData();
        const response = await fetch(`${url}/selling_sku/${Id}`, {
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

    it('6.delete selling_sku id', async () => {
        const response = await fetch(`${url}/selling_sku/${Id}`, {
            method: "DELETE", headers: {
                'Content-Type': 'application/json'
            },
        })
        const data = await response.json();
        console.log(data);
        expect(response.status).toBe(200);
        expect(data.message).toBe("deleted data");
    })
})

