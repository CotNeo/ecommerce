import express from 'express';
import { cartRoutes } from './interfaces/http/routes';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use('/api/v1', cartRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'cart-service' });
});

app.listen(PORT, () => {
  console.log(`[CartService] Server running on port ${PORT}`);
});

