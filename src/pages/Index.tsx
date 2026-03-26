import { useState } from "react";
import Icon from "@/components/ui/icon";

const ORDERS_URL = "https://functions.poehali.dev/189ffcdc-e8c2-414c-810e-af093301abe5";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  description: string;
  tag: string;
  tagColor: string;
  tagTextColor: string;
  img: string;
};

type CartItem = MenuItem & { qty: number };

type OrderForm = {
  name: string;
  phone: string;
  address: string;
  comment: string;
};

type CheckoutStep = "cart" | "form" | "success";

const MENU: MenuItem[] = [
  {
    id: 1,
    name: "Роллекс Классик",
    price: 590,
    description: "Лосось, авокадо, сливочный сыр, огурец — 8 штук.",
    tag: "Хит продаж",
    tagColor: "var(--primary)",
    tagTextColor: "#0d0d0d",
    img: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Огненный Дракон",
    price: 720,
    description: "Угорь, острый соус чили, манго, кунжут.",
    tag: "Острое",
    tagColor: "var(--secondary)",
    tagTextColor: "white",
    img: "https://images.unsplash.com/photo-1563612116625-3012372fccce?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "Ретро Маки",
    price: 480,
    description: "Тунец, васаби, нори — минимализм в лучшем виде. Набор 6 штук.",
    tag: "Новинка",
    tagColor: "var(--accent)",
    tagTextColor: "#0d0d0d",
    img: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "3px solid #c9a84c",
  background: "#1a1a1a",
  color: "#f5e6c0",
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 600,
  fontSize: "14px",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 700,
  fontSize: "13px",
  marginBottom: "6px",
  textTransform: "uppercase" as const,
  color: "rgba(245,230,192,0.8)",
};

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [form, setForm] = useState<OrderForm>({ name: "", phone: "", address: "", comment: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalCount = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const found = prev.find((c) => c.id === item.id);
      if (found) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
    setCartOpen(true);
  };

  const changeQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => c.id === id ? { ...c, qty: c.qty + delta } : c)
        .filter((c) => c.qty > 0)
    );
  };

  const openCart = () => {
    setCheckoutStep("cart");
    setError("");
    setCartOpen(true);
  };

  const closeCart = () => {
    if (loading) return;
    setCartOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const items = cart.map((c) => `${c.name} x${c.qty}`).join(", ");
    try {
      const res = await fetch(ORDERS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, comment: `${items}${form.comment ? ". " + form.comment : ""}` }),
      });
      if (res.ok) {
        setCheckoutStep("success");
        setCart([]);
      } else {
        setError("Что-то пошло не так. Попробуйте ещё раз.");
      }
    } catch {
      setError("Ошибка соединения. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grain-overlay" />

      {/* Cart Drawer */}
      {cartOpen && (
        <div
          onClick={closeCart}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 9000,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#111",
              border: "3px solid #c9a84c",
              borderRight: "none",
              width: "100%",
              maxWidth: "480px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Drawer header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "24px",
              borderBottom: "3px solid #c9a84c",
            }}>
              <h2 style={{
                fontFamily: "Unbounded, sans-serif",
                fontSize: "18px",
                fontWeight: 800,
                textTransform: "uppercase",
                color: "var(--accent)",
              }}>
                {checkoutStep === "form" ? "← Оформление" : "Корзина"}
                {checkoutStep === "cart" && totalCount > 0 && (
                  <span style={{ marginLeft: "10px", background: "var(--accent)", color: "#0d0d0d", padding: "2px 8px", fontSize: "13px" }}>
                    {totalCount}
                  </span>
                )}
              </h2>
              <button onClick={closeCart} style={{ background: "none", border: "none", color: "#f5e6c0", fontSize: "28px", fontWeight: 800, cursor: "pointer", lineHeight: 1 }}>
                ×
              </button>
            </div>

            {/* Drawer body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>

              {checkoutStep === "success" && (
                <div style={{ textAlign: "center", paddingTop: "40px" }}>
                  <div style={{ fontSize: "56px", marginBottom: "16px" }}>🍣</div>
                  <h3 style={{ fontFamily: "Unbounded, sans-serif", fontSize: "20px", fontWeight: 800, textTransform: "uppercase", color: "var(--accent)", marginBottom: "12px" }}>
                    ЗАКАЗ ПРИНЯТ!
                  </h3>
                  <p style={{ color: "rgba(245,230,192,0.7)", lineHeight: 1.6, marginBottom: "28px" }}>
                    Мы уже готовим ваши роллы. Скоро позвоним для подтверждения!
                  </p>
                  <button className="btn-cta" onClick={closeCart}>
                    Закрыть
                  </button>
                </div>
              )}

              {checkoutStep === "cart" && (
                <>
                  {cart.length === 0 ? (
                    <div style={{ textAlign: "center", paddingTop: "60px", color: "rgba(245,230,192,0.4)" }}>
                      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</div>
                      <p style={{ fontWeight: 700, textTransform: "uppercase", fontSize: "14px" }}>Корзина пуста</p>
                      <p style={{ fontSize: "13px", marginTop: "8px" }}>Добавьте роллы из меню</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {cart.map((item) => (
                        <div key={item.id} style={{
                          display: "flex",
                          gap: "14px",
                          alignItems: "center",
                          padding: "14px",
                          border: "2px solid #c9a84c33",
                          background: "#1a1a1a",
                        }}>
                          <img src={item.img} alt={item.name} style={{ width: "64px", height: "64px", objectFit: "cover", flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: "14px", color: "#f5e6c0", marginBottom: "4px" }}>{item.name}</div>
                            <div style={{ color: "var(--accent)", fontWeight: 800, fontSize: "16px" }}>{item.price * item.qty} ₽</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                            <button
                              onClick={() => changeQty(item.id, -1)}
                              style={{ width: "30px", height: "30px", border: "2px solid #c9a84c", background: "none", color: "var(--accent)", fontSize: "18px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >−</button>
                            <span style={{ fontWeight: 800, fontSize: "16px", color: "#f5e6c0", minWidth: "20px", textAlign: "center" }}>{item.qty}</span>
                            <button
                              onClick={() => changeQty(item.id, 1)}
                              style={{ width: "30px", height: "30px", border: "2px solid #c9a84c", background: "none", color: "var(--accent)", fontSize: "18px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {checkoutStep === "form" && (
                <form id="order-form" onSubmit={handleSubmit}>
                  {/* Order summary */}
                  <div style={{ padding: "14px", background: "#1a1a1a", border: "2px solid #c9a84c33", marginBottom: "24px" }}>
                    {cart.map((item) => (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "rgba(245,230,192,0.7)", marginBottom: "6px" }}>
                        <span>{item.name} × {item.qty}</span>
                        <span style={{ color: "var(--accent)", fontWeight: 700 }}>{item.price * item.qty} ₽</span>
                      </div>
                    ))}
                    <div style={{ borderTop: "1px solid #c9a84c44", marginTop: "10px", paddingTop: "10px", display: "flex", justifyContent: "space-between", fontWeight: 800, color: "#f5e6c0" }}>
                      <span>ИТОГО</span>
                      <span style={{ color: "var(--accent)" }}>{totalPrice} ₽</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                      <label style={labelStyle}>Имя *</label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ваше имя" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Телефон *</label>
                      <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+7 (___) ___-__-__" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Адрес доставки *</label>
                      <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Улица, дом, квартира" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Комментарий</label>
                      <textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Пожелания к заказу..." rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                    </div>
                  </div>

                  {error && (
                    <p style={{ color: "var(--primary)", fontWeight: 700, fontSize: "13px", marginTop: "12px" }}>{error}</p>
                  )}
                </form>
              )}
            </div>

            {/* Drawer footer */}
            {checkoutStep !== "success" && (
              <div style={{ padding: "24px", borderTop: "3px solid #c9a84c" }}>
                {checkoutStep === "cart" ? (
                  <>
                    {cart.length > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontWeight: 800, fontSize: "18px" }}>
                        <span style={{ color: "rgba(245,230,192,0.7)" }}>Итого:</span>
                        <span style={{ color: "var(--accent)" }}>{totalPrice} ₽</span>
                      </div>
                    )}
                    <button
                      className="btn-cta"
                      disabled={cart.length === 0}
                      onClick={() => { setCheckoutStep("form"); setError(""); }}
                      style={{ width: "100%", background: cart.length === 0 ? "#333" : "var(--accent)", color: "#0d0d0d", opacity: cart.length === 0 ? 0.5 : 1 }}
                    >
                      Перейти к оформлению →
                    </button>
                  </>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <button
                      type="submit"
                      form="order-form"
                      disabled={loading}
                      className="btn-cta"
                      style={{ width: "100%", background: "var(--accent)", color: "#0d0d0d", opacity: loading ? 0.6 : 1 }}
                    >
                      {loading ? "Отправляем..." : `Оформить заказ — ${totalPrice} ₽`}
                    </button>
                    <button
                      onClick={() => setCheckoutStep("cart")}
                      style={{ background: "none", border: "none", color: "rgba(245,230,192,0.5)", fontWeight: 700, fontSize: "13px", cursor: "pointer", textTransform: "uppercase" }}
                    >
                      ← Вернуться в корзину
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <header className="header">
        <div className="logo">РОЛЛЕКС</div>
        <nav>
          <a href="#">Меню</a>
          <a href="#">О нас</a>
          <a href="#">Акции</a>
          <a href="#">Доставка</a>
        </nav>
        <button className="btn-cta" onClick={openCart} style={{ position: "relative" }}>
          <Icon name="ShoppingCart" size={16} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
          Корзина
          {totalCount > 0 && (
            <span style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              background: "var(--primary)",
              color: "#0d0d0d",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              fontSize: "11px",
              fontWeight: 900,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {totalCount}
            </span>
          )}
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              РОЛЛЫ,
              <br />
              КОТОРЫЕ <span>РВУТ</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl mb-8 md:mb-10 leading-relaxed" style={{ color: "rgba(245,230,192,0.7)" }}>
              Свежие роллы с доставкой до твоей двери. Рис идеальной текстуры, лосось в маринаде и соусы собственного производства — ретро-вайб, современный вкус.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <button className="btn-cta" style={{ background: "var(--primary)", color: "#0d0d0d" }} onClick={openCart}>
                Заказать сейчас
              </button>
              <button className="btn-cta" style={{ background: "transparent", color: "var(--dark)" }}>
                Смотреть меню
              </button>
            </div>
          </div>
          <div className="hero-img">
            <img
              src="https://cdn.poehali.dev/projects/693b27c7-7779-4e28-b52e-884ac63c8c38/files/9d0fe12d-7367-44b2-8a65-4cd4fc55ccfd.jpg"
              alt="Роллекс - свежие роллы"
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }}
            />
            <div className="sticker">СВЕЖАК<br />КАЖДЫЙ ДЕНЬ</div>
            <div className="floating-tag hidden md:block" style={{ top: "20%", left: "10%" }}>#РОЛЛЕКС</div>
            <div className="floating-tag hidden md:block" style={{ bottom: "30%", right: "20%" }}>ОГОНЬ 🔥</div>
          </div>
        </section>

        <div className="marquee">
          <div className="marquee-content">
            &nbsp; * РОЛЛЫ КОТОРЫЕ РВУТ * СВЕЖИЙ ЛОСОСЬ ЕЖЕДНЕВНО * ТОЛЬКО РЕТРО ВАЙБ * ДОСТАВКА ЗА 40 МИНУТ * ЛУЧШИЕ В ГОРОДЕ *
            РОЛЛЫ КОТОРЫЕ РВУТ * СВЕЖИЙ ЛОСОСЬ ЕЖЕДНЕВНО * ТОЛЬКО РЕТРО ВАЙБ * ДОСТАВКА ЗА 40 МИНУТ * ЛУЧШИЕ В ГОРОДЕ
          </div>
        </div>

        <section className="section-padding">
          <div className="section-header">
            <h2 className="section-title">ХИТ СЕЗОНА</h2>
            <a href="#" className="text-sm md:text-base" style={{ color: "var(--dark)", fontWeight: 800, textTransform: "uppercase" }}>
              Всё меню
            </a>
          </div>

          <div className="menu-grid">
            {MENU.map((item) => {
              const inCart = cart.find((c) => c.id === item.id);
              return (
                <div key={item.id} className="menu-card">
                  <span className="menu-tag" style={{ background: item.tagColor, color: item.tagTextColor }}>{item.tag}</span>
                  <img src={item.img} alt={item.name} />
                  <div className="menu-card-body">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <h3>{item.name}</h3>
                      <span className="price">{item.price} ₽</span>
                    </div>
                    <p style={{ fontSize: "14px", color: "rgba(245,230,192,0.65)", marginBottom: "14px" }}>{item.description}</p>

                    {inCart ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "0", border: "3px solid #c9a84c" }}>
                        <button
                          onClick={() => changeQty(item.id, -1)}
                          style={{ flex: 1, padding: "10px", background: "none", border: "none", color: "var(--accent)", fontSize: "20px", fontWeight: 800, cursor: "pointer" }}
                        >−</button>
                        <span style={{ padding: "10px 16px", fontWeight: 800, color: "#f5e6c0", fontSize: "15px", borderLeft: "2px solid #c9a84c44", borderRight: "2px solid #c9a84c44" }}>{inCart.qty}</span>
                        <button
                          onClick={() => changeQty(item.id, 1)}
                          style={{ flex: 1, padding: "10px", background: "none", border: "none", color: "var(--accent)", fontSize: "20px", fontWeight: 800, cursor: "pointer" }}
                        >+</button>
                      </div>
                    ) : (
                      <button
                        className="btn-cta"
                        style={{ width: "100%", background: "var(--accent)", color: "#0d0d0d" }}
                        onClick={() => addToCart(item)}
                      >
                        В корзину
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="retro-vibe">
          <div>
            <h2 className="vibe-title">СВЕЖЕСТЬ — НАШ СТАНДАРТ.</h2>
            <p className="vibe-text">
              Каждый день — новая рыба. Мы работаем только с проверенными поставщиками, рис готовим по японской технологии, а соусы варим сами. Роллекс — это не просто доставка, это вкус, которому доверяют.
            </p>
            <button className="btn-cta" style={{ background: "#0d0d0d", color: "var(--accent)", borderColor: "var(--accent)" }} onClick={openCart}>
              Заказать сейчас
            </button>
          </div>
          <div className="vibe-img"></div>
        </section>

        <section className="section-padding">
          <h2 className="section-title" style={{ marginBottom: "40px", textAlign: "center" }}>
            @ROLLEX.SUSHI
          </h2>
          <div className="social-grid">
            <div className="social-item">
              <img src="https://images.unsplash.com/photo-1617196034183-421b4040ed20?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Роллы 1" />
            </div>
            <div className="social-item">
              <img src="https://images.unsplash.com/photo-1562802378-063ec186a863?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Роллы 2" />
            </div>
            <div className="social-item">
              <img src="https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Роллы 3" />
            </div>
            <div className="social-item">
              <img src="https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Роллы 4" />
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div>
          <div className="footer-logo">РОЛЛЕКС</div>
          <p style={{ color: "rgba(245,230,192,0.6)", lineHeight: 1.6 }}>
            Доставка роллов в ретро-стиле. Свежо, вкусно и быстро — с 2024, но ощущается как культовое место.
          </p>
        </div>
        <div className="footer-links">
          <h4>Навигация</h4>
          <ul>
            <li><a href="#" style={{ color: "inherit", textDecoration: "none" }}>Меню</a></li>
            <li><a href="#" style={{ color: "inherit", textDecoration: "none" }}>О нас</a></li>
            <li><a href="#" style={{ color: "inherit", textDecoration: "none" }}>Акции</a></li>
            <li><a href="#" style={{ color: "inherit", textDecoration: "none" }}>Политика</a></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Контакты</h4>
          <ul>
            <li>+7 (800) 555-35-35</li>
            <li>hello@rollex.ru</li>
            <li>Пн–Вс: 10:00 – 23:00</li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Доставка</h4>
          <ul>
            <li>За 40 минут</li>
            <li>Бесплатно от 1000 ₽</li>
            <li>По всему городу</li>
          </ul>
        </div>
      </footer>
    </>
  );
}
