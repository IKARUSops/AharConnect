// GET /api/restaurants/:id/analytics/daily-sales
router.get('/:id/analytics/daily-sales', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Not found' });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dailyOrders = restaurant.orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= today && orderDate < tomorrow;
    });
    const totalSales = dailyOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    res.json({ date: today.toISOString().slice(0, 10), totalSales, orderCount: dailyOrders.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/restaurants/:id/analytics/top-items
router.get('/:id/analytics/top-items', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Not found' });
    const itemSales = {};
    restaurant.orders.forEach(order => {
      order.items.forEach(item => {
        if (!itemSales[item.menuItemId]) itemSales[item.menuItemId] = 0;
        itemSales[item.menuItemId] += item.quantity;
      });
    });
    const topItems = Object.entries(itemSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([menuItemId, quantity]) => ({ menuItemId, quantity }));
    res.json({ topItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/restaurants/:id/analytics/reservations
router.get('/:id/analytics/reservations', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Not found' });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dailyReservations = restaurant.reservations.filter(resv => {
      const resvDate = new Date(resv.date);
      return resvDate >= today && resvDate < tomorrow;
    });
    res.json({ date: today.toISOString().slice(0, 10), reservationCount: dailyReservations.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 