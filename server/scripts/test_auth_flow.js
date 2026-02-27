const uniqueId = Date.now();
const testUser = {
    fullName: `Test User ${uniqueId}`,
    email: `test${uniqueId}@example.com`,
    password: 'password123',
};

const rangerUser = {
    fullName: `Ranger User ${uniqueId}`,
    email: `ranger${uniqueId}@slwildlife.lk`,
    password: 'password123',
}

async function testAuth() {
    const baseUrl = 'http://localhost:5000/api/auth';

    console.log('--- Testing Regular User Registration ---');
    await registerAndLog(baseUrl, testUser, 'user');

    console.log('\n--- Testing Ranger Registration (@slwildlife.lk) ---');
    await registerAndLog(baseUrl, rangerUser, 'ranger');

}

async function registerAndLog(baseUrl, user, expectedRole) {
    try {
        const registerRes = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        const registerData = await registerRes.json();
        console.log(`Registration Status: ${registerRes.status}`);

        if (registerRes.status !== 201) {
            console.error('Registration failed:', registerData);
            return;
        }

        console.log(`Registered Role: ${registerData.role}`);
        if (registerData.role !== expectedRole) {
            console.error(`❌ Role mismatch! Expected ${expectedRole}, got ${registerData.role}`);
        } else {
            console.log(`✅ Role assigned correctly: ${expectedRole}`);
        }

        console.log('--- Testing Login ---');
        const loginRes = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: user.email,
                password: user.password
            })
        });
        const loginData = await loginRes.json();

        if (loginData.token) {
            console.log('✅ Login Successful!');
            console.log(`Login Role: ${loginData.user.role}`);
        } else {
            console.log('❌ Login Failed: No token received.');
        }

    } catch (error) {
        console.error('Error during test:', error.message);
    }
}

testAuth();
