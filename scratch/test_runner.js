const BASE_URL = 'http://localhost:3000/api';

async function runTest(name, fetchConfig, expectedStatus) {
  try {
    const response = await fetch(`${BASE_URL}${fetchConfig.path}`, {
      method: fetchConfig.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...fetchConfig.headers
      },
      body: fetchConfig.body ? JSON.stringify(fetchConfig.body) : undefined
    });

    if (response.status === expectedStatus) {
      console.log(`✅ PASS: ${name} (Expected ${expectedStatus}, Got ${response.status})`);
      return { success: true, data: await response.json().catch(() => null) };
    } else {
      const errorText = await response.text();
      console.error(`❌ FAIL: ${name} (Expected ${expectedStatus}, Got ${response.status}) - ${errorText}`);
      return { success: false };
    }
  } catch (error) {
    console.error(`❌ FAIL: ${name} (Network Error) - ${error.message}`);
    return { success: false };
  }
}

async function main() {
  console.log('--- STARTING COMPREHENSIVE API TEST ---');

  // 1. Auth Setup
  const adminLogin = await runTest('Admin Login', { path: '/auth/login', method: 'POST', body: { email: 'admin@example.com', password: 'AdminPassword123!' } }, 200);
  const customerLogin = await runTest('Customer Login', { path: '/auth/login', method: 'POST', body: { email: 'customer@example.com', password: 'CustomerPassword123!' } }, 200);

  const adminToken = `Bearer ${adminLogin.data.token}`;
  const customerToken = `Bearer ${customerLogin.data.token}`;

  // 2. Products
  const productsReq = await runTest('GET /products (Public)', { path: '/products' }, 200);
  const p1Id = productsReq.data[0].id;
  const p2Id = productsReq.data[1].id;

  await runTest('GET /products/1 (Public)', { path: `/products/${p1Id}` }, 200);
  await runTest('GET /products/abc (Validation Error)', { path: '/products/abc' }, 400);
  
  await runTest('POST /products (Admin)', { path: '/products', method: 'POST', headers: { Authorization: adminToken }, body: { name: "Test Item", description: "Desc", price: 10 } }, 201);
  await runTest('POST /products (Customer - Forbidden)', { path: '/products', method: 'POST', headers: { Authorization: customerToken }, body: { name: "Test", description: "Desc", price: 10 } }, 403);
  await runTest('POST /products (No Auth - Unauthorized)', { path: '/products', method: 'POST', body: { name: "Test", description: "Desc", price: 10 } }, 401);
  
  await runTest('PUT /products/1 (Admin)', { path: `/products/${p1Id}`, method: 'PUT', headers: { Authorization: adminToken }, body: { price: 999 } }, 200);
  await runTest('DELETE /products/2 (Admin)', { path: `/products/${p2Id}`, method: 'DELETE', headers: { Authorization: adminToken } }, 204);

  // 3. Reviews
  await runTest('GET /reviews (Public)', { path: '/reviews' }, 200);
  await runTest('GET /reviews/product/1 (Public)', { path: `/reviews/product/${p1Id}` }, 200);
  
  const newReview = await runTest('POST /reviews (Customer)', { path: '/reviews', method: 'POST', headers: { Authorization: customerToken }, body: { rating: 5, comment: "Test", productId: p1Id } }, 201);
  await runTest('POST /reviews (Validation Error)', { path: '/reviews', method: 'POST', headers: { Authorization: customerToken }, body: { rating: 10, productId: p1Id } }, 400);
  
  if (newReview.success && newReview.data) {
    const reviewId = newReview.data.id;
    await runTest(`PUT /reviews/${reviewId} (Owner)`, { path: `/reviews/${reviewId}`, method: 'PUT', headers: { Authorization: customerToken }, body: { rating: 4 } }, 200);
    await runTest(`PUT /reviews/${reviewId} (Admin - Forbidden)`, { path: `/reviews/${reviewId}`, method: 'PUT', headers: { Authorization: adminToken }, body: { rating: 4 } }, 403);
    await runTest(`DELETE /reviews/${reviewId} (Admin override)`, { path: `/reviews/${reviewId}`, method: 'DELETE', headers: { Authorization: adminToken } }, 204);
  }

  // 4. Orders
  const newOrder = await runTest('POST /orders (Customer)', { path: '/orders', method: 'POST', headers: { Authorization: customerToken }, body: { items: [{ productId: p1Id, quantity: 1 }] } }, 201);
  await runTest('POST /orders (Invalid quantity)', { path: '/orders', method: 'POST', headers: { Authorization: customerToken }, body: { items: [{ productId: p1Id, quantity: 99999 }] } }, 400);
  
  await runTest('GET /orders (Customer)', { path: '/orders', headers: { Authorization: customerToken } }, 200);
  
  if (newOrder.success && newOrder.data) {
    const orderId = newOrder.data.id;
    await runTest(`GET /orders/${orderId} (Owner)`, { path: `/orders/${orderId}`, headers: { Authorization: customerToken } }, 200);
    await runTest(`PUT /orders/${orderId} (Admin)`, { path: `/orders/${orderId}`, method: 'PUT', headers: { Authorization: adminToken }, body: { status: 'COMPLETED' } }, 200);
    await runTest(`DELETE /orders/${orderId} (Admin)`, { path: `/orders/${orderId}`, method: 'DELETE', headers: { Authorization: adminToken } }, 204);
  }

  console.log('--- COMPREHENSIVE TEST COMPLETE ---');
}

main();
