import { app } from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`🚀 Daily Diet API rodando em http://localhost:${env.PORT}`);
});
