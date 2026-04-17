package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Product> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long sellerId
    ) {
        return productRepository.findAll().stream()
                .filter(product -> sellerId == null || sellerId.equals(product.getSellerId()))
                .filter(product -> category == null || category.isBlank()
                        || product.getCategory() != null
                        && product.getCategory().equalsIgnoreCase(category))
                .filter(product -> search == null || search.isBlank()
                        || containsIgnoreCase(product.getName(), search)
                        || containsIgnoreCase(product.getCategory(), search)
                        || containsIgnoreCase(product.getSellerName(), search))
                .sorted(Comparator.comparing(Product::getId))
                .toList();
    }

    @GetMapping("/categories")
    public List<String> getCategories() {
        return productRepository.findAll().stream()
                .map(Product::getCategory)
                .filter(category -> category != null && !category.isBlank())
                .map(String::trim)
                .collect(Collectors.collectingAndThen(Collectors.toSet(), categories -> categories.stream()
                        .sorted()
                        .toList()));
    }

    @PostMapping
    public ResponseEntity<Object> addProduct(@RequestBody Product product) {
        String validationError = validateProduct(product);
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }

        User seller = userRepository.findById(product.getSellerId()).orElse(null);
        if (seller == null || !"SELLER".equalsIgnoreCase(seller.getRole())) {
            return ResponseEntity.badRequest().body("A valid seller is required.");
        }

        product.setSellerName(seller.getName());
        product.setImageUrl(normalizeImageUrl(product.getImageUrl()));
        return ResponseEntity.status(HttpStatus.CREATED).body(productRepository.save(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        Product existingProduct = productRepository.findById(id).orElse(null);
        if (existingProduct == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
        }

        String validationError = validateProduct(updatedProduct);
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }

        if (!existingProduct.getSellerId().equals(updatedProduct.getSellerId())) {
            return ResponseEntity.badRequest().body("Seller ownership cannot be changed.");
        }

        existingProduct.setName(updatedProduct.getName().trim());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setStock(updatedProduct.getStock());
        existingProduct.setCategory(updatedProduct.getCategory().trim());
        existingProduct.setImageUrl(normalizeImageUrl(updatedProduct.getImageUrl()));
        return ResponseEntity.ok(productRepository.save(existingProduct));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        Product existingProduct = productRepository.findById(id).orElse(null);
        if (existingProduct == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
        }

        productRepository.deleteById(id);
        return ResponseEntity.ok("Product deleted.");
    }

    private String validateProduct(Product product) {
        if (product.getSellerId() == null) {
            return "Seller is required.";
        }
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            return "Product name is required.";
        }
        if (product.getCategory() == null || product.getCategory().trim().isEmpty()) {
            return "Category is required.";
        }
        if (product.getPrice() < 0) {
            return "Price cannot be negative.";
        }
        if (product.getStock() < 0) {
            return "Stock cannot be negative.";
        }
        return null;
    }

    private boolean containsIgnoreCase(String value, String search) {
        return value != null && value.toLowerCase(Locale.ENGLISH).contains(search.toLowerCase(Locale.ENGLISH));
    }

    private String normalizeImageUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            return null;
        }
        return imageUrl.trim();
    }
}
