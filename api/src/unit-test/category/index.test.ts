import { describe, expect, it } from 'bun:test'

const url = 'http://localhost:3050/api'
describe('category', () => {


    function getRandomCategoryAndShelf() {
        const categories = [
            "อะไหล่เครื่องยนต์",
            "ช่วงล่าง",
            "ระบบไฟฟ้า",
            "ตัวถังและภายนอก",
            "ระบบเบรก",
            "ระบบส่งกำลัง",
            "ระบบปรับอากาศ",
            "อุปกรณ์ตกแต่ง"
        ];

        const shelves = [
            "A1", "A2", "A3", "B1", "B2", "C1", "C2", "D1", "D2"
        ];

        const name = categories[Math.floor(Math.random() * categories.length)];
        const shelf = shelves[Math.floor(Math.random() * shelves.length)];

        return {
            name,
            shelves: shelf
        };
    }

    let Id: string | null = null;
    it('1.create category', async () => {
        const body = getRandomCategoryAndShelf();
        const response = await fetch(`${url}/category`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json()
        console.log(data);
        Id = data.data.id;
        expect(response.status).toBe(200)
    })

    it('2.get all category', async () => {
        const response = await fetch(`${url}/category`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('3.get category by id', async () => {
        const response = await fetch(`${url}/category/${Id}`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('4.get category by  string error', async () => {
        const response = await fetch(`${url}/category/-1`);
        const data = await response.json()
        console.log(data)
        expect(response.status).toBe(400)
        expect(data.message).toBe("not found data by id -1");
    })

    it('5.update category', async () => {
        const body = getRandomCategoryAndShelf();
        const response = await fetch(`${url}/category/${Id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json()
        console.log(data);
        expect(response.status).toBe(200)
    })

    it('6.delete category id', async () => {
        const response = await fetch(`${url}/category/${Id}`, {
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

