import { describe, expect, it } from 'bun:test'

const url = 'http://localhost:3050/api'
describe('dealer', () => {
    function getRandomDealer() {
        const dealerNames = [
            "อะไหล่ยนต์ไทย",
            "สมชายอะไหล่",
            "เจริญยนต์",
            "AutoZone Express",
            "รุ่งเรืองอะไหล่",
            "ซุปเปอร์อะไหล่",
            "บางนาอะไหล่",
            "Speed Parts",
            "Perfect Auto",
            "Mega Motor Parts"
        ];
        const name = dealerNames[Math.floor(Math.random() * dealerNames.length)];
        const codeNumber = Math.floor(1 + Math.random() * 999);
        const code = `DLR${codeNumber.toString().padStart(3, '0')}`;
        return {
            name,
            code
        };
    }
    let Id: string | null = null;
    it('1.create dealer', async () => {
        const body = getRandomDealer();
        const response = await fetch(url, {
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

    it('2.get all dealer', async () => {
        const response = await fetch(`${url}/dealer`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('2.get dealer by id', async () => {
        const response = await fetch(`${url}/dealer/${Id}`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('3.get dealer by  string', async () => {
        const response = await fetch(`${url}/dealer/-1`);
        const data = await response.json()
        console.log(data)
        expect(response.status).toBe(400)
        expect(data.message).toBe("not found data by id -1");
    })

    it('5.update dealer', async () => {
        const body = getRandomDealer();
        const response = await fetch(`${url}/dealer/${Id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data =  await  response.json()
        console.log(data);
        expect(response.status).toBe(200);
    })

    it('6.delete dealer id', async () => {
        const response = await fetch(`${url}/dealer/${Id}}`, {
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

