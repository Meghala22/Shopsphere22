package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    private static final String ADMIN_EMAIL = "admin@demo.com";
    private static final String SELLER_ONE_EMAIL = "seller1@demo.com";
    private static final String SELLER_TWO_EMAIL = "seller2@demo.com";
    private static final String CUSTOMER_EMAIL = "customer@demo.com";

    @Bean
    CommandLineRunner seedData(UserRepository userRepository, ProductRepository productRepository) {
        return args -> {
            createUserIfMissing(userRepository, "Admin User", ADMIN_EMAIL, "admin123", "ADMIN");
            User sellerOne = createUserIfMissing(userRepository, "Urban Seller", SELLER_ONE_EMAIL, "seller123", "SELLER");
            User sellerTwo = createUserIfMissing(userRepository, "Northwind Seller", SELLER_TWO_EMAIL, "seller123", "SELLER");
            createUserIfMissing(userRepository, "Customer User", CUSTOMER_EMAIL, "customer123", "CUSTOMER");

            createProductIfMissing(productRepository, "Wireless Headphones", 149.99, 18, "Electronics",
                    sellerOne.getId(), sellerOne.getName(),
                    "https://images.pexels.com/photos/16303233/pexels-photo-16303233.jpeg?cs=srgb&dl=pexels-sogi-495844134-16303233.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Office Chair", 229.50, 10, "Furniture",
                    sellerOne.getId(), sellerOne.getName(),
                    "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?cs=srgb&dl=pexels-fotios-photos-1957477.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Performance Hoodie", 72.00, 30, "Fashion",
                    sellerOne.getId(), sellerOne.getName(),
                    "https://images.pexels.com/photos/13920535/pexels-photo-13920535.jpeg?cs=srgb&dl=pexels-joshua-roberts-212557837-13920535.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Smart Fitness Watch", 199.00, 14, "Electronics",
                    sellerOne.getId(), sellerOne.getName(),
                    "https://images.pexels.com/photos/3999644/pexels-photo-3999644.jpeg?cs=srgb&dl=pexels-kelly-3999644.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Leather Work Tote", 128.75, 9, "Accessories",
                    sellerOne.getId(), sellerOne.getName(),
                    "https://images.pexels.com/photos/35685412/pexels-photo-35685412.jpeg?cs=srgb&dl=pexels-prolificpeople-35685412.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Ceramic Desk Lamp", 54.50, 16, "Home",
                    sellerOne.getId(), sellerOne.getName(),
                    "https://images.pexels.com/photos/6926839/pexels-photo-6926839.jpeg?cs=srgb&dl=pexels-cottonbro-6926839.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Minimalist Wall Clock", 39.99, 18, "Home",
                    sellerOne.getId(), sellerOne.getName(),
                    "https://images.pexels.com/photos/3935327/pexels-photo-3935327.jpeg?cs=srgb&dl=pexels-pixabay-3935327.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Laptop Stand", 48.50, 21, "Electronics",
                    sellerOne.getId(), sellerOne.getName(),
                    "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?cs=srgb&dl=pexels-pixabay-205421.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Classic Denim Jacket", 94.00, 13, "Fashion",
                    sellerOne.getId(), sellerOne.getName(),
                    "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?cs=srgb&dl=pexels-lum3n-44775-1124465.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Noise Cancelling Earbuds", 129.00, 17, "Electronics",
                    sellerOne.getId(), sellerOne.getName(),
                    "https://images.pexels.com/photos/21424620/pexels-photo-21424620.jpeg?cs=srgb&dl=pexels-rohit-sharma-1230131-21424620.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Velvet Accent Chair", 189.00, 8, "Furniture",
                    sellerOne.getId(), sellerOne.getName(),
                    "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?cs=srgb&dl=pexels-max-vakhtbovycn-1866149.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Marble Side Table", 79.99, 14, "Furniture",
                    sellerOne.getId(), sellerOne.getName(),
                    "https://images.pexels.com/photos/6207812/pexels-photo-6207812.jpeg?cs=srgb&dl=pexels-max-vakhtbovycn-6207812.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Oversized Sunglasses", 34.50, 25, "Accessories",
                    sellerOne.getId(), sellerOne.getName(),
                    "https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?cs=srgb&dl=pexels-pixabay-46710.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Silk Scarf", 28.99, 19, "Accessories",
                    sellerOne.getId(), sellerOne.getName(),
                    "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?cs=srgb&dl=pexels-daria-shevtsova-709767-934070.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Portable Speaker", 59.00, 23, "Electronics",
                    sellerOne.getId(), sellerOne.getName(),
                    "https://images.pexels.com/photos/63703/pexels-photo-63703.jpeg?cs=srgb&dl=pexels-pixabay-63703.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Smart Table Lamp", 42.25, 18, "Home",
                    sellerOne.getId(), sellerOne.getName(),
                    "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?cs=srgb&dl=pexels-veeterzy-1112598.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Tailored Blazer", 118.00, 11, "Fashion",
                    sellerOne.getId(), sellerOne.getName(),
                    "https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?cs=srgb&dl=pexels-godisable-jacob-226636-769733.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Wireless Keyboard", 69.99, 16, "Electronics",
                    sellerOne.getId(), sellerOne.getName(),
                    "https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?cs=srgb&dl=pexels-pixabay-1772123.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Canvas Wall Art", 52.00, 12, "Home",
                    sellerOne.getId(), sellerOne.getName(),
                    "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?cs=srgb&dl=pexels-designecologist-1571460.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Leather Sneakers", 96.75, 20, "Fashion",
                    sellerOne.getId(), sellerOne.getName(),
                    "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?cs=srgb&dl=pexels-mnzoutfits-2529148.jpg&fm=jpg");

            createProductIfMissing(productRepository, "Running Shoes", 89.00, 24, "Fashion",
                    sellerTwo.getId(), sellerTwo.getName(),
                    "https://images.pexels.com/photos/17931134/pexels-photo-17931134.jpeg?cs=srgb&dl=pexels-arturoaez225-17931134.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Coffee Maker", 64.25, 12, "Home",
                    sellerTwo.getId(), sellerTwo.getName(),
                    "https://images.pexels.com/photos/4349825/pexels-photo-4349825.jpeg?cs=srgb&dl=pexels-ketut-subiyanto-4349825.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Hydrating Face Serum", 38.40, 28, "Beauty",
                    sellerTwo.getId(), sellerTwo.getName(),
                    "https://images.pexels.com/photos/10186830/pexels-photo-10186830.jpeg?cs=srgb&dl=pexels-72934282-10186830.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Travel Backpack", 84.99, 20, "Accessories",
                    sellerTwo.getId(), sellerTwo.getName(),
                    "https://images.pexels.com/photos/10820375/pexels-photo-10820375.jpeg?cs=srgb&dl=pexels-madeinegypt-ca-121489142-10820375.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Yoga Mat Pro", 46.00, 22, "Sports",
                    sellerTwo.getId(), sellerTwo.getName(),
                    "https://images.pexels.com/photos/6193815/pexels-photo-6193815.jpeg?cs=srgb&dl=pexels-roman-odintsov-6193815.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Mini Projector", 219.00, 7, "Electronics",
                    sellerTwo.getId(), sellerTwo.getName(),
                    "https://images.pexels.com/photos/31261076/pexels-photo-31261076.jpeg?cs=srgb&dl=pexels-nick-dimitrov-7863715-31261076.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Stainless Water Bottle", 24.99, 26, "Sports",
                    sellerTwo.getId(), sellerTwo.getName(),
                    "https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?cs=srgb&dl=pexels-julia-volk-5273054-1000084.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Portable Blender", 58.00, 11, "Home",
                    sellerTwo.getId(), sellerTwo.getName(),
                    "https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg?cs=srgb&dl=pexels-anna-shvets-4021779.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Weekend Duffle Bag", 74.99, 15, "Accessories",
                    sellerTwo.getId(), sellerTwo.getName(),
                    "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?cs=srgb&dl=pexels-pixabay-1152077.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Aloe Night Cream", 32.50, 19, "Beauty",
                    sellerTwo.getId(), sellerTwo.getName(),
                    "https://images.pexels.com/photos/6621467/pexels-photo-6621467.jpeg?cs=srgb&dl=pexels-anna-nekrashevich-6621467.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Pilates Ring", 21.00, 18, "Sports",
                    sellerTwo.getId(), sellerTwo.getName(),
                    "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?cs=srgb&dl=pexels-anush-gorak-1229356-4498606.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Resistance Band Set", 27.99, 24, "Sports",
                    sellerTwo.getId(), sellerTwo.getName(),
                    "https://images.pexels.com/photos/6551130/pexels-photo-6551130.jpeg?cs=srgb&dl=pexels-karolina-grabowska-6551130.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Vitamin C Cleanser", 26.40, 22, "Beauty",
                    sellerTwo.getId(), sellerTwo.getName(),
                    "https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg?cs=srgb&dl=pexels-shiny-diamond-3762879-3735657.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Rose Clay Mask", 29.95, 17, "Beauty",
                    sellerTwo.getId(), sellerTwo.getName(),
                    "https://images.pexels.com/photos/7262887/pexels-photo-7262887.jpeg?cs=srgb&dl=pexels-anna-nekrashevich-7262887.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Hiking Daypack", 69.50, 18, "Accessories",
                    sellerTwo.getId(), sellerTwo.getName(),
                    "https://images.pexels.com/photos/691668/pexels-photo-691668.jpeg?cs=srgb&dl=pexels-ms-garcia-831416-691668.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Insulated Lunch Tote", 31.99, 21, "Accessories",
                    sellerTwo.getId(), sellerTwo.getName(),
                    "https://images.pexels.com/photos/5710174/pexels-photo-5710174.jpeg?cs=srgb&dl=pexels-cottonbro-5710174.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Air Fryer", 98.00, 9, "Home",
                    sellerTwo.getId(), sellerTwo.getName(),
                    "https://images.pexels.com/photos/6996099/pexels-photo-6996099.jpeg?cs=srgb&dl=pexels-castorly-stock-3872387-6996099.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Throw Pillow Set", 36.75, 26, "Home",
                    sellerTwo.getId(), sellerTwo.getName(),
                    "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?cs=srgb&dl=pexels-pixabay-276583.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Studio Headphones", 149.50, 10, "Electronics",
                    sellerTwo.getId(), sellerTwo.getName(),
                    "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?cs=srgb&dl=pexels-cottonbro-3394650.jpg&fm=jpg");
            createProductIfMissing(productRepository, "Tablet Sleeve", 25.00, 27, "Accessories",
                    sellerTwo.getId(), sellerTwo.getName(),
                    "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?cs=srgb&dl=pexels-andrew-neel-3178798-1334597.jpg&fm=jpg");
        };
    }

    private User createUserIfMissing(
            UserRepository userRepository,
            String name,
            String email,
            String password,
            String role
    ) {
        User existingUser = userRepository.findByEmail(email);
        if (existingUser != null) {
            return existingUser;
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
        return userRepository.save(user);
    }

    private void createProductIfMissing(
            ProductRepository productRepository,
            String name,
            double price,
            int stock,
            String category,
            Long sellerId,
            String sellerName,
            String imageUrl
    ) {
        if (productRepository.findByNameIgnoreCaseAndSellerId(name, sellerId).isPresent()) {
            return;
        }

        productRepository.save(createProduct(name, price, stock, category, sellerId, sellerName, imageUrl));
    }

    private Product createProduct(
            String name,
            double price,
            int stock,
            String category,
            Long sellerId,
            String sellerName,
            String imageUrl
    ) {
        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        product.setStock(stock);
        product.setCategory(category);
        product.setSellerId(sellerId);
        product.setSellerName(sellerName);
        product.setImageUrl(imageUrl);
        return product;
    }
}
