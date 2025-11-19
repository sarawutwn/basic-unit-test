// test/user.test.ts
import { describe, expect, it } from 'bun:test'

const url = 'http://localhost:3050/api'
describe('stock', () => {

    let Id: string | null = null;
    let stock_id: string | null = null;

    it('1get all product', async () => {
        const response = await fetch(`${url}/product`)
        const data = await response.json()
        expect(data).toBeDefined()
        console.log(data.data)
        Id = data.data[0].id;
        expect(data.total).toBeGreaterThan(0)
    })



    it('2.create selling_sku', async () => {
        const body = {
            product_id: Id,
            quantity: Math.floor(Math.random() * 10) + 1
        }
        const response = await fetch(`${url}/stock`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = response.json();
        stock_id = data.id;
        console.log(data);
        expect(response.status).toBe(200);
    })

    it('3.get all stock', async () => {
        const response = await fetch(`${url}/stock`)
        const data = await response.json()
        expect(data).toBeDefined()
        console.log(data)
        expect(data.total).toBeGreaterThan(0)
    })

    it('4.get stock by id', async () => {
        const response = await fetch(`${url}/stock/${stock_id}`)
        const data = await response.json()
        expect(data).toBeDefined()
        expect(data.data.id).toBe(3)
    })

    it('5.get stock by string error', async () => {
        const response = await fetch(`${url}/stock/-1`)
        const data = await response.json()
        expect(response.status).toBe(400)
        expect(data.message).toBe("not found data by id -1")
    })

    it('6.get stock by string not number', async () => {
        const response = await fetch(`${url}/stock/abc`)
        const data = await response.json()
        expect(response.status).toBe(400)
        expect(data.message).toBe("Invalid id: must be a number")


    })

    it('7.update selling_sku', async () => {
        const body = {
            product_id: Id,
            quantity: Math.floor(Math.random() * 10) + 1
        }
        const response = await fetch(`${url}/stock/${stock_id}`, {
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

    it('8.delete selling_sku id', async () => {
        const response = await fetch(`${url}/stock/${Id}`, {
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