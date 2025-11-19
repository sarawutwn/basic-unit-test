import { describe, expect, it } from 'bun:test'

const url = 'http://localhost:3050/api'
describe('purchase_order', () => {


    function generateData() {
        return {
            order_no: Math.floor(Math.random() * 1000000).toString(),
            dealer_id: Math.floor(Math.random() * 10000),
            status: 'รอรับสินค้า',
            number_items: Math.floor(Math.random() * 10000),
            total_Invoice: 'cash',
        }
    }
    let Id: string | null = null;
    it('1.create purchase_order', async () => {
        const body = generateData();
        const response = await fetch(`${url}/purchase_detail`, {
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

    it('2.get all purchase_order', async () => {
        const response = await fetch(`${url}/purchase_order`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('3.get purchase_order by id', async () => {
        const response = await fetch(`${url}/purchase_order/${Id}`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('4.get purchase_order by  string', async () => {
        const response = await fetch(`${url}/purchase_order/-1`);
        const data = await response.json()
        console.log(data)
        expect(response.status).toBe(400)
        expect(data.message).toBe("not found data by id -1");
    })

    it('5.update purchase_order', async () => {
        const body = generateData();
        const response = await fetch(`${url}/purchase_detail/${Id}`, {
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

    it('6.delete purchase_order id', async () => {
        const response = await fetch(`${url}/purchase_order/1`, {
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

