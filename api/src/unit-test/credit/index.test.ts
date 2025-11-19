import { describe, expect, it } from 'bun:test'

const url = 'http://localhost:3050/api'
describe('credit', () => {


    let Id: string | null = null;
    function generateCredit() {
        return {
            bill_id: Math.floor(Math.random() * 1000000),
            credit_code: Math.floor(Math.random() * 1000000).toString(),
            amount: Math.floor(Math.random() * 10000),
            member_id: 'retail'
        }
    }

    it('1.create credit', async () => {
        const body = generateCredit();
        const response = await fetch(`${url}/credit`, {
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

    it('2.get all credit', async () => {
        const response = await fetch(`${url}/credit`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('3.get credit by id', async () => {
        const response = await fetch(`${url}/credit/${Id}`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('4.get credit by string error', async () => {
        const response = await fetch(`${url}/credit/-1`);
        const data = await response.json()
        // status 400
        console.log(data)
        expect(response.status).toBe(400)
        expect(data.message).toBe("not found data by id -1");
    })

    it('5.update credit', async () => {
        const body = generateCredit();
        const response = await fetch(`${url}/credit/${Id}`, {
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

    it('6.delete credit by id', async () => {
        const response = await fetch(`${url}/credit/${Id}`, {
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

