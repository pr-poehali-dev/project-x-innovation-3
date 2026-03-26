import { useState } from "react";

const ORDERS_URL = "https://functions.poehali.dev/189ffcdc-e8c2-414c-810e-af093301abe5";

type OrderForm = {
  name: string;
  phone: string;
  address: string;
  comment: string;
};

type ModalState = "idle" | "loading" | "success" | "error";

export default function Index() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<OrderForm>({ name: "", phone: "", address: "", comment: "" });
  const [modalState, setModalState] = useState<ModalState>("idle");

  const openModal = () => {
    setModalState("idle");
    setForm({ name: "", phone: "", address: "", comment: "" });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (modalState === "loading") return;
    setModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalState("loading");
    try {
      const res = await fetch(ORDERS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setModalState("success");
      } else {
        setModalState("error");
      }
    } catch {
      setModalState("error");
    }
  };

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
    textTransform: "uppercase",
  };

  return (
    <>
      <div className="grain-overlay" />

      {/* Modal */}
      {modalOpen && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            zIndex: 9000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#111111",
              border: "var(--border)",
              boxShadow: "var(--shadow)",
              padding: "36px",
              width: "100%",
              maxWidth: "480px",
              position: "relative",
            }}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "14px",
                right: "18px",
                background: "none",
                border: "none",
                fontSize: "28px",
                fontWeight: 800,
                cursor: "pointer",
                lineHeight: 1,
                color: "var(--dark)",
              }}
            >
              ×
            </button>

            {modalState === "success" ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "52px", marginBottom: "16px" }}>🍣</div>
                <h2
                  style={{
                    fontFamily: "Unbounded, sans-serif",
                    fontSize: "22px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    marginBottom: "12px",
                  }}
                >
                  ЗАКАЗ ПРИНЯТ!
                </h2>
                <p style={{ color: "#666", marginBottom: "24px", lineHeight: 1.6 }}>
                  Мы уже готовим ваши роллы. Скоро позвоним для подтверждения!
                </p>
                <button className="btn-cta" style={{ background: "var(--accent)" }} onClick={closeModal}>
                  Отлично!
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2
                  style={{
                    fontFamily: "Unbounded, sans-serif",
                    fontSize: "20px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    marginBottom: "24px",
                  }}
                >
                  ОФОРМИТЬ ЗАКАЗ
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label style={labelStyle}>Имя *</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Ваше имя"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Телефон *</label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+7 (___) ___-__-__"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Адрес доставки *</label>
                    <input
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Улица, дом, квартира"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Что заказываем?</label>
                    <textarea
                      value={form.comment}
                      onChange={(e) => setForm({ ...form, comment: e.target.value })}
                      placeholder="Роллекс Классик x2, Огненный Дракон x1..."
                      rows={3}
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  </div>
                </div>

                {modalState === "error" && (
                  <p style={{ color: "var(--primary)", fontWeight: 700, fontSize: "13px", marginTop: "12px" }}>
                    Что-то пошло не так. Попробуйте ещё раз или позвоните нам.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={modalState === "loading"}
                  className="btn-cta"
                  style={{
                    marginTop: "20px",
                    width: "100%",
                    background: "var(--primary)",
                    color: "white",
                    opacity: modalState === "loading" ? 0.6 : 1,
                  }}
                >
                  {modalState === "loading" ? "Отправляем..." : "Оформить заказ →"}
                </button>
              </form>
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
        <button className="btn-cta" onClick={openModal}>Заказать</button>
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
              <button className="btn-cta" style={{ background: "var(--primary)", color: "white" }} onClick={openModal}>
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
            <div className="sticker">
              СВЕЖАК
              <br />
              КАЖДЫЙ ДЕНЬ
            </div>
            <div className="floating-tag hidden md:block" style={{ top: "20%", left: "10%" }}>
              #РОЛЛЕКС
            </div>
            <div className="floating-tag hidden md:block" style={{ bottom: "30%", right: "20%" }}>
              ОГОНЬ 🔥
            </div>
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
            <div className="menu-card">
              <span className="menu-tag">Хит продаж</span>
              <img
                src="https://images.unsplash.com/photo-1617196034183-421b4040ed20?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Роллекс Классик"
              />
              <div className="menu-card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h3>Роллекс Классик</h3>
                  <span className="price">590 ₽</span>
                </div>
                <p style={{ fontSize: "14px", color: "rgba(245,230,192,0.65)" }}>
                  Лосось, авокадо, сливочный сыр, огурец — 8 штук. Проверенная классика, которую любят все.
                </p>
                <button className="btn-cta" style={{ marginTop: "14px", width: "100%", background: "var(--accent)", color: "#0d0d0d" }} onClick={openModal}>
                  Заказать
                </button>
              </div>
            </div>

            <div className="menu-card">
              <span className="menu-tag" style={{ background: "var(--secondary)" }}>Острое</span>
              <img
                src="https://images.unsplash.com/photo-1563612116625-3012372fccce?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Огненный дракон"
              />
              <div className="menu-card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h3>Огненный Дракон</h3>
                  <span className="price">720 ₽</span>
                </div>
                <p style={{ fontSize: "14px", color: "rgba(245,230,192,0.65)" }}>Угорь, острый соус чили, манго, кунжут. Для тех, кто любит погорячее.</p>
                <button className="btn-cta" style={{ marginTop: "14px", width: "100%", background: "var(--accent)", color: "#0d0d0d" }} onClick={openModal}>
                  Заказать
                </button>
              </div>
            </div>

            <div className="menu-card">
              <span className="menu-tag" style={{ background: "var(--accent)", color: "#0d0d0d" }}>Новинка</span>
              <img
                src="https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Ретро Маки"
              />
              <div className="menu-card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h3>Ретро Маки</h3>
                  <span className="price">480 ₽</span>
                </div>
                <p style={{ fontSize: "14px", color: "rgba(245,230,192,0.65)" }}>
                  Тунец, васаби, нори — минимализм в лучшем виде. Набор 6 штук.
                </p>
                <button className="btn-cta" style={{ marginTop: "14px", width: "100%", background: "var(--accent)", color: "#0d0d0d" }} onClick={openModal}>
                  Заказать
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="retro-vibe">
          <div>
            <h2 className="vibe-title">СВЕЖЕСТЬ — НАШ СТАНДАРТ.</h2>
            <p className="vibe-text">
              Каждый день — новая рыба. Мы работаем только с проверенными поставщиками, рис готовим по японской технологии, а соусы варим сами. Роллекс — это не просто доставка, это вкус, которому доверяют.
            </p>
            <button className="btn-cta" style={{ background: "#0d0d0d", color: "var(--accent)", borderColor: "var(--accent)" }} onClick={openModal}>
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