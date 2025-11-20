import express from 'express';
import { catalogRoutes } from './interfaces/http/routes';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use('/api/v1', catalogRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'catalog-service' });
});

app.listen(PORT, () => {
  console.log(`[CatalogService] Server running on port ${PORT}`);
});

