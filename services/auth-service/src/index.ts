import express from 'express';
import { authRoutes } from './interfaces/http/routes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api/v1', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

app.listen(PORT, () => {
  console.log(`[AuthService] Server running on port ${PORT}`);
});

