
## 📁 Project Structure

```
kawaii-react/
├── index.html
├── vite.config.js
├── package.json
├── .env                          ← your secrets go here
└── src/
    ├── main.jsx                  ← entry point
    ├── App.jsx                   ← root component
    ├── index.css                 ← global design system
    ├── data/
    │   └── products.js           ← product data (swap with API later)
    ├── context/
    │   ├── CartContext.jsx       ← global cart state
    │   └── ToastContext.jsx      ← notification system
    └── components/
        ├── Navbar.jsx / .module.css
        ├── Hero.jsx / .module.css
        ├── ProductCard.jsx / .module.css
        ├── ProductsSection.jsx / .module.css
        ├── CartSidebar.jsx / .module.css
        ├── AuthModal.jsx / .module.css
        ├── BrandsSection.jsx / .module.css
        ├── Newsletter.jsx / .module.css
        ├── Footer.jsx / .module.css
        └── Cursor.jsx

backend/
├── server.js
├── .env
├── config/
│   └── db.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── checkout.js
│   └── newsletter.js
├── controllers/
│   ├── authController.js
│   └── checkoutController.js
└── middleware/
    └── auth.js
