import { describe, expect, it } from 'bun:test'

const url = 'http://localhost:3050/api'
describe('product', () => {

    function generateProduct() {
        const brands = ["Toyota", "Honda", "Isuzu", "Nissan", "Mazda"];
        const models = ["Vios", "City", "D-Max", "Navara", "CX-5"];
        const categories = [1, 2, 3, 4];
        const productTypes = [101, 102, 103];
        const keywords = ["กรอง", "น้ำมัน", "เบรก", "โช้ค", "ไฟหน้า", "หม้อน้ำ", "สายพาน"];

        function getRandomKeywordList() {
            const n = Math.floor(Math.random() * 4) + 1;
            return Array.from({ length: n }, () => ({
                keyword: keywords[Math.floor(Math.random() * keywords.length)],
            }));
        }

        const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const randCode = () =>
            Math.random().toString(36).substring(2, 8).toUpperCase();

        return {
            code: `PD-${randCode()}`,
            short_name: `อะไหล่ ${rand(keywords)}`,
            name: `อะไหล่รถยนต์รุ่น ${rand(models)}`,
            model: rand(models),
            brand: rand(brands),
            cost: parseFloat((Math.random() * 10000).toFixed(2)),
            authentic_code: `AUTH-${randCode()}`,
            category_id: rand(categories),
            product_type_id: rand(productTypes),
            sku: `SKU-${randCode()}`,
            secret_code: `SC-${randCode()}`,
            special_search: getRandomKeywordList(),
        };
    }
    let Id: string | null = null;
    it('1.create product', async () => {
        const body = generateProduct();
        const response = await fetch(`${url}/product`, {
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

    it('2.get all product', async () => {
        const response = await fetch(`${url}/product`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('3.get product by id', async () => {
        const response = await fetch(`${url}/product/${Id}`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('4.get product by  string error', async () => {
        const response = await fetch(`${url}/product/-1`);
        const data = await response.json()
        console.log(data)
        expect(response.status).toBe(400)
        expect(data.message).toBe("not found data by id -1");
    })


    it('5.update product', async () => {
        const body = generateProduct();
        const response = await fetch(`${url}/product/${Id}`, {
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

    it('6.delete product id', async () => {
        const response = await fetch(`${url}/product/${Id}`, {
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

