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

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<Object> getCart(@RequestParam(required = false) Long customerId) {
        if (customerId == null) {
            return ResponseEntity.badRequest().body("customerId is required.");
        }
        return ResponseEntity.ok(cartRepository.findByCustomerId(customerId));
    }

    @PostMapping
    public ResponseEntity<Object> addToCart(@RequestBody Cart cart) {
        if (cart.getCustomerId() == null || cart.getProductId() == null || cart.getQuantity() <= 0) {
            return ResponseEntity.badRequest().body("customerId, productId, and quantity are required.");
        }

        Product product = productRepository.findById(cart.getProductId()).orElse(null);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
        }

        Cart existingCart = cartRepository.findByCustomerIdAndProductId(cart.getCustomerId(), cart.getProductId())
                .orElse(null);

        int requestedQuantity = cart.getQuantity();
        if (existingCart != null) {
            requestedQuantity += existingCart.getQuantity();
        }

        if (requestedQuantity > product.getStock()) {
            return ResponseEntity.badRequest().body("Requested quantity exceeds available stock.");
        }

        if (existingCart != null) {
            existingCart.setQuantity(requestedQuantity);
            return ResponseEntity.ok(cartRepository.save(existingCart));
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(cartRepository.save(cart));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateCart(@PathVariable Long id, @RequestBody Cart updatedCart) {
        Cart existingCart = cartRepository.findById(id).orElse(null);
        if (existingCart == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cart item not found.");
        }
        if (updatedCart.getQuantity() <= 0) {
            return ResponseEntity.badRequest().body("Quantity must be greater than zero.");
        }

        Product product = productRepository.findById(existingCart.getProductId()).orElse(null);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
        }
        if (updatedCart.getQuantity() > product.getStock()) {
            return ResponseEntity.badRequest().body("Requested quantity exceeds available stock.");
        }

        existingCart.setQuantity(updatedCart.getQuantity());
        return ResponseEntity.ok(cartRepository.save(existingCart));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeItem(@PathVariable Long id) {
        if (!cartRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cart item not found.");
        }
        cartRepository.deleteById(id);
        return ResponseEntity.ok("Item removed.");
    }

    @DeleteMapping
    public ResponseEntity<String> clearCart(@RequestParam(required = false) Long customerId) {
        if (customerId == null) {
            return ResponseEntity.badRequest().body("customerId is required.");
        }
        cartRepository.deleteByCustomerId(customerId);
        return ResponseEntity.ok("Cart cleared.");
    }
}
