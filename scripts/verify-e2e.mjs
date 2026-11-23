import { spawn } from 'child_process';
import http from 'http';

const PORT = 3005;
const BASE_URL = `http://127.0.0.1:${PORT}`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = { ...(options.headers || {}) };
  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : undefined,
  });

  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}

  return {
    status: res.status,
    headers: res.headers,
    text,
    json,
  };
}

async function main() {
  console.log('Starting Next.js production server on port', PORT, '...');
  const server = spawn('node', ['./node_modules/next/dist/bin/next', 'start', '-p', String(PORT), '-H', '127.0.0.1'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  server.stdout.on('data', (d) => process.stdout.write(`[SERVER] ${d}`));
  server.stderr.on('data', (d) => process.stderr.write(`[SERVER ERR] ${d}`));

  let ready = false;
  let lastErr = null;
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`${BASE_URL}/`);
      if (res.status === 200) {
        ready = true;
        break;
      }
    } catch (e) {
      lastErr = e.message;
    }
    await sleep(500);
  }

  if (!ready) {
    console.error('Server failed to start within 20s. Last error:', lastErr);
    server.kill();
    process.exit(1);
  }

  console.log('\n================================================================');
  console.log('RUNNING E2E PRODUCTION VERIFICATION SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(cond, name) {
    total++;
    if (cond) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name}`);
    }
  }

  try {
    // 1. Homepage
    const homeRes = await request('/');
    assert(homeRes.status === 200, 'GET / returns 200 OK');
    assert(homeRes.text.toLowerCase().includes('cyberfest'), 'Homepage contains "cyberfest"');
    assert(homeRes.text.includes('Digital Defence Club'), 'Homepage contains "Digital Defence Club"');
    assert(homeRes.text.includes('Think Beyond. Defend Beyond.'), 'Homepage contains club tagline');

    // 2. Volunteer Application Page
    const applyRes = await request('/apply');
    assert(applyRes.status === 200 || applyRes.status === 307 || applyRes.status === 308, 'GET /apply succeeds or redirects');

    // 3. Application Submission API
    const testRoll = `160123733${Math.floor(100 + Math.random() * 900)}`;
    const submitRes = await request('/api/applications', {
      method: 'POST',
      body: {
        fullName: 'Srikar Varma',
        rollNumber: testRoll,
        areasOfInterest: ['Technical', 'Events'],
      },
    });

    assert(submitRes.status === 201, `POST /api/applications returns 201 Created`);
    assert(submitRes.json?.success === true, `Submission JSON has success: true`);
    assert(Boolean(submitRes.json?.application?.application_id), `Received Application Reference ID: ${submitRes.json?.application?.application_id}`);
    const appId = submitRes.json?.application?.id;
    const refId = submitRes.json?.application?.application_id;

    // 4. Duplicate Roll Number Prevention
    const duplicateRes = await request('/api/applications', {
      method: 'POST',
      body: {
        fullName: 'Srikar Varma Duplicate',
        rollNumber: testRoll,
        areasOfInterest: ['Design'],
      },
    });

    assert(duplicateRes.status === 409, `Duplicate submission returns 409 Conflict`);
    assert(duplicateRes.json?.success === false, `Duplicate submission has success: false`);
    assert(duplicateRes.json?.error?.includes('already been submitted'), `Duplicate returns clear error description: "${duplicateRes.json?.error}"`);

    // 5. Public Application Reference Status Query
    const refQueryRes = await request(`/api/applications?ref=${encodeURIComponent(refId)}`);
    assert(refQueryRes.status === 200, `GET /api/applications?ref=... returns 200 OK`);
    assert(refQueryRes.json?.application?.roll_number === testRoll, `Queried application matches roll number ${testRoll}`);
    assert(refQueryRes.json?.application?.application_status === 'Pending', `Initial status is 'Pending'`);

    // 6. Admin Authentication
    const badLoginRes = await request('/api/admin/auth', {
      method: 'POST',
      body: { password: 'WrongPassword123' },
    });
    assert(badLoginRes.status === 401, `Invalid admin credentials rejected with 401 Unauthorized`);

    const goodLoginRes = await request('/api/admin/auth', {
      method: 'POST',
      body: { password: '123456789' },
    });
    assert(goodLoginRes.status === 200, `Valid admin credentials accepted with 200 OK`);

    const setCookie = goodLoginRes.headers.get('set-cookie');
    assert(Boolean(setCookie), `Admin session cookie set: ${setCookie?.slice(0, 35)}...`);
    const cookieHeader = setCookie?.split(';')[0] || '';

    // 7. Protected Admin Endpoints
    const unauthStats = await request('/api/admin/stats');
    assert(unauthStats.status === 401, `Unauthenticated request to /api/admin/stats blocked with 401`);

    const authStats = await request('/api/admin/stats', {
      headers: { Cookie: cookieHeader },
    });
    assert(authStats.status === 200, `Authenticated request to /api/admin/stats returns 200 OK`);
    assert(authStats.json?.stats?.total >= 1, `Total applications metric >= 1 (${authStats.json?.stats?.total})`);

    // 8. Application Status Update (Pending -> Shortlisted -> Selected)
    const updateRes = await request(`/api/applications/${appId}`, {
      method: 'PATCH',
      headers: { Cookie: cookieHeader },
      body: { status: 'Shortlisted' },
    });
    assert(updateRes.status === 200, `PATCH /api/applications/:id status update returns 200 OK`);
    assert(updateRes.json?.application?.application_status === 'Shortlisted', `Application status successfully updated to 'Shortlisted'`);

    // 9. CSV Export Endpoint
    const exportRes = await request('/api/admin/export', {
      headers: { Cookie: cookieHeader },
    });
    assert(exportRes.status === 200, `GET /api/admin/export returns 200 OK`);
    assert(exportRes.text.includes('Application ID,Full Name,Roll Number'), `Export CSV includes expected header row`);
    assert(exportRes.text.includes(testRoll), `Export CSV contains submitted roll number`);

    // 10. Department-Specific Export
    const deptExportRes = await request('/api/admin/export?department=Technical', {
      headers: { Cookie: cookieHeader },
    });
    assert(deptExportRes.status === 200, `Department-filtered CSV export returns 200 OK`);

    // 11. Success Screen Page
    const successRes = await request(`/success?ref=${encodeURIComponent(refId)}`);
    assert(successRes.status === 200, `GET /success?ref=... returns 200 OK`);

    // 12. Admin Pages
    const adminDashRes = await request('/admin/dashboard');
    assert(adminDashRes.status === 200, `GET /admin/dashboard returns 200 OK`);

    const adminAppsRes = await request('/admin/applications');
    assert(adminAppsRes.status === 200, `GET /admin/applications returns 200 OK`);

    const adminAnalyticsRes = await request('/admin/analytics');
    assert(adminAnalyticsRes.status === 200, `GET /admin/analytics returns 200 OK`);

    console.log('\n================================================================');
    console.log(`VERIFICATION COMPLETE: ${passed}/${total} TESTS PASSED`);
    console.log('================================================================\n');

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    server.kill();
    process.exit(passed === total ? 0 : 1);
  }
}

main();
