// test/bill_detail.test
import { describe, expect, it } from 'bun:test'

const url = 'http://localhost:3050/api'
describe('bill_detail', () => {

    function getRandomProductItem(billId = 1) {
        const products = [
            { name: "กรองอากาศ", id: 101, price: 150 },
            { name: "ผ้าเบรกหน้า", id: 102, price: 850 },
            { name: "น้ำมันเครื่อง", id: 103, price: 300 },
            { name: "หัวเทียน", id: 104, price: 120 },
            { name: "แบตเตอรี่", id: 105, price: 1800 },
            { name: "ยางรถยนต์", id: 106, price: 2500 },
            { name: "ใบปัดน้ำฝน", id: 107, price: 180 },
            { name: "โช๊คอัพ", id: 108, price: 2200 },
            { name: "ไฟหน้า", id: 109, price: 1200 },
            { name: "หม้อน้ำ", id: 110, price: 1600 }
        ];

        const randomProduct = products[Math.floor(Math.random() * products.length)];

        return {
            bill_id: billId,
            product_name: randomProduct?.name,
            product_id: randomProduct?.id,
            price: randomProduct?.price
        };
    }

    let Id: string | null = null;

    it('1.create bill_detail', async () => {
        const body = getRandomProductItem();
        const response = await fetch(`${url}/bill_detail`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = response.json()
        console.log(data);
        Id = data.id;
        expect(response.status).toBe(200);
    })

    it('2.get all bill_detail', async () => {
        const response = await fetch(`${url}/bill_detail`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('3.get bill_detail by id', async () => {
        const response = await fetch(`${url}/bill_detail/${Id}`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('4.get bill_detail by string error', async () => {
        const response = await fetch(`${url}/bill_detail/-1`);
        const data = await response.json()
        // status 400
        console.log(data)
        expect(response.status).toBe(400)
        expect(data.message).toBe("not found data by id -1");
    })

    it('5.update bill_detail', async () => {
        const body = getRandomProductItem();
        const response = await fetch(`${url}/bill_detail/${Id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = response.json()
        console.log(data);
        Id = data.id;
        expect(response.status).toBe(200);
    })

    it('6.delete bill_detail by id', async () => {
        const response = await fetch(`${url}/bill_detail/${Id}`, {
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

