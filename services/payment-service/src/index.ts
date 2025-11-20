import express from 'express';
import { paymentRoutes } from './interfaces/http/routes';

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());
app.use('/api/v1', paymentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'payment-service' });
});

app.listen(PORT, () => {
  console.log(`[PaymentService] Server running on port ${PORT}`);
});

