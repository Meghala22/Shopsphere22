package com.example.demo;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private static final Set<String> VALID_STATUSES = Set.of("PENDING", "CONFIRMED", "SHIPPED", "DELIVERED");

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    @PostMapping("/checkout")
    public ResponseEntity<Object> checkout(
            @RequestParam(required = false) Long customerId,
            @RequestBody(required = false) CheckoutRequest checkoutRequest
    ) {
        Long resolvedCustomerId = customerId != null
                ? customerId
                : checkoutRequest != null ? checkoutRequest.getCustomerId() : null;
        String paymentMethod = checkoutRequest != null && checkoutRequest.getPaymentMethod() != null
                ? checkoutRequest.getPaymentMethod().trim()
                : "";

        if (resolvedCustomerId == null) {
            return ResponseEntity.badRequest().body("customerId is required.");
        }
        if (paymentMethod.isBlank()) {
            return ResponseEntity.badRequest().body("paymentMethod is required.");
        }

        User customer = userRepository.findById(resolvedCustomerId).orElse(null);
        if (customer == null || !"CUSTOMER".equalsIgnoreCase(customer.getRole())) {
            return ResponseEntity.badRequest().body("A valid customer is required.");
        }

        List<Cart> cartItems = cartRepository.findByCustomerId(resolvedCustomerId);
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body("Cart is empty.");
        }

        for (Cart cartItem : cartItems) {
            Product product = productRepository.findWithLockById(cartItem.getProductId()).orElse(null);
            if (product == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("One of the products in the cart no longer exists.");
            }
            if (cartItem.getQuantity() > product.getStock()) {
                return ResponseEntity.badRequest()
                        .body("Insufficient stock for " + product.getName() + ".");
            }
        }

        List<Order> orders = cartItems.stream().map(cartItem -> {
            Product product = productRepository.findWithLockById(cartItem.getProductId()).orElseThrow();
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);

            Order order = new Order();
            order.setCustomerId(customer.getId());
            order.setCustomerName(customer.getName());
            order.setSellerId(product.getSellerId());
            order.setSellerName(product.getSellerName());
            order.setProductId(product.getId());
            order.setProductName(product.getName());
            order.setQuantity(cartItem.getQuantity());
            order.setTotalPrice(product.getPrice() * cartItem.getQuantity());
            order.setPaymentMethod(paymentMethod);
            order.setStatus("PENDING");
            order.setCreatedAt(LocalDateTime.now());
            return orderRepository.save(order);
        }).toList();

        cartRepository.deleteByCustomerId(resolvedCustomerId);
        return ResponseEntity.status(HttpStatus.CREATED).body(orders);
    }

    @GetMapping
    public List<Order> getOrders(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long sellerId
    ) {
        if (customerId != null) {
            return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
        }
        if (sellerId != null) {
            return orderRepository.findBySellerIdOrderByCreatedAtDesc(sellerId);
        }
        return orderRepository.findAll().stream()
                .sorted((first, second) -> second.getCreatedAt().compareTo(first.getCreatedAt()))
                .toList();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateStatus(@PathVariable Long id, @RequestBody Order updatedOrder) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found.");
        }

        String nextStatus = updatedOrder.getStatus() == null ? "" : updatedOrder.getStatus().trim().toUpperCase();
        if (!VALID_STATUSES.contains(nextStatus)) {
            return ResponseEntity.badRequest().body("Invalid order status.");
        }

        order.setStatus(nextStatus);
        return ResponseEntity.ok(orderRepository.save(order));
    }
}
