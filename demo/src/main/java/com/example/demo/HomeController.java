package com.example.demo;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {

    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String home() {
        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Demo Backend</title>
                    <style>
                        :root {
                            color-scheme: light;
                            --bg: #f4f7fb;
                            --panel: #ffffff;
                            --text: #14213d;
                            --muted: #5c677d;
                            --accent: #0f766e;
                            --accent-soft: #ccfbf1;
                            --border: #d9e2ec;
                        }
                        * { box-sizing: border-box; }
                        body {
                            margin: 0;
                            min-height: 100vh;
                            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                            background: linear-gradient(180deg, #eef6ff 0%, var(--bg) 100%);
                            color: var(--text);
                        }
                        main {
                            max-width: 760px;
                            margin: 0 auto;
                            padding: 48px 20px;
                        }
                        .card {
                            background: var(--panel);
                            border: 1px solid var(--border);
                            border-radius: 20px;
                            padding: 32px;
                            box-shadow: 0 24px 70px rgba(20, 33, 61, 0.08);
                        }
                        .eyebrow {
                            display: inline-block;
                            margin-bottom: 16px;
                            padding: 6px 12px;
                            border-radius: 999px;
                            background: var(--accent-soft);
                            color: var(--accent);
                            font-size: 0.85rem;
                            font-weight: 700;
                            letter-spacing: 0.04em;
                            text-transform: uppercase;
                        }
                        h1 {
                            margin: 0 0 12px;
                            font-size: clamp(2rem, 5vw, 3rem);
                            line-height: 1.1;
                        }
                        p {
                            margin: 0 0 18px;
                            color: var(--muted);
                            font-size: 1rem;
                            line-height: 1.6;
                        }
                        .actions {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 12px;
                            margin: 28px 0 32px;
                        }
                        a.button {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            padding: 12px 18px;
                            border-radius: 12px;
                            text-decoration: none;
                            font-weight: 600;
                        }
                        .button-primary {
                            background: var(--accent);
                            color: #ffffff;
                            box-shadow: 0 10px 24px rgba(15, 118, 110, 0.2);
                        }
                        .button-secondary {
                            border: 1px solid var(--border);
                            color: var(--text);
                            background: #ffffff;
                        }
                        .endpoints {
                            display: grid;
                            gap: 12px;
                        }
                        .endpoint {
                            padding: 16px 18px;
                            border: 1px solid var(--border);
                            border-radius: 14px;
                            background: #fbfdff;
                        }
                        .endpoint strong {
                            display: block;
                            margin-bottom: 6px;
                            font-size: 0.98rem;
                        }
                        .endpoint code {
                            font-family: Consolas, "Courier New", monospace;
                            font-size: 0.95rem;
                            color: var(--accent);
                        }
                        @media (max-width: 640px) {
                            .card { padding: 24px; }
                        }
                    </style>
                </head>
                <body>
                <main>
                    <section class="card">
                        <span class="eyebrow">Backend Online</span>
                        <h1>Spring Boot API is running on port 8081.</h1>
                        <p>This backend powers the ecommerce demo and serves product, cart, order, and user endpoints for the React frontend.</p>
                        <div class="actions">
                            <a class="button button-primary" href="http://localhost:3001">Open Frontend</a>
                            <a class="button button-secondary" href="/products">View Products API</a>
                        </div>
                        <div class="endpoints">
                            <div class="endpoint">
                                <strong>Products</strong>
                                <code>GET /products</code>
                            </div>
                            <div class="endpoint">
                                <strong>Categories</strong>
                                <code>GET /products/categories</code>
                            </div>
                            <div class="endpoint">
                                <strong>Orders</strong>
                                <code>GET /orders</code>
                            </div>
                            <div class="endpoint">
                                <strong>Users</strong>
                                <code>GET /users</code>
                            </div>
                            <div class="endpoint">
                                <strong>Cart</strong>
                                <code>GET /cart?userId=&lt;id&gt;</code>
                            </div>
                        </div>
                    </section>
                </main>
                </body>
                </html>
                """;
    }
}
