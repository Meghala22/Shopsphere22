import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import marketNestHero from "./assets/marketnest-hero.png";
import marketNestDashboardHero from "./assets/marketnest-dashboard-hero.png";

const API_BASE_URL = "";
const ORDER_STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];
const PAYMENT_METHODS = [
  {
    id: "CARD",
    label: "Credit or Debit Card",
    description: "Pay instantly with your card.",
  },
  {
    id: "UPI",
    label: "UPI",
    description: "Use any UPI app for a quick payment.",
  },
  {
    id: "NET_BANKING",
    label: "Net Banking",
    description: "Pay directly through your bank.",
  },
  {
    id: "COD",
    label: "Cash on Delivery",
    description: "Pay when your order arrives.",
  },
];
const emptyProductForm = {
  name: "",
  price: "",
  stock: "",
  category: "",
  imageUrl: "",
};
const emptyRegisterForm = {
  name: "",
  email: "",
  password: "",
  role: "CUSTOMER",
};
const emptyPaymentForm = {
  method: "CARD",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  upiId: "",
  bankName: "",
};
const CATEGORY_IMAGE_URLS = {
  Accessories: "https://images.pexels.com/photos/35685412/pexels-photo-35685412.jpeg?cs=srgb&dl=pexels-prolificpeople-35685412.jpg&fm=jpg",
  Beauty: "https://images.pexels.com/photos/10186830/pexels-photo-10186830.jpeg?cs=srgb&dl=pexels-72934282-10186830.jpg&fm=jpg",
  Electronics: "https://images.pexels.com/photos/16303233/pexels-photo-16303233.jpeg?cs=srgb&dl=pexels-sogi-495844134-16303233.jpg&fm=jpg",
  Fashion: "https://images.pexels.com/photos/13920535/pexels-photo-13920535.jpeg?cs=srgb&dl=pexels-joshua-roberts-212557837-13920535.jpg&fm=jpg",
  Furniture: "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?cs=srgb&dl=pexels-fotios-photos-1957477.jpg&fm=jpg",
  Home: "https://images.pexels.com/photos/4349825/pexels-photo-4349825.jpeg?cs=srgb&dl=pexels-ketut-subiyanto-4349825.jpg&fm=jpg",
  Sports: "https://images.pexels.com/photos/6193815/pexels-photo-6193815.jpeg?cs=srgb&dl=pexels-roman-odintsov-6193815.jpg&fm=jpg",
};
const PRODUCT_IMAGE_URLS = {
  "Wireless Headphones": "https://images.pexels.com/photos/16303233/pexels-photo-16303233.jpeg?cs=srgb&dl=pexels-sogi-495844134-16303233.jpg&fm=jpg",
  "Office Chair": "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?cs=srgb&dl=pexels-fotios-photos-1957477.jpg&fm=jpg",
  "Performance Hoodie": "https://images.pexels.com/photos/13920535/pexels-photo-13920535.jpeg?cs=srgb&dl=pexels-joshua-roberts-212557837-13920535.jpg&fm=jpg",
  "Smart Fitness Watch": "https://images.pexels.com/photos/3999644/pexels-photo-3999644.jpeg?cs=srgb&dl=pexels-kelly-3999644.jpg&fm=jpg",
  "Leather Work Tote": "https://images.pexels.com/photos/35685412/pexels-photo-35685412.jpeg?cs=srgb&dl=pexels-prolificpeople-35685412.jpg&fm=jpg",
  "Ceramic Desk Lamp": "https://images.pexels.com/photos/6926839/pexels-photo-6926839.jpeg?cs=srgb&dl=pexels-cottonbro-6926839.jpg&fm=jpg",
  "Running Shoes": "https://images.pexels.com/photos/17931134/pexels-photo-17931134.jpeg?cs=srgb&dl=pexels-arturoaez225-17931134.jpg&fm=jpg",
  "Coffee Maker": "https://images.pexels.com/photos/4349825/pexels-photo-4349825.jpeg?cs=srgb&dl=pexels-ketut-subiyanto-4349825.jpg&fm=jpg",
  "Hydrating Face Serum": "https://images.pexels.com/photos/10186830/pexels-photo-10186830.jpeg?cs=srgb&dl=pexels-72934282-10186830.jpg&fm=jpg",
  "Travel Backpack": "https://images.pexels.com/photos/10820375/pexels-photo-10820375.jpeg?cs=srgb&dl=pexels-madeinegypt-ca-121489142-10820375.jpg&fm=jpg",
  "Yoga Mat Pro": "https://images.pexels.com/photos/6193815/pexels-photo-6193815.jpeg?cs=srgb&dl=pexels-roman-odintsov-6193815.jpg&fm=jpg",
  "Mini Projector": "https://images.pexels.com/photos/31261076/pexels-photo-31261076.jpeg?cs=srgb&dl=pexels-nick-dimitrov-7863715-31261076.jpg&fm=jpg",
};

function getProductImage(product) {
  if (product.imageUrl?.trim()) {
    return product.imageUrl.trim();
  }

  return PRODUCT_IMAGE_URLS[product.name] || CATEGORY_IMAGE_URLS[product.category] || CATEGORY_IMAGE_URLS.Electronics;
}

function getPaymentMethodOption(methodId) {
  return PAYMENT_METHODS.find((method) => method.id === methodId) || PAYMENT_METHODS[0];
}

function App() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [session, setSession] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [credentials, setCredentials] = useState({
    email: "customer@demo.com",
    password: "customer123",
  });
  const [registerForm, setRegisterForm] = useState(emptyRegisterForm);
  const [sellerProductForm, setSellerProductForm] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
  });
  const [feedback, setFeedback] = useState({
    type: "idle",
    text: "",
  });
  const [isBusy, setIsBusy] = useState(false);
  const [customerPage, setCustomerPage] = useState("store");
  const [paymentForm, setPaymentForm] = useState(emptyPaymentForm);

  const currentUser = session?.user ?? null;
  const isAdmin = currentUser?.role === "ADMIN";
  const isSeller = currentUser?.role === "SELLER";
  const isCustomer = currentUser?.role === "CUSTOMER";
  const activeRoleLabel = currentUser ? `${currentUser.role.toLowerCase()} workspace` : "guest workspace";
  const quickCategories = categories.slice(0, 6);
  const adminUsers = users.filter((user) => user.role === "ADMIN").length;
  const sellerUsers = users.filter((user) => user.role === "SELLER").length;
  const customerUsers = users.filter((user) => user.role === "CUSTOMER").length;
  const lowStockProducts = products.filter((product) => product.stock < 5).length;
  const pendingOrders = orders.filter((order) => order.status === "PENDING").length;
  const deliveredOrders = orders.filter((order) => order.status === "DELIVERED").length;
  const categoryHighlights = categories.slice(0, 3);
  const featuredProducts = products.slice(0, 3);
  const workspaceHeadline = isAdmin
    ? "Everything is live and ready to manage."
    : isSeller
      ? "Your storefront is set up to sell."
      : "Your shopping workspace is ready to explore.";

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        !filters.category || product.category?.toLowerCase() === filters.category.toLowerCase();
      const query = filters.search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        product.name?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.sellerName?.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [filters, products]);

  const sellerProducts = useMemo(() => {
    return products.filter((product) => product.sellerId === currentUser?.id);
  }, [currentUser?.id, products]);

  const totalInventoryUnits = useMemo(() => {
    return products.reduce((sum, product) => sum + Math.max(0, Number(product.stock) || 0), 0);
  }, [products]);

  const filteredInventoryUnits = useMemo(() => {
    return filteredProducts.reduce((sum, product) => sum + Math.max(0, Number(product.stock) || 0), 0);
  }, [filteredProducts]);

  const sellerInventoryUnits = useMemo(() => {
    return sellerProducts.reduce((sum, product) => sum + Math.max(0, Number(product.stock) || 0), 0);
  }, [sellerProducts]);

  const sellerLowStockProducts = sellerProducts.filter((product) => product.stock < 5).length;

  const enrichedCart = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((entry) => entry.id === item.productId);
        if (!product) {
          return null;
        }

        return {
          ...item,
          product,
          lineTotal: item.quantity * product.price,
        };
      })
      .filter(Boolean);
  }, [cart, products]);

  const cartTotal = enrichedCart.reduce((sum, item) => sum + item.lineTotal, 0);
  const selectedPaymentMethod = getPaymentMethodOption(paymentForm.method);
  const paymentPageActive = isCustomer && customerPage === "payment";
  const paymentFormIsValid = useMemo(() => {
    switch (paymentForm.method) {
      case "CARD":
        return (
          paymentForm.cardName.trim() &&
          paymentForm.cardNumber.trim().length >= 12 &&
          paymentForm.expiry.trim() &&
          paymentForm.cvv.trim().length >= 3
        );
      case "UPI":
        return paymentForm.upiId.trim().includes("@");
      case "NET_BANKING":
        return paymentForm.bankName.trim();
      case "COD":
        return true;
      default:
        return false;
    }
  }, [paymentForm]);

  async function api(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(typeof data === "string" ? data : "Request failed.");
    }

    return data;
  }

  const loadUsers = useCallback(async () => {
    try {
      const data = await api("/users");
      setUsers(data);
    } catch (error) {
      showFeedback("error", error.message);
    }
  }, []);

  const loadProducts = useCallback(async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.search) {
        query.set("search", params.search);
      }
      if (params.category) {
        query.set("category", params.category);
      }
      if (params.sellerId) {
        query.set("sellerId", params.sellerId);
      }

      const suffix = query.toString() ? `?${query}` : "";
      const data = await api(`/products${suffix}`);
      setProducts(data);
    } catch (error) {
      showFeedback("error", error.message);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const data = await api("/products/categories");
      setCategories(data);
    } catch (error) {
      showFeedback("error", error.message);
    }
  }, []);

  const loadCart = useCallback(async (customerId) => {
    try {
      const data = await api(`/cart?customerId=${customerId}`);
      setCart(data);
    } catch (error) {
      showFeedback("error", error.message);
    }
  }, []);

  const loadOrders = useCallback(async ({ customerId, sellerId }) => {
    try {
      const query = new URLSearchParams();
      if (customerId) {
        query.set("customerId", customerId);
      }
      if (sellerId) {
        query.set("sellerId", sellerId);
      }

      const suffix = query.toString() ? `?${query}` : "";
      const data = await api(`/orders${suffix}`);
      setOrders(data);
    } catch (error) {
      showFeedback("error", error.message);
    }
  }, []);

  useEffect(() => {
    loadUsers();
    loadProducts();
    loadCategories();
  }, [loadCategories, loadProducts, loadUsers]);

  useEffect(() => {
    if (!currentUser) {
      setCart([]);
      setOrders([]);
      return;
    }

    if (isCustomer) {
      loadCart(currentUser.id);
      loadOrders({ customerId: currentUser.id });
    } else if (isSeller) {
      loadOrders({ sellerId: currentUser.id });
    } else {
      loadOrders({});
    }
  }, [currentUser, isCustomer, isSeller, loadCart, loadOrders]);

  useEffect(() => {
    if (!isCustomer) {
      setCustomerPage("store");
      setPaymentForm(emptyPaymentForm);
    }
  }, [isCustomer]);

  function showFeedback(type, text) {
    setFeedback({ type, text });
  }

  async function handleLogin(event) {
    event.preventDefault();
    setIsBusy(true);
    try {
      const data = await api("/users/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      setSession(data);
      showFeedback("success", `${data.user.name} signed in as ${data.user.role}.`);
    } catch (error) {
      showFeedback("error", error.message);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    setIsBusy(true);
    try {
      const user = await api("/users", {
        method: "POST",
        body: JSON.stringify(registerForm),
      });
      setRegisterForm(emptyRegisterForm);
      setCredentials({
        email: user.email,
        password: user.password,
      });
      setAuthMode("login");
      await loadUsers();
      showFeedback("success", "New user created. You can sign in now.");
    } catch (error) {
      showFeedback("error", error.message);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleAddToCart(product) {
    if (!currentUser) {
      showFeedback("error", "Sign in as a customer to add items to cart.");
      return;
    }

    setIsBusy(true);
    try {
      await api("/cart", {
        method: "POST",
        body: JSON.stringify({
          customerId: currentUser.id,
          productId: product.id,
          quantity: 1,
        }),
      });
      await loadCart(currentUser.id);
      await loadProducts();
      showFeedback("success", `${product.name} added to cart.`);
    } catch (error) {
      showFeedback("error", error.message);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleUpdateCart(itemId, quantity) {
    setIsBusy(true);
    try {
      await api(`/cart/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      });
      await loadCart(currentUser.id);
      showFeedback("success", "Cart updated.");
    } catch (error) {
      showFeedback("error", error.message);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleRemoveCartItem(itemId) {
    setIsBusy(true);
    try {
      await api(`/cart/${itemId}`, { method: "DELETE" });
      await loadCart(currentUser.id);
      showFeedback("success", "Item removed from cart.");
    } catch (error) {
      showFeedback("error", error.message);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleCheckout(event) {
    if (event) {
      event.preventDefault();
    }

    if (enrichedCart.length === 0) {
      showFeedback("error", "Your cart is empty.");
      return;
    }

    if (!paymentFormIsValid) {
      showFeedback("error", "Please complete the payment details before placing the order.");
      return;
    }

    setIsBusy(true);
    try {
      await api(`/orders/checkout?customerId=${currentUser.id}`, {
        method: "POST",
        body: JSON.stringify({
          customerId: currentUser.id,
          paymentMethod: paymentForm.method,
        }),
      });
      await Promise.all([loadCart(currentUser.id), loadOrders({ customerId: currentUser.id }), loadProducts()]);
      setCustomerPage("store");
      setPaymentForm(emptyPaymentForm);
      showFeedback("success", `Order placed successfully with ${selectedPaymentMethod.label}. Stock updated.`);
    } catch (error) {
      showFeedback("error", error.message);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleSaveProduct(event) {
    event.preventDefault();
    setIsBusy(true);

    const payload = {
      name: sellerProductForm.name.trim(),
      category: sellerProductForm.category.trim(),
      price: Number(sellerProductForm.price),
      stock: Number(sellerProductForm.stock),
      imageUrl: sellerProductForm.imageUrl.trim(),
      sellerId: currentUser.id,
    };

    try {
      if (editingProductId) {
        await api(`/products/${editingProductId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        showFeedback("success", "Product updated.");
      } else {
        await api("/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        showFeedback("success", "Product created.");
      }

      setSellerProductForm(emptyProductForm);
      setEditingProductId(null);
      await Promise.all([loadProducts(), loadCategories()]);
    } catch (error) {
      showFeedback("error", error.message);
    } finally {
      setIsBusy(false);
    }
  }

  function startEditingProduct(product) {
    setEditingProductId(product.id);
    setSellerProductForm({
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
      category: product.category,
      imageUrl: product.imageUrl || "",
    });
  }

  async function handleDeleteProduct(productId) {
    setIsBusy(true);
    try {
      await api(`/products/${productId}`, { method: "DELETE" });
      await Promise.all([loadProducts(), loadCategories()]);
      showFeedback("success", "Product deleted.");
    } catch (error) {
      showFeedback("error", error.message);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleUpdateOrderStatus(orderId, status) {
    setIsBusy(true);
    try {
      await api(`/orders/${orderId}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      if (isSeller) {
        await loadOrders({ sellerId: currentUser.id });
      } else if (isCustomer) {
        await loadOrders({ customerId: currentUser.id });
      } else {
        await loadOrders({});
      }

      showFeedback("success", `Order moved to ${status}.`);
    } catch (error) {
      showFeedback("error", error.message);
    } finally {
      setIsBusy(false);
    }
  }

  function handleQuickLogin(user) {
    const passwordByRole = {
      ADMIN: "admin123",
      SELLER: "seller123",
      CUSTOMER: "customer123",
    };
    setCredentials({
      email: user.email,
      password: passwordByRole[user.role] || "",
    });
    setAuthMode("login");
  }

  function signOut() {
    setSession(null);
    setAuthMode("login");
    setCart([]);
    setOrders([]);
    setEditingProductId(null);
    setSellerProductForm(emptyProductForm);
    setCustomerPage("store");
    setPaymentForm(emptyPaymentForm);
    showFeedback("success", "Signed out.");
  }

  const feedbackBanner = feedback.text ? <div className={`feedback feedback-${feedback.type}`}>{feedback.text}</div> : null;

  if (!currentUser) {
    return (
      <div className="app-shell auth-shell">
        <div className="promo-bar">
          <span>New season drop</span>
          <span>Multi-vendor fashion marketplace demo</span>
          <span>Orders, sellers, and carts in one flow</span>
        </div>

        <header className="topbar auth-topbar">
          <div className="brand-block">
            <div className="brand-mark">M</div>
            <div>
              <p className="eyebrow">Style Marketplace</p>
              <h1 className="brand-title">ShopSphere</h1>
            </div>
          </div>
          <div className="topbar-status">
            <div className="session-pill">
              <span className="session-dot" />
              {activeRoleLabel}
            </div>
          </div>
        </header>

        {feedbackBanner}

        <main className="auth-page">
          <section className="auth-stage">
            <section className="panel auth-hero">
              <div className="auth-hero-media">
                <img className="auth-hero-image" src={marketNestHero} alt="ShopSphere fashion, home, beauty, and electronics showcase" />
              </div>
            </section>

            <section className="panel auth-page-panel">
              <div className="panel-heading auth-page-heading">
                <div>
                  <p className="section-tag">Account</p>
                  <h2>{authMode === "login" ? "Welcome back" : "Create your account"}</h2>
                </div>
              </div>

              <div className="auth-switcher">
                <button
                  type="button"
                  className={authMode === "login" ? "auth-toggle auth-toggle-active" : "auth-toggle"}
                  onClick={() => setAuthMode("login")}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  className={authMode === "register" ? "auth-toggle auth-toggle-active" : "auth-toggle"}
                  onClick={() => setAuthMode("register")}
                >
                  Create account
                </button>
              </div>

              {authMode === "login" ? (
                <form className="form-card auth-form-card" onSubmit={handleLogin}>
                  <h3>Sign in</h3>
                  <p className="auth-copy">Access your shopper, seller, or admin workspace from one place.</p>
                  <label>
                    Email
                    <input
                      value={credentials.email}
                      onChange={(event) =>
                        setCredentials((current) => ({ ...current, email: event.target.value }))
                      }
                      placeholder="customer@demo.com"
                    />
                  </label>
                  <label>
                    Password
                    <input
                      type="password"
                      value={credentials.password}
                      onChange={(event) =>
                        setCredentials((current) => ({ ...current, password: event.target.value }))
                      }
                      placeholder="Enter password"
                    />
                  </label>
                  <button type="submit" disabled={isBusy}>
                    {isBusy ? "Working..." : "Login"}
                  </button>
                </form>
              ) : (
                <form className="form-card auth-form-card" onSubmit={handleRegister}>
                  <h3>Create user</h3>
                  <p className="auth-copy">Set up a new account and jump back to sign in when you are ready.</p>
                  <label>
                    Name
                    <input
                      value={registerForm.name}
                      onChange={(event) =>
                        setRegisterForm((current) => ({ ...current, name: event.target.value }))
                      }
                      placeholder="New user"
                    />
                  </label>
                  <label>
                    Email
                    <input
                      value={registerForm.email}
                      onChange={(event) =>
                        setRegisterForm((current) => ({ ...current, email: event.target.value }))
                      }
                      placeholder="new@demo.com"
                    />
                  </label>
                  <label>
                    Password
                    <input
                      type="password"
                      value={registerForm.password}
                      onChange={(event) =>
                        setRegisterForm((current) => ({ ...current, password: event.target.value }))
                      }
                      placeholder="Create password"
                    />
                  </label>
                  <label>
                    Role
                    <select
                      value={registerForm.role}
                      onChange={(event) =>
                        setRegisterForm((current) => ({ ...current, role: event.target.value }))
                      }
                    >
                      <option value="CUSTOMER">Customer</option>
                      <option value="SELLER">Seller</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </label>
                  <button type="submit" disabled={isBusy}>
                    Register
                  </button>
                </form>
              )}

              <div className="demo-login-strip demo-login-strip-wide">
                <p>Quick demo access</p>
                <div className="chip-row">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      className="chip"
                      onClick={() => handleQuickLogin(user)}
                      type="button"
                    >
                      {user.role}: {user.name}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="page-glow page-glow-left" />
      <div className="page-glow page-glow-right" />

      <div className="promo-bar">
        <span>New season drop</span>
        <span>Multi-vendor fashion marketplace demo</span>
        <span>Orders, sellers, and carts in one flow</span>
      </div>

      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">M</div>
          <div>
            <p className="eyebrow">Style Marketplace</p>
            <h1 className="brand-title">ShopSphere</h1>
          </div>
        </div>
        <div className="topbar-status">
          <div className="session-pill">
            <span className="session-dot" />
            {activeRoleLabel}
          </div>
          {currentUser ? <div className="session-user">{currentUser.name}</div> : null}
          <button className="ghost-button" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      <section className={isAdmin || isSeller ? "overview-strip" : "overview-strip overview-strip-single"}>
        <div className={isCustomer ? "overview-copy overview-copy-banner" : "overview-copy"}>
          <div className="overview-media-fallback">
            <img className="overview-media-fallback-image" src={marketNestDashboardHero} alt="ShopSphere lifestyle dashboard hero" />
            {isCustomer ? (
              <div className="overview-banner-content">
                <span className="overview-banner-tag">Fresh Picks</span>
                <h2 className="overview-banner-title">Colorful finds, quick checkout, and one smooth shopping flow.</h2>
                <p className="overview-banner-text">
                  Browse trending styles, add your favorites, then head to the new payment page when you are ready.
                </p>
              </div>
            ) : null}
          </div>
          <h2 className="overview-title" style={{ display: "none" }}>Step into the spotlight with standout styles, big energy, and a marketplace built to move fast.</h2>
          <p className="overview-text" style={{ display: "none" }}>
            Inspired by SHEIN’s retail-first browsing pattern, this version pushes product discovery to the
            find. From first click to final checkout, the experience is designed to feel fast, vibrant, and impossible
          </p>
          <p className="overview-text" style={{ display: "none" }}>
            Explore bold new arrivals, everyday essentials, and seller collections that make every scroll feel like a
            find. From first click to final checkout, the experience is designed to feel fast, vibrant, and impossible
            to ignore.
          </p>
        </div>
        {isAdmin || isSeller ? (
          <div className="stat-row">
            <StatCard
              label="Inventory"
              value={isSeller ? sellerInventoryUnits : totalInventoryUnits}
              note={isSeller ? "Units available in your catalog" : "Units available across the marketplace"}
              metaItems={[
                { label: "Listings", value: isSeller ? sellerProducts.length : products.length },
                { label: "Low stock", value: isSeller ? sellerLowStockProducts : lowStockProducts },
              ]}
            />
            <StatCard
              label="Users"
              value={users.length}
              note="Active marketplace accounts"
              metaItems={[
                { label: "Admins", value: adminUsers },
                { label: "Sellers", value: sellerUsers },
                { label: "Customers", value: customerUsers },
              ]}
            />
            <StatCard
              label="Orders"
              value={orders.length}
              note="Customer orders in the system"
              metaItems={[
                { label: "Pending", value: pendingOrders },
                { label: "Delivered", value: deliveredOrders },
              ]}
            />
            <StatCard
              label="Categories"
              value={categories.length}
              note="Shop departments available"
              chips={categoryHighlights}
            />
            <section className="stat-feature-card">
              <p className="section-tag">Marketplace Pulse</p>
              <h3>{workspaceHeadline}</h3>
              <div className="stat-feature-meta">
                <div className="stat-feature-meta-item">
                  <span>Workspace</span>
                  <strong>{activeRoleLabel}</strong>
                </div>
                <div className="stat-feature-meta-item">
                  <span>Low stock</span>
                  <strong>{lowStockProducts} items</strong>
                </div>
                <div className="stat-feature-meta-item">
                  <span>Pending</span>
                  <strong>{pendingOrders} orders</strong>
                </div>
              </div>
              <div className="stat-feature-chips">
                {featuredProducts.map((product) => (
                  <span key={product.id} className="stat-feature-chip">
                    {product.name}
                  </span>
                ))}
              </div>
            </section>
          </div>
        ) : null}
      </section>

      {feedbackBanner}

      <main className="workspace-grid">
        <aside className="sidebar-column">
          {isAdmin ? (
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <p className="section-tag">Admin</p>
                  <h2>Platform snapshot</h2>
                </div>
              </div>

              <div className="admin-summary-grid">
                <SummaryCard title="Admins" value={users.filter((user) => user.role === "ADMIN").length} />
                <SummaryCard title="Sellers" value={users.filter((user) => user.role === "SELLER").length} />
                <SummaryCard title="Customers" value={users.filter((user) => user.role === "CUSTOMER").length} />
                <SummaryCard title="Low stock items" value={products.filter((product) => product.stock < 5).length} />
              </div>
            </section>
          ) : null}
        </aside>

        <div className="main-column">
          {paymentPageActive ? (
            <PaymentPage
              cartItems={enrichedCart}
              cartTotal={cartTotal}
              paymentForm={paymentForm}
              setPaymentForm={setPaymentForm}
              onBack={() => setCustomerPage("store")}
              onSubmit={handleCheckout}
              isBusy={isBusy}
              paymentFormIsValid={paymentFormIsValid}
            />
          ) : (
            <>
          <section className="category-strip">
            <button
              type="button"
              className={`category-pill ${filters.category === "" ? "category-pill-active" : ""}`}
              onClick={() => setFilters((current) => ({ ...current, category: "" }))}
            >
              All
            </button>
            {quickCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={`category-pill ${filters.category === category ? "category-pill-active" : ""}`}
                onClick={() => setFilters((current) => ({ ...current, category }))}
              >
                {category}
              </button>
            ))}
          </section>

          <section className="panel browse-panel">
              <div className="panel-heading">
                <div>
                  <p className="section-tag">For You</p>
                  <h2>Browse products</h2>
                </div>
                <div className="panel-kicker">{`${filteredInventoryUnits} units across ${filteredProducts.length} listings`}</div>
              </div>

            <div className="toolbar">
              <input
                value={filters.search}
                onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                placeholder="Search product, seller, or category"
              />
              <select
                value={filters.category}
                onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button type="button" className="ghost-button" onClick={() => setFilters({ search: "", category: "" })}>
                Reset
              </button>
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article key={product.id} className="product-card">
                  <div className="product-image-wrap">
                    <img className="product-image" src={getProductImage(product)} alt={product.name} loading="lazy" />
                  </div>
                  <div className="product-topline">
                    <span>{product.category}</span>
                    <strong>{product.stock} in stock</strong>
                  </div>
                  <h3>{product.name}</h3>
                  <p className="seller-line">Sold by {product.sellerName}</p>
                  <div className="product-footer">
                    <span className="price">${Number(product.price).toFixed(2)}</span>
                    {isCustomer ? (
                      <button type="button" onClick={() => handleAddToCart(product)} disabled={product.stock === 0 || isBusy}>
                        Add to cart
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {isSeller ? (
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <p className="section-tag">Seller</p>
                  <h2>Manage products</h2>
                </div>
                <div className="panel-kicker">{`${sellerInventoryUnits} units across ${sellerProducts.length} listings`}</div>
              </div>

              <form className="form-grid" onSubmit={handleSaveProduct}>
                <label>
                  Product name
                  <input
                    value={sellerProductForm.name}
                    onChange={(event) =>
                      setSellerProductForm((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder="Product name"
                  />
                </label>
                <label>
                  Category
                  <input
                    value={sellerProductForm.category}
                    onChange={(event) =>
                      setSellerProductForm((current) => ({ ...current, category: event.target.value }))
                    }
                    placeholder="Category"
                  />
                </label>
                <label>
                  Price
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={sellerProductForm.price}
                    onChange={(event) =>
                      setSellerProductForm((current) => ({ ...current, price: event.target.value }))
                    }
                    placeholder="0.00"
                  />
                </label>
                <label>
                  Stock
                  <input
                    type="number"
                    min="0"
                    value={sellerProductForm.stock}
                    onChange={(event) =>
                      setSellerProductForm((current) => ({ ...current, stock: event.target.value }))
                    }
                    placeholder="0"
                  />
                </label>
                <label>
                  Image URL
                  <input
                    value={sellerProductForm.imageUrl}
                    onChange={(event) =>
                      setSellerProductForm((current) => ({ ...current, imageUrl: event.target.value }))
                    }
                    placeholder="https://example.com/product-image.jpg"
                  />
                </label>
                <div className="form-actions">
                  <button type="submit" disabled={isBusy}>
                    {editingProductId ? "Update product" : "Add product"}
                  </button>
                  {editingProductId ? (
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => {
                        setEditingProductId(null);
                        setSellerProductForm(emptyProductForm);
                      }}
                    >
                      Cancel edit
                    </button>
                  ) : null}
                </div>
              </form>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellerProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>${Number(product.price).toFixed(2)}</td>
                        <td>{product.stock}</td>
                        <td className="action-cell">
                          <button type="button" className="ghost-button" onClick={() => startEditingProduct(product)}>
                            Edit
                          </button>
                          <button type="button" className="danger-button" onClick={() => handleDeleteProduct(product.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {isCustomer ? (
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <p className="section-tag">Customer</p>
                  <h2>Cart and checkout</h2>
                </div>
                <div className="cart-total">
                  <span>Total</span>
                  <strong>${cartTotal.toFixed(2)}</strong>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Line total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrichedCart.length === 0 ? (
                      <tr>
                        <td colSpan="4">Cart is empty.</td>
                      </tr>
                    ) : (
                      enrichedCart.map((item) => (
                        <tr key={item.id}>
                          <td>{item.product.name}</td>
                          <td>
                            <input
                              className="quantity-input"
                              type="number"
                              min="1"
                              max={item.product.stock}
                              value={item.quantity}
                              onChange={(event) => handleUpdateCart(item.id, Number(event.target.value))}
                            />
                          </td>
                          <td>${item.lineTotal.toFixed(2)}</td>
                          <td className="action-cell">
                            <button type="button" className="danger-button" onClick={() => handleRemoveCartItem(item.id)}>
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="checkout-actions">
                <div className="checkout-note">
                  <span className="section-tag">Next Step</span>
                  <p>Select a payment method on the payment page before placing the order.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCustomerPage("payment")}
                  disabled={enrichedCart.length === 0 || isBusy}
                >
                  Continue to payment
                </button>
              </div>
            </section>
          ) : null}

            </>
          )}

          {!paymentPageActive && (isAdmin || isSeller || isCustomer) ? (
            <section className="panel order-panel">
              <div className="panel-heading">
                <div>
                  <p className="section-tag">Orders</p>
                  <h2>
                    {isAdmin
                      ? "Platform order overview"
                      : isSeller
                        ? "Orders for your products"
                        : "Your order history"}
                  </h2>
                </div>
                <div className="panel-kicker">{orders.length} records</div>
              </div>

              <div className="order-stack">
                {orders.length === 0 ? (
                  <div className="empty-state">No orders yet.</div>
                ) : (
                  orders.map((order) => (
                    <div className="order-card" key={order.id}>
                      <div>
                        <p className="order-title">{order.productName}</p>
                        <p className="order-meta">
                          Customer: {order.customerName} | Seller: {order.sellerName}
                        </p>
                        <p className="order-meta">
                          Qty {order.quantity} | Total ${Number(order.totalPrice).toFixed(2)}
                        </p>
                        <p className="order-meta">Payment: {order.paymentMethod || "Not captured"}</p>
                      </div>

                      <div className="order-actions">
                        <span className={`status-pill status-${order.status?.toLowerCase()}`}>{order.status}</span>
                        {(isSeller || isAdmin) ? (
                          <select
                            value={order.status}
                            onChange={(event) => handleUpdateOrderStatus(order.id, event.target.value)}
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        ) : null}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}

function PaymentPage({
  cartItems,
  cartTotal,
  paymentForm,
  setPaymentForm,
  onBack,
  onSubmit,
  isBusy,
  paymentFormIsValid,
}) {
  const selectedPaymentMethod = getPaymentMethodOption(paymentForm.method);

  return (
    <>
      <section className="panel payment-page">
        <div className="panel-heading">
          <div>
            <p className="section-tag">Payment</p>
            <h2>Choose how you want to pay</h2>
          </div>
          <button type="button" className="ghost-button" onClick={onBack}>
            Back to cart
          </button>
        </div>

        <div className="payment-layout">
          <div className="payment-method-grid">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                type="button"
                className={`payment-method-card ${paymentForm.method === method.id ? "payment-method-card-active" : ""}`}
                onClick={() => setPaymentForm((current) => ({ ...current, method: method.id }))}
              >
                <strong>{method.label}</strong>
                <span>{method.description}</span>
              </button>
            ))}
          </div>

          <form className="payment-form" onSubmit={onSubmit}>
            <div className="payment-form-header">
              <div>
                <p className="section-tag">Selected</p>
                <h3>{selectedPaymentMethod.label}</h3>
              </div>
              <div className="panel-kicker">Total ${cartTotal.toFixed(2)}</div>
            </div>

            {paymentForm.method === "CARD" ? (
              <div className="payment-field-grid">
                <label>
                  Cardholder name
                  <input
                    value={paymentForm.cardName}
                    onChange={(event) =>
                      setPaymentForm((current) => ({ ...current, cardName: event.target.value }))
                    }
                    placeholder="Name on card"
                  />
                </label>
                <label>
                  Card number
                  <input
                    value={paymentForm.cardNumber}
                    onChange={(event) =>
                      setPaymentForm((current) => ({
                        ...current,
                        cardNumber: event.target.value.replace(/[^\d\s]/g, "").slice(0, 19),
                      }))
                    }
                    placeholder="1234 5678 9012 3456"
                  />
                </label>
                <label>
                  Expiry
                  <input
                    value={paymentForm.expiry}
                    onChange={(event) =>
                      setPaymentForm((current) => ({ ...current, expiry: event.target.value.slice(0, 5) }))
                    }
                    placeholder="MM/YY"
                  />
                </label>
                <label>
                  CVV
                  <input
                    value={paymentForm.cvv}
                    onChange={(event) =>
                      setPaymentForm((current) => ({
                        ...current,
                        cvv: event.target.value.replace(/\D/g, "").slice(0, 4),
                      }))
                    }
                    placeholder="123"
                  />
                </label>
              </div>
            ) : null}

            {paymentForm.method === "UPI" ? (
              <div className="payment-field-grid payment-field-grid-single">
                <label>
                  UPI ID
                  <input
                    value={paymentForm.upiId}
                    onChange={(event) =>
                      setPaymentForm((current) => ({ ...current, upiId: event.target.value }))
                    }
                    placeholder="name@bank"
                  />
                </label>
              </div>
            ) : null}

            {paymentForm.method === "NET_BANKING" ? (
              <div className="payment-field-grid payment-field-grid-single">
                <label>
                  Bank name
                  <input
                    value={paymentForm.bankName}
                    onChange={(event) =>
                      setPaymentForm((current) => ({ ...current, bankName: event.target.value }))
                    }
                    placeholder="Choose your bank"
                  />
                </label>
              </div>
            ) : null}

            {paymentForm.method === "COD" ? (
              <div className="payment-info-card">
                <p>Your order will be placed now and payment will be collected when it is delivered.</p>
              </div>
            ) : null}

            <div className="payment-actions">
              <button type="button" className="ghost-button" onClick={onBack}>
                Continue shopping
              </button>
              <button type="submit" disabled={cartItems.length === 0 || isBusy || !paymentFormIsValid}>
                {isBusy ? "Processing..." : "Pay and place order"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="panel payment-summary-panel">
        <div className="panel-heading">
          <div>
            <p className="section-tag">Review</p>
            <h2>Order summary</h2>
          </div>
          <div className="panel-kicker">{cartItems.length} items</div>
        </div>

        <div className="payment-summary-list">
          {cartItems.map((item) => (
            <div key={item.id} className="payment-summary-item">
              <div>
                <strong>{item.product.name}</strong>
                <p className="order-meta">Qty {item.quantity}</p>
              </div>
              <span>${item.lineTotal.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="payment-total-card">
          <span>Selected method</span>
          <strong>{selectedPaymentMethod.label}</strong>
          <span>Order total</span>
          <b>${cartTotal.toFixed(2)}</b>
        </div>
      </section>
    </>
  );
}

function StatCard({ label, value, note, metaItems = [], chips = [] }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {note ? <small className="stat-card-note">{note}</small> : null}
      {metaItems.length > 0 ? (
        <div className="stat-card-meta">
          {metaItems.map((item) => (
            <div key={item.label} className="stat-card-meta-item">
              <small>{item.label}</small>
              <b>{item.value}</b>
            </div>
          ))}
        </div>
      ) : null}
      {chips.length > 0 ? (
        <div className="stat-card-chips">
          {chips.map((chip) => (
            <span key={chip} className="stat-card-chip">
              {chip}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="summary-card">
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default App;
