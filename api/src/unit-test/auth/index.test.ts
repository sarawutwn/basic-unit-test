
import { describe, expect, it } from 'bun:test'
describe('auth', () => {

    const url = 'http://localhost:3050/api'


    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function getRandomString(length) {
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
    it('1.signup', async () => {
        const response = await fetch('http://localhost:3050/api/user', {
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


    it('2.update user by id', async () => {
        console.log('update data by id');
        const body = generateRandomUser();
        const response = await fetch(`${url}/user/${Id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json()
        console.log(data);
        expect(response.status).toBe(200);
    })


    it('3.login with username and password', async () => {
        const response = await fetch('http://localhost:3050/api/auth/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'music@gmail.com',
                password: '12345'
            })
        });
        const data = await response.json()
        //console.log(data)
        expect(data).toBeDefined()
        expect(response.status).toBe(200)
    })

    it('4.login with username and password wrong', async () => {
        const response = await fetch('http://localhost:3050/api/auth/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({

                username: 'music2@gmail.com',
                password: '123476'
            })
        });
        const data = await response.json()
        //console.log(data)
        expect(data).toBeDefined()
        expect(response.status).toBe(401)
    })

    it('5.login with username  is null and password is null', async () => {
        const response = await fetch('http://localhost:3050/api/auth/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: '',
                password: ''
            })
        });
        const data = await response.json()
        console.log(data)
        expect(data).toBeDefined()
        expect(response.status).toBe(401)
    })
})