import { execSync } from 'node:child_process';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { prisma } from '../src/lib/prisma';

describe('Daily Diet API — Fluxo Completo & Permissões', () => {
  beforeAll(async () => {
    const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    execSync(`${npxCmd} prisma db push --skip-generate`, {
      env: { ...process.env, DATABASE_URL: 'file:./test.db' },
      stdio: 'ignore',
    });
  }, 30000);

  beforeEach(async () => {
    await prisma.meal.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.meal.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('deve criar um usuário, autenticar e identificá-lo entre requisições', async () => {
    const registerRes = await request(app).post('/api/users').send({
      name: 'Lucas Mendes',
      email: 'lucas@exemplo.com',
      password: 'password123',
      dietGoal: 85,
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.user).toMatchObject({
      name: 'Lucas Mendes',
      email: 'lucas@exemplo.com',
      dietGoal: 85,
    });
    expect(registerRes.body.token).toEqual(expect.any(String));

    const loginRes = await request(app).post('/api/sessions').send({
      email: 'lucas@exemplo.com',
      password: 'password123',
    });

    expect(loginRes.status).toBe(200);
    const token = loginRes.body.token;

    const meRes = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe('lucas@exemplo.com');
  });

  it('deve registrar, listar, visualizar individualmente, editar todos os campos e apagar uma refeição', async () => {
    const { body: auth } = await request(app).post('/api/users').send({
      name: 'Ana Paula',
      email: 'ana@exemplo.com',
      password: 'password123',
    });

    const token = auth.token;

    // 1. Registrar refeição
    const createRes = await request(app)
      .post('/api/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Café da Manhã Proteico',
        description: 'Ovos mexidos, pão integral e fruta',
        consumedAt: '2026-11-06T08:00:00.000Z',
        isOnDiet: true,
      });

    expect(createRes.status).toBe(201);
    const mealId = createRes.body.meal.id;
    expect(createRes.body.meal.userId).toBe(auth.user.id);

    // 2. Listar todas as refeições do usuário
    const listRes = await request(app)
      .get('/api/meals')
      .set('Authorization', `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.meals).toHaveLength(1);
    expect(listRes.body.meals[0].name).toBe('Café da Manhã Proteico');

    // 3. Visualizar uma única refeição
    const showRes = await request(app)
      .get(`/api/meals/${mealId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(showRes.status).toBe(200);
    expect(showRes.body.meal.description).toBe('Ovos mexidos, pão integral e fruta');

    // 4. Editar todas as informações da refeição
    const updateRes = await request(app)
      .put(`/api/meals/${mealId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Brunch de Domingo',
        description: 'Panqueca americana com calda extra',
        consumedAt: '2026-11-06T10:30:00.000Z',
        isOnDiet: false,
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.meal).toMatchObject({
      id: mealId,
      name: 'Brunch de Domingo',
      description: 'Panqueca americana com calda extra',
      consumedAt: '2026-11-06T10:30:00.000Z',
      isOnDiet: false,
    });

    // 5. Apagar refeição
    const deleteRes = await request(app)
      .delete(`/api/meals/${mealId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.status).toBe(204);

    const afterDeleteRes = await request(app)
      .get(`/api/meals/${mealId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(afterDeleteRes.status).toBe(404);
  });

  it('deve calcular corretamente as métricas do usuário incluindo a melhor sequência dentro da dieta', async () => {
    const { body: auth } = await request(app).post('/api/users').send({
      name: 'Rafael Lima',
      email: 'rafael@exemplo.com',
      password: 'password123',
    });

    const token = auth.token;

    // Sequência: Sim (1), Sim (2), Sim (3), Não (quebra), Sim (1), Sim (2) -> Melhor sequência = 3, Atual = 2
    const mealsSequence = [
      { name: 'Refeição 1', consumedAt: '2026-11-04T08:00:00.000Z', isOnDiet: true },
      { name: 'Refeição 2', consumedAt: '2026-11-04T12:00:00.000Z', isOnDiet: true },
      { name: 'Refeição 3', consumedAt: '2026-11-04T19:00:00.000Z', isOnDiet: true },
      { name: 'Refeição Livre', consumedAt: '2026-11-05T12:00:00.000Z', isOnDiet: false },
      { name: 'Refeição 5', consumedAt: '2026-11-05T19:00:00.000Z', isOnDiet: true },
      { name: 'Refeição 6', consumedAt: '2026-11-06T08:00:00.000Z', isOnDiet: true },
    ];

    for (const item of mealsSequence) {
      await request(app)
        .post('/api/meals')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...item,
          description: 'Descrição detalhada da refeição',
        });
    }

    const metricsRes = await request(app)
      .get('/api/meals/metrics')
      .set('Authorization', `Bearer ${token}`);

    expect(metricsRes.status).toBe(200);
    expect(metricsRes.body.metrics).toMatchObject({
      totalMeals: 6,
      onDietMeals: 5,
      offDietMeals: 1,
      bestOnDietStreak: 3,
      currentOnDietStreak: 2,
    });
  });

  it('deve impedir que um usuário visualize, edite ou apague refeições criadas por outro usuário', async () => {
    const { body: userA } = await request(app).post('/api/users').send({
      name: 'Usuária A',
      email: 'usera@exemplo.com',
      password: 'password123',
    });

    const { body: userB } = await request(app).post('/api/users').send({
      name: 'Usuário B',
      email: 'userb@exemplo.com',
      password: 'password123',
    });

    const mealRes = await request(app)
      .post('/api/meals')
      .set('Authorization', `Bearer ${userA.token}`)
      .send({
        name: 'Jantar da Usuária A',
        description: 'Sopa de legumes com frango desfiado',
        consumedAt: '2026-11-06T20:00:00.000Z',
        isOnDiet: true,
      });

    const mealId = mealRes.body.meal.id;

    // Usuário B não vê na listagem dele
    const listB = await request(app)
      .get('/api/meals')
      .set('Authorization', `Bearer ${userB.token}`);
    expect(listB.body.meals).toHaveLength(0);

    // Usuário B bloqueado ao tentar visualizar refeição de A
    const showB = await request(app)
      .get(`/api/meals/${mealId}`)
      .set('Authorization', `Bearer ${userB.token}`);
    expect(showB.status).toBe(403);

    // Usuário B bloqueado ao tentar editar refeição de A
    const updateB = await request(app)
      .put(`/api/meals/${mealId}`)
      .set('Authorization', `Bearer ${userB.token}`)
      .send({
        name: 'Tentativa Indevida',
        description: 'Alteração bloqueada',
        consumedAt: '2026-11-06T21:00:00.000Z',
        isOnDiet: false,
      });
    expect(updateB.status).toBe(403);

    // Usuário B bloqueado ao tentar apagar refeição de A
    const deleteB = await request(app)
      .delete(`/api/meals/${mealId}`)
      .set('Authorization', `Bearer ${userB.token}`);
    expect(deleteB.status).toBe(403);
  });
});
