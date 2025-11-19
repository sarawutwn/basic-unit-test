// test/user.test.ts
import { describe, expect, it } from 'bun:test'

const url = 'http://localhost:3050/api'
describe('user table', () => {

    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function getRandomString(length: Number) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    function getRandomPhone() {
        return '08' + Math.floor(10000000 + Math.random() * 90000000);
    }

    function generateRandomUser() {
        const firstNames = ['Anucha', 'Suphachai', 'Jirapa', 'Kittisak', 'Nattapong', 'Waraporn'];
        const lastNames = ['Kaewdee', 'Srisuk', 'Thongchai', 'Pongsathorn', 'Chaiyaphum', 'Inthara'];

        const first_name = getRandomElement(firstNames);
        const last_name = getRandomElement(lastNames);
        const username = `${first_name.toLowerCase()}.${getRandomString(3)}`;
        const rules = getRandomElement(['admin', 'user', 'staff']);
        const password = getRandomString(10);
        const phone = getRandomPhone();

        return {
            first_name,
            last_name,
            username,
            rules,
            password,
            phone,
        };
    }

    let Id: string | null = null;
    it('1.create user', async () => {
        const response = await fetch(`${url}/user`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(generateRandomUser())
        });
        const data = await response.json()
        console.log('new user = ', data)
        Id = data.data.id;
        expect(data).toBeDefined()
        expect(response.status).toBe(200)
    })

    it('2.get all user', async () => {
        const response = await fetch(`${url}/user`)
        const data = await response.json()
        expect(data).toBeDefined()
        // console.log(data)
        expect(data.total).toBeGreaterThan(0)
    })

    it('3.get user by id', async () => {
        const response = await fetch(`${url}/user/${Id}`)
        const data = await response.json()
        expect(data).toBeDefined()
        expect(data.data.id).toBe(Id)
    })

    it('4.get user by string error', async () => {
        const response = await fetch(`${url}/user/-1`)
        const data = await response.json()
        expect(response.status).toBe(400)
        expect(data.message).toBe("not found data by id -1")
    })

    it('6.get user by string not number', async () => {
        const response = await fetch(`${url}/user/aff`)
        const data = await response.json()
        expect(response.status).toBe(400)
        expect(data.message).toBe("Invalid id: must be a number")
    })

    it('7.update user ', async () => {
        const body = generateRandomUser()
        const response = await fetch(`${url}/user/${Id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json()
        console.log('update user = ', data)
        expect(data).toBeDefined()
        expect(response.status).toBe(200)
    })

    it('8.delete user id ', async () => {
        const response = await fetch(`${url}/user/${Id}`, {
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