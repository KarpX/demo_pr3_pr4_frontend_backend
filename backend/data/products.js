/**
 * Начальные данные (стартовые товары).
 * В практиках 3–4 мы используем in-memory массив (без БД).
 * Студенты могут расширить схему полями: category, description, stock, rating, imageUrl и т.д.
 */
module.exports = [
  {
    id: "p1",
    title: "Печенье",
    category: "Сладости",
    description: "Хрустящее печенье к чаю.",
    price: 79,
    stock: 20,
    rating: 4.6,
    imageUrl:
      "https://i.pinimg.com/1200x/82/ed/91/82ed916a09e44f70aed5338ec9a33119.jpg",
  },
  {
    id: "p2",
    title: "Молоко",
    category: "Напитки",
    description: "Ультрапастеризованное 2.5%.",
    price: 99,
    stock: 15,
    rating: 4.3,
    imageUrl:
      "https://i.pinimg.com/736x/5c/0c/b2/5c0cb22075392489ad98e58b172e4efb.jpg",
  },
  {
    id: "p3",
    title: "Хлеб",
    category: "Выпечка",
    description: "Свежий, мягкий, 400 г.",
    price: 59,
    stock: 30,
    rating: 4.1,
    imageUrl:
      "https://i.pinimg.com/736x/3e/19/5d/3e195d55ea6db98c93be2714e376cffb.jpg",
  },
];
