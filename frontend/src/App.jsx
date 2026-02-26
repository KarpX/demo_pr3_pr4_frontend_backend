import { useEffect, useMemo, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "./api/productsApi";
import "./app.css";

/**
 * Практика 4 (заготовка).
 * Важно: это НЕ готовое решение. В файле api/productsApi.js стоят TODO.
 * Цель: подключить React к вашему Express API и выполнить базовый CRUD.
 */
export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Минимальная форма добавления товара
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [img, setImg] = useState("");

  const canSubmit = useMemo(
    () => title.trim() !== "" && price !== "",
    [title, price],
  );

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await getProducts(); // TODO: заработает после реализации productsApi.js
      setItems(data);
      console.log("items", items);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onAdd(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setError("");
    try {
      await createProduct({
        title: title.trim(),
        // TODO (студентам): дополнить payload полями category/description/stock/...
        price: Number(price),
        description: description.trim(),
        stock: Number(stock),
        category: category.trim(),
        imageUrl: img.trim(),
      });
      setTitle("");
      setPrice("");
      setDescription("");
      setStock("");
      setImg("");
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  async function onDelete(id) {
    setError("");
    try {
      await deleteProduct(id);
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  async function onPricePlus(id, currentPrice) {
    setError("");
    try {
      await updateProduct(id, { price: Number(currentPrice) + 10 });
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
        fontFamily: "system-ui",
      }}
    >
      <h1>Практика 4 — React + Express API</h1>

      <section
        style={{
          marginTop: 24,
          padding: 16,
          border: "1px solid #ddd",
          borderRadius: 12,
        }}
        id="product-add"
      >
        <h2 style={{ marginTop: 0 }}>Добавить товар</h2>
        <form
          onSubmit={onAdd}
          style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
        >
          <div className="inputs">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название"
            />
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Цена"
              type="number"
            />
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Категория"
              type="string"
            ></input>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание"
              type="string"
            ></input>
            <input
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Остаток на складе"
              type="number"
            ></input>
            <input
              id="img"
              value={img}
              onChange={(e) => setImg(e.target.value)}
              placeholder="URL картинки"
              type="string"
            ></input>
          </div>

          <div className="buttons">
            <button disabled={!canSubmit} style={{ padding: "10px 14px" }}>
              Добавить
            </button>
            <button
              type="button"
              onClick={load}
              style={{ padding: "10px 14px" }}
            >
              Обновить список
            </button>
          </div>
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Список товаров</h2>

        {loading && <p>Загрузка...</p>}
        {error && (
          <p style={{ color: "crimson" }}>
            Ошибка: {error}
            <br />
            Проверьте, что: (1) backend запущен на 3000, (2) CORS настроен, (3)
            TODO в productsApi.js реализованы.
          </p>
        )}

        <ul style={{ paddingLeft: 18 }}>
          {items.map((p) => (
            <li key={p.id} style={{ marginBottom: 8 }}>
              <img src={p.imageUrl} alt={p.title} />
              <div id="main-info">
                <h2>
                  <b>{p.title}</b>
                </h2>
                <p id="description">{p.description}</p>
                <p id="category">{p.category} </p>
              </div>

              <p id="price">{p.price} ₽ </p>
              <p>{`На складе: ${p.stock}`}</p>
              <div className="buttons">
                <button
                  onClick={() => onPricePlus(p.id, p.price)}
                  style={{ marginLeft: 8 }}
                >
                  +10 ₽
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  style={{ marginLeft: 8 }}
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
