// test/auth.test.ts
import { describe, expect, it } from 'bun:test'

const url = 'http://localhost:3050/api'
describe('bill', () => {

    function generateBill() {
        return {
            bill_no: Math.floor(Math.random() * 1000000).toString(),
            member_id: 1,
            client_type: 'retail',
            total: parseFloat((Math.random() * 1000).toFixed(2)),
            sale_type: 'ขายเงินสด',
        }
    }

    let billId: string | null = null;

    it('1.create bill', async () => {
        const body = generateBill();
        const response = await fetch(`${url}/bill`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json()
        console.log(data.data);
        billId = data.data.id;

        expect(response.status).toBe(200);
    })



        it('2.get all bill', async () => {
            const response = await fetch(`${url}/bill`)
            const data = await response.json()
            expect(response.status).toBe(200)
            const list = data?.data;
            console.log('data =', list)

        })


        it('3.get bill by string error', async () => {
            const response = await fetch(`${url}/bill/-1`);
            const data = await response.json()
            // status 400
            console.log(data)
            expect(response.status).toBe(400)
            expect(data.message).toBe("not found data by id -1");
        })

      it('4.get bill by id', async () => {
            const response = await fetch(`${url}/bill/${billId}`)
            const data = await response.json()
            expect(response.status).toBe(200)
            console.log(data)
        })

        it('5.update bill by id', async () => {
            console.log('update data by id');
            const body = generateBill();
            const response = await fetch(`${url}/bill/${billId}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            const data = await  response.json()
            console.log(data);
            expect(response.status).toBe(200);
        })


    it('6.delete bill id ', async () => {
        const response = await fetch(`${url}/bill/${billId}`, {
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

