import { describe, expect, it } from 'bun:test'

const url = 'http://localhost:3050/api'
describe('improve_stock', () => {


    function generateData() {
        return {
            stock_id: Math.floor(Math.random() * 1000000),
            real_number: Math.floor(Math.random() * 10000),
            comment: 'test',

        }
    }

    let Id: string | null = null;
    it('1.create improve_stock', async () => {
        const body = generateData();
        const response = await fetch(`${url}/improve_stock`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = response.json()
        Id = data.data.id;
        console.log(data);
        expect(response.status).toBe(200);
    })

    it('2.get all improve_stock', async () => {
        const response = await fetch(`${url}/improve_stock`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('3.get improve_stock by id', async () => {
        const response = await fetch(`${url}/improve_stock/${Id}`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('4.get improve_stock by  string', async () => {
        const response = await fetch(`${url}/improve_stock/-1`);
        const data = await response.json()
        console.log(data)
        expect(response.status).toBe(400)
        expect(data.message).toBe("not found data by id -1");
    })

     it('5.update improve_stock', async () => {
        const body = generateData();
        const response = await fetch(`${url}/improve_stock/${Id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data =  await response.json()
        console.log(data);
        expect(response.status).toBe(200);
    })

    it('5.delete improve_stock id', async () => {
        const response = await fetch(`${url}/improve_stock/${Id}`, {
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

