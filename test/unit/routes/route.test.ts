import test, {describe, it} from 'node:test';
import assert from "node:assert";
import authRoutes from '../../../src/app/routes/authRoutes';

const tracker = new assert.CallTracker();

process.on('exit', () => tracker.verify());

// test('top level test', async (t) => {
//     await t.test('subtest 1', (t) => {
//         assert.strictEqual(1, 1);
//     });
//
//     await t.test('subtest 2', (t) => {
//         assert.strictEqual(2, 2);
//     });
// });

test('authentications endpoint test suite', async (t) => {

    await t.test('test the login endpoint', {todo: 'Login should be successful.'}, async () => {

        const request: any = {
            body: {
                "email": "jerozeek@gmail.com",
                "password": "12345678",
                "deviceId": "EXPO_1122334"
            }
        }

        const response: any = {
            status: tracker.calls(item => {
                assert.equal(item, 200);
            }),
            end: tracker.calls(item => {
                assert.strictEqual(item, undefined, 'Nothing was returned')
            })
        }

        await authRoutes.login(request, response)
    })
})