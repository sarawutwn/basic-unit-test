import { describe, expect, it } from 'bun:test'

const url = 'http://localhost:3050/api'
describe('member', () => {
    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function getRandomPhone() {
        return '08' + Math.floor(10000000 + Math.random() * 90000000);
    }

    function generateRandomUser() {
        const firstNames = ['Anucha', 'Suphachai', 'Jirapa', 'Kittisak', 'Nattapong', 'Waraporn'];
        const lastNames = ['Kaewdee', 'Srisuk', 'Thongchai', 'Pongsathorn', 'Chaiyaphum', 'Inthara'];
        const laves = ['Kaewdee', 'Srisuk', 'Thongchai', 'Pongsathorn', 'Chaiyaphum', 'Inthara'];
        const address = ['102', '103', '104', '105', '106', '107'];

        const first_name = getRandomElement(firstNames);
        const last_name = getRandomElement(lastNames);
        const level = getRandomElement(laves);
        const phone = getRandomPhone();

        return {
            first_name,
            last_name,
            level,
            address,
            phone
        };
    }

    let Id: string | null = null;

    it('1.create member', async () => {
        const body = generateRandomUser();
        const response = await fetch(`${url}/member`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data =    await   response.json();
        Id = data.data.id;
        console.log(data);
        expect(response.status).toBe(200);
    })

    it('2.get all member', async () => {
        const response = await fetch(`${url}/member`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('3.get member by id', async () => {
        const response = await fetch(`${url}/member/${Id}`)
        const data = await response.json()
        expect(response.status).toBe(200)
        console.log(data)
    })

    it('4.get member by  string', async () => {
        const response = await fetch(`${url}/member/-1`);
        const data = await response.json()
        console.log(data)
        expect(response.status).toBe(400)
        expect(data.message).toBe("not found data by id -1");
    })

    it('5.update member', async () => {
        const body = generateRandomUser();
        const response = await fetch(`${url}/member/${Id}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data =  await   response.json();
        console.log(data);
        expect(response.status).toBe(200);
    })

    it('6.delete member id', async () => {
        const response = await fetch(`${url}/member/${Id}`, {
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

