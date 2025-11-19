import { describe, expect, it } from 'bun:test'

const url = 'http://localhost:3050/api'
describe('payout_record', () => {

    function generatePayout() {
        const paymentMethods = ["เงินสด", "โอนธนาคาร", "เช็ค", "PromptPay"];
        const banks = ["SCB", "KBANK", "BBL", "KTB", "TMB"];
        const notes = ["จ่ายครบแล้ว", "รอโอน", "จ่ายบางส่วน"];

        return {
            total_bill_id: `TB-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
            dealer_id: Math.floor(Math.random() * 5000) + 1,
            total: parseFloat((Math.random() * 100000).toFixed(2)),
            payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            preference_number: Math.floor(Math.random() * 10000000),
            paying_bank: banks[Math.floor(Math.random() * banks.length)],
            note: notes[Math.floor(Math.random() * notes.length)],
        };
    }

    let Id: string | null = null;

    it('1.create payout_record', async () => {
        const body = generatePayout();
        const response = await fetch(`${url}/payout_record`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await   response.json()
        Id = data.data.id;
        console.log(data);
        expect(response.status).toBe(200);
    })

    it('2.get all payout_record', async () => {
        const response = await fetch(`${url}/payout_record`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('3.get payout_record by id', async () => {
        const response = await fetch(`${url}/payout_record/${Id}`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('4.get payout_record by  string error', async () => {
        const response = await fetch(`${url}/payout_record/-1`);
        const data = await response.json()
        console.log(data)
        expect(response.status).toBe(400)
        expect(data.message).toBe("not found data by id -1");
    })

    it('5.update payout_record', async () => {
        const body = generatePayout();
        const response = await fetch(`${url}/payout_record/${Id}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await   response.json()
        console.log(data);
        expect(response.status).toBe(200);
    })

    it('6.delete payout_record id', async () => {
        const response = await fetch(`${url}/payout_record/${Id}`, {
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

