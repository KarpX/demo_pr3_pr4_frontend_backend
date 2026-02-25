const express = require("express");

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const cors = require("cors");

const logger = require("./middleware/logger");
const productsRouter = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API управления продуктами",
      version: "1.0.0",
      description: "Простое API для управления продуктами",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Локальный сервер",
      },
    ],
  },
  apis: ["./app.js", "./products.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/** @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - price
 *         - stock
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: Уникальный идентификатор продукта
 *         title:
 *           type: string
 *           description: Название продукта
 *         category:
 *           type: string
 *           description: Категория продукта
 *         description:
 *           type: string
 *           description: Описание продукта
 *         price:
 *           type: number
 *           description: Цена продукта
 *         stock:
 *           type: number
 *           description: Количество товара на складе
 *         rating:
 *           type: number
 *           description: Рейтинг продукта
 *         imageUrl:
 *           type: string
 *           description: URL изображения продукта
 *       example:
 *         id: "abc123"
 *         title: "Пример продукта"
 *         category: "Категория 1"
 *         description: "Это пример продукта для демонстрации схемы"
 *         price: 99.99
 *         stock: 10
 *         rating: 4.5
 */

/**@swagger
 * /api/products:
 *   get:
 *     summary: Получить список всех продуктов
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Успешный ответ с массивом продуктов
 */

/**@swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить информацию о конкретном продукте по его id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: Уникальный идентификатор продукта
 *     responses:
 *       200:
 *         description: Успешный ответ с информацией о продукте
 *       404:
 *         description: Продукт не найден
 */

/**@swagger
 * /api/products:
 *   post:
 *     summary: Добавить новый продукт
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           properties:
 *             title:
 *               type: string
 *             category:
 *               type: string
 *             description:
 *               type: string
 *             price:
 *               type: number
 *             stock:
 *               type: number
 *             rating:
 *               type: number
 *             imageUrl:
 *               type: string
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Успешно создан новый продукт
 *       400:
 *         description: Некорректные данные запроса
 */

/**@swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновить информацию о конкретном продукте по его id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Уникальный идентификатор продукта
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Product'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           properties:
 *             title:
 *               type: string
 *             category:
 *               type: string
 *             description:
 *               type: string
 *             price:
 *               type: number
 *             stock:
 *               type: number
 *             rating:
 *               type: number
 *             imageUrl:
 *               type: string
 *     responses:
 *       200:
 *         description: Успешное обновление информации о продукте
 *       400:
 *         description: Некорректные данные запроса
 *       404:
 *         description: Продукт не найден
 */

/**@swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить конкретный продукт по его id
 *     tags: [Products]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *          description: Уникальный идентификатор продукта
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Успешное удаление продукта
 *       404:
 *         description: Продукт не найден
 */

/**
 * Конвейер обработки запроса (pipeline) в Express:
 * 1) middleware (app.use(...)) выполняются сверху вниз
 * 2) затем роуты (app.use('/api/...', router))
 * 3) если никто не ответил — можно отдать 404
 */

// 1) Разрешаем запросы с фронта (React dev server)
// Если у вас другой порт фронта — поменяйте origin.
app.use(
  cors({
    origin: "http://localhost:3001",
  }),
);

// 2) Парсим JSON из тела запроса -> req.body
app.use(express.json());

// 3) Наш логгер (для наглядности)
app.use(logger);

// Healthcheck / главная
app.get("/", (req, res) => {
  res.send("Express API is running. Try /api/products");
});

// 4) Роуты API (все пути /api/products/... обрабатывает productsRouter)
app.use("/api/products", productsRouter);

// 5) Если не совпало ни с одним роутом — 404
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
});
