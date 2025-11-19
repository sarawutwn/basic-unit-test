import { describe, expect, it } from 'bun:test'
const url = 'http://localhost:3050/api'
describe('purchase_detail', () => {

    let Id: string | null = null;
    function generateData() {
        return {
            purchase_id: Math.floor(Math.random() * 1000000),
            product_id: Math.floor(Math.random() * 10000),
            price: 'retail',
            quantity: parseFloat((Math.random() * 1000).toFixed(2)),
        }
    }

    it('1.create purchase_detail', async () => {
        const body = generateData();
        const response = await fetch(`${url}/purchase_detail`, {
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


    it('2.get all purchase_detail', async () => {
        const response = await fetch(`${url}/purchase_detail`);
        const data = await response.json();
        expect(response.status).toBe(200);
        console.log(data);
    })


    it('3.get purchase_detail by id', async () => {
        const response = await fetch(`${url}/purchase_detail/${Id}`)
        const data = await response.json();
        expect(response.status).toBe(200);
        console.log(data);
    })


    it('4.get purchase_detail by  string', async () => {
        const response = await fetch(`${url}/purchase_detail/-1`);
        const data = await response.json()
        console.log(data)
        expect(response.status).toBe(400)
        expect(data.message).toBe("not found data by id -1");
    })


    it('5.update purchase_detail', async () => {
        const body = generateData();
        const response = await fetch(`${url}/purchase_detail/${Id}`, {
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


    it('6.delete purchase_detail id', async () => {
        const response = await fetch(`${url}/purchase_detail/${Id}`, {
            method: "DELETE", headers: {
                'Content-Type': 'application/json'
            },
        })
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.message).toBe("deleted data");
    })
})

