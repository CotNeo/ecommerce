import express from 'express';
import { orderRoutes } from './interfaces/http/routes';

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());
app.use('/api/v1', orderRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'order-service' });
});

app.listen(PORT, () => {
  console.log(`[OrderService] Server running on port ${PORT}`);
});

