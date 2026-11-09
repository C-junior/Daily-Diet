import { prisma } from '../src/lib/prisma';
import { SessionsService } from '../src/services/SessionsService';

async function main() {
  const sessionsService = new SessionsService();
  const { user } = await sessionsService.authenticateDemo();
  console.log(`✅ Usuário de demonstração pronto: ${user.email} (senha: demo123)`);
}

main()
  .catch((err) => {
    console.error('Erro ao executar seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
