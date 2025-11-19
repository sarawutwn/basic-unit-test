import { describe, expect, it } from 'bun:test'

const url = 'http://localhost:3050/api'
describe('product_type', () => {

    let Id: string | null = null;
    function generateData() {
        const productTypes = [
            "กรองอากาศ",
            "น้ำมันเครื่อง",
            "ผ้าเบรก",
            "หัวเทียน",
            "ใบปัดน้ำฝน",
            "แบตเตอรี่",
            "ยางรถยนต์",
            "โช้คอัพ",
            "คอยล์จุดระเบิด",
            "สายพานหน้าเครื่อง",
            "หม้อน้ำ",
            "หลอดไฟหน้า",
            "แผ่นคลัตช์",
            "ลูกหมากปีกนก",
            "เพลาขับหน้า",
            "ปั๊มน้ำ"
        ];

        return {
            name: productTypes[Math.floor(Math.random() * productTypes.length)]
        };
    }

    it('1.create product_type', async () => {
        const body = generateData();
        const response = await fetch(`${url}/product_type`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json()
        Id = data.data.id;
        console.log(data);
        expect(response.status).toBe(200);
    })


    it('2.get all product_type', async () => {
        const response = await fetch(`${url}/product_type`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('3.get product_type by id', async () => {
        const response = await fetch(`${url}/product_type/${Id}`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('4.get product_type by  string error', async () => {
        const response = await fetch(`${url}/product_type/-1`);
        const data = await response.json()
        console.log(data)
        expect(response.status).toBe(400)
        expect(data.message).toBe("not found data by id -1");
    })

    it('5.update product_type', async () => {
        const body = generateData();
        const response = await fetch(`${url}/product_type/${Id}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json()
        console.log(data);
        expect(response.status).toBe(200);
    })

    it('6.delete product_type id', async () => {
        const response = await fetch(`${url}/product_type/${Id}`, {
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

