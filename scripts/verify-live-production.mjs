import http from 'http';

const BASE_URL = process.env.LIVE_URL || 'https://cyberfest2027-volunteer-recruitment.vercel.app';

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

async function runLiveTests() {
  console.log('================================================================');
  console.log('CYBERFEST 2027 — LIVE PRODUCTION TESTING SUITE');
  console.log(`Target Host: ${BASE_URL}`);
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

  // 1. Live Homepage
  const homeRes = await request('/');
  assert(homeRes.status === 200, 'GET / on production returns 200 OK');
  assert(homeRes.text.includes('CYBERFEST'), 'Production homepage contains CYBERFEST');
  assert(homeRes.text.includes('Digital Defence Club'), 'Production homepage contains Digital Defence Club branding');
  assert(homeRes.text.includes('Think Beyond. Defend Beyond.'), 'Production homepage contains club tagline');

  // 2. Live Apply Page
  const applyRes = await request('/apply');
  assert(applyRes.status === 200, 'GET /apply on production returns 200 OK');
  assert(applyRes.text.includes('Volunteer Application'), 'Apply page contains application header');

  // 3. Application Submission on Live Production
  const testRoll = `160123733${Math.floor(100 + Math.random() * 900)}`;
  const submitRes = await request('/api/applications', {
    method: 'POST',
    body: {
      fullName: 'Koushik Live Test',
      rollNumber: testRoll,
      areasOfInterest: ['Technical', 'Events'],
    },
  });

  assert(submitRes.status === 201, `POST /api/applications returns 201 Created on production`);
  assert(submitRes.json?.success === true, `Submission JSON has success: true`);
  const refId = submitRes.json?.application?.application_id;
  const appId = submitRes.json?.application?.id;
  assert(Boolean(refId), `Generated live Application Reference ID: ${refId}`);

  // 4. Duplicate Roll Number Rejection on Live Production
  const duplicateRes = await request('/api/applications', {
    method: 'POST',
    body: {
      fullName: 'Koushik Live Test Duplicate',
      rollNumber: testRoll,
      areasOfInterest: ['Design'],
    },
  });

  assert(duplicateRes.status === 409, `Duplicate submission returns 409 Conflict`);
  assert(duplicateRes.json?.success === false, `Duplicate submission rejected with success: false`);
  assert(duplicateRes.json?.error?.includes('already been submitted'), `Duplicate returns expected warning`);

  // 5. Query Application Confirmation Status
  const refQueryRes = await request(`/api/applications?ref=${encodeURIComponent(refId)}`);
  assert(refQueryRes.status === 200, `GET /api/applications?ref=... returns 200 OK`);
  assert(refQueryRes.json?.application?.roll_number === testRoll, `Queried application matches roll number ${testRoll}`);
  assert(refQueryRes.json?.application?.application_status === 'Pending', `Initial application status is 'Pending'`);

  // 6. Success Screen Page
  const successRes = await request(`/success?ref=${encodeURIComponent(refId)}`);
  assert(successRes.status === 200, `GET /success?ref=... returns 200 OK`);

  // 7. Security: Unauthorized Admin Access Prevention
  const unauthRes = await request('/api/admin/stats');
  assert(unauthRes.status === 401, `Unauthenticated visitor blocked from /api/admin/stats (401 Unauthorized)`);

  // 8. Admin Authentication (Only Password Required)
  const badLoginRes = await request('/api/admin/auth', {
    method: 'POST',
    body: { password: 'wrongpassword' },
  });
  assert(badLoginRes.status === 401, `Invalid admin credentials rejected with 401 Unauthorized`);

  const goodLoginRes = await request('/api/admin/auth', {
    method: 'POST',
    body: { password: '123456789' },
  });
  assert(goodLoginRes.status === 200, `Admin password authenticated successfully with 200 OK`);

  const setCookie = goodLoginRes.headers.get('set-cookie');
  const cookieHeader = setCookie?.split(';')[0] || '';
  assert(Boolean(cookieHeader), `Admin session token cookie established`);

  // 9. Admin Dashboard Access & Metrics
  const authStats = await request('/api/admin/stats', {
    headers: { Cookie: cookieHeader },
  });
  assert(authStats.status === 200, `Authenticated request to /api/admin/stats returns 200 OK`);
  assert(authStats.json?.stats?.total >= 1, `Total applications metric >= 1 (${authStats.json?.stats?.total})`);

  // 10. Application Status Updates on Live Production
  const updateRes = await request(`/api/applications/${appId}`, {
    method: 'PATCH',
    headers: { Cookie: cookieHeader },
    body: { status: 'Shortlisted' },
  });
  assert(updateRes.status === 200, `PATCH /api/applications/:id returns 200 OK`);
  assert(updateRes.json?.application?.application_status === 'Shortlisted', `Application status transitioned to 'Shortlisted'`);

  // 11. Department Filtering
  const deptQuery = await request('/api/applications?department=Technical', {
    headers: { Cookie: cookieHeader },
  });
  assert(deptQuery.status === 200, `GET /api/applications?department=Technical returns 200 OK`);

  // 12. CSV Export on Live Production
  const exportRes = await request('/api/admin/export', {
    headers: { Cookie: cookieHeader },
  });
  assert(exportRes.status === 200, `GET /api/admin/export returns 200 OK`);
  assert(exportRes.text.includes('Application ID,Full Name,Roll Number'), `CSV export contains headers`);
  assert(exportRes.text.includes(testRoll), `CSV export contains candidate roll number`);

  // 12.5 Cleanup Test Application to keep original data only
  const deleteRes = await request(`/api/applications/${appId}`, {
    method: 'DELETE',
    headers: { Cookie: cookieHeader },
  });
  assert(deleteRes.status === 200, `Cleanup test record succeeded (admin panel kept with original data only)`);

  // 13. Admin Dashboard & Registry Pages
  const adminDashRes = await request('/admin/dashboard');
  assert(adminDashRes.status === 200, `GET /admin/dashboard returns 200 OK`);

  const adminAppsRes = await request('/admin/applications');
  assert(adminAppsRes.status === 200, `GET /admin/applications returns 200 OK`);

  const adminAnalyticsRes = await request('/admin/analytics');
  assert(adminAnalyticsRes.status === 200, `GET /admin/analytics returns 200 OK`);

  console.log('\n================================================================');
  console.log(`LIVE PRODUCTION TEST SUMMARY: ${passed}/${total} TESTS PASSED`);
  console.log('================================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runLiveTests().catch((err) => {
  console.error('Live production test execution error:', err);
  process.exit(1);
});
