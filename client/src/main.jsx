import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// ======================================================
// GOOGLE OAUTH
// ======================================================

import { GoogleOAuthProvider } from "@react-oauth/google";

// ======================================================
// APP
// ======================================================

import App from "./App";

// ======================================================
// CONTEXT PROVIDERS
// ======================================================

import { AuthProvider } from "./context/AuthContext";
import { FilterProvider } from "./context/FilterContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";

// ======================================================
// GLOBAL CSS
// ======================================================

import "./index.css";

// ======================================================
// GOOGLE CLIENT ID
// ======================================================
//
// Vite .env se Client ID read hoga.
//
// client/.env:
//
// VITE_GOOGLE_CLIENT_ID=your_google_client_id
//
// ======================================================

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID;

// ======================================================
// DEBUG
// ======================================================

console.log(
  "Google Client ID Available:",
  Boolean(GOOGLE_CLIENT_ID)
);

// ======================================================
// ROOT
// ======================================================

const root =
  ReactDOM.createRoot(
    document.getElementById("root")
  );

// ======================================================
// APPLICATION
// ======================================================

root.render(
  <React.StrictMode>
    <BrowserRouter>

      {/* ==================================================
          GOOGLE OAUTH PROVIDER
      ================================================== */}

      <GoogleOAuthProvider
        clientId={
          GOOGLE_CLIENT_ID
        }
      >

        {/* ==================================================
            AUTH
        ================================================== */}

        <AuthProvider>

          {/* ==================================================
              FILTER
          ================================================== */}

          <FilterProvider>

            {/* ==================================================
                WISHLIST
            ================================================== */}

            <WishlistProvider>

              {/* ==================================================
                  CART
              ================================================== */}

              <CartProvider>

                {/* ==================================================
                    APP
                ================================================== */}

                <App />

              </CartProvider>

            </WishlistProvider>

          </FilterProvider>

        </AuthProvider>

      </GoogleOAuthProvider>

    </BrowserRouter>
  </React.StrictMode>
);