import test from 'node:test';
import assert from 'node:assert';
import { promisify } from 'node:util';
import {Handler} from "../../../src/app/handler";

test('user integration test suite', async (t) => {

    const testServerAddress = `http:localhost:${process.env.PORT}/api/v4/auth/signup`;

    await t.test('it should create a new user', async () => {

        const data = {
            name: "Daniel Kalu",
            email: "jerozrety@gmail.com",
            password: "12345678909",
            phone: "08109875644",
            deviceId: "EXPO_123"
        }

        const request: any = await fetch(testServerAddress, {
            method: 'POST',
            body: JSON.stringify(data)
        })

        assert.deepStrictEqual(request.headers.get('content-type'), 'application/json')
        assert.strictEqual(request.status, 200)

        await request.json()
    })

    await promisify(Handler.server.close).bind(Handler.server.close)()
})