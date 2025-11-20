import express from 'express';
import { notificationRoutes } from './interfaces/http/routes';

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());
app.use('/api/v1', notificationRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'notification-service' });
});

app.listen(PORT, () => {
  console.log(`[NotificationService] Server running on port ${PORT}`);
});

