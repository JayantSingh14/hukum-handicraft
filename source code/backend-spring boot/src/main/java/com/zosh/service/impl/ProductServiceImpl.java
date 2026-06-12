package com.zosh.service.impl;

import com.zosh.domain.GiftCategory;
import com.zosh.domain.InventoryChangeType;
import com.zosh.domain.ProductStatus;
import com.zosh.exception.ProductException;
import com.zosh.model.Category;
import com.zosh.model.InventoryLog;
import com.zosh.model.Occasion;
import com.zosh.model.Product;
import com.zosh.model.Recipient;
import com.zosh.repository.CategoryRepository;
import com.zosh.repository.InventoryLogRepository;
import com.zosh.repository.OccasionRepository;
import com.zosh.repository.ProductRepository;
import com.zosh.repository.RecipientRepository;
import com.zosh.request.CreateProductRequest;
import com.zosh.service.AuditLogService;
import com.zosh.service.InventoryService;
import com.zosh.service.ProductService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final OccasionRepository occasionRepository;
    private final RecipientRepository recipientRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryLogRepository inventoryLogRepository;
    private final InventoryService inventoryService;
    private final AuditLogService auditLogService;

    @Override
    public Product createProductByAdmin(CreateProductRequest req) throws ProductException {
        int discountPercentage = calculateDiscountPercentage(req.getMrpPrice(), req.getSellingPrice());

        Product product = new Product();
        product.setTitle(req.getTitle());
        product.setDescription(req.getDescription());
        product.setShortDescription(req.getShortDescription());
        product.setSku(req.getSku() != null ? req.getSku() : "SKU-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        product.setBrand(req.getBrand() != null ? req.getBrand() : "Hukum");
        product.setDiscountPercent(discountPercentage);
        product.setSellingPrice(req.getSellingPrice());
        product.setMrpPrice(req.getMrpPrice());
        int stockQuantity = req.getQuantity() > 0 ? req.getQuantity() : 50;
        product.setQuantity(stockQuantity);
        product.setLowStockThreshold(req.getLowStockThreshold() > 0 ? req.getLowStockThreshold() : 10);
        product.setImages(req.getImages());
        product.setThumbnailImage(req.getThumbnailImage() != null ? req.getThumbnailImage() :
                (req.getImages() != null && !req.getImages().isEmpty() ? req.getImages().get(0) : null));
        product.setTags(req.getTags());
        product.setGiftCategory(req.getGiftCategory());
        product.setPersonalized(req.isPersonalized());
        product.setAllowCustomerTextInput(req.isAllowCustomerTextInput());
        product.setAllowCustomerImageUpload(req.isAllowCustomerImageUpload());
        product.setCustomInstructions(req.getCustomInstructions());
        product.setPersonalizationCharges(req.getPersonalizationCharges());
        product.setFeatured(req.isFeatured());
        product.setStatus(req.getStatus() != null ? req.getStatus() : ProductStatus.ACTIVE);
        product.setIn_stock(stockQuantity > 0);
        product.setCreatedAt(LocalDateTime.now());

        setCategory(product, req.getCategoryId(), req.getSubcategoryId());
        setOccasionAndRecipient(product, req.getOccasionId(), req.getRecipientId());

        Product saved = productRepository.save(product);

        if (saved.getQuantity() > 0) {
            inventoryLogRepository.save(InventoryLog.builder()
                    .product(saved)
                    .previousQuantity(0)
                    .newQuantity(saved.getQuantity())
                    .changeAmount(saved.getQuantity())
                    .changeType(InventoryChangeType.INITIAL)
                    .note("Initial stock")
                    .changedBy("admin")
                    .build());
        }

        return saved;
    }

    @Override
    public List<Product> getAllProductsForAdmin() {
        return productRepository.findAll();
    }

    public static int calculateDiscountPercentage(double mrpPrice, double sellingPrice) {
        if (mrpPrice <= 0) {
            throw new IllegalArgumentException("Actual price must be greater than zero.");
        }
        double discount = mrpPrice - sellingPrice;
        return (int) ((discount / mrpPrice) * 100);
    }

    @Override
    public void deleteProduct(Long productId) throws ProductException {
        Product product = findProductById(productId);
        productRepository.delete(product);
    }

    @Override
    public Product updateProduct(Long productId, Product product) throws ProductException {
        Product existing = findProductById(productId);
        existing.setTitle(product.getTitle());
        existing.setDescription(product.getDescription());
        existing.setShortDescription(product.getShortDescription());
        existing.setSku(product.getSku());
        existing.setBrand(product.getBrand());
        existing.setMrpPrice(product.getMrpPrice());
        existing.setSellingPrice(product.getSellingPrice());
        existing.setDiscountPercent(calculateDiscountPercentage(product.getMrpPrice(), product.getSellingPrice()));
        existing.setQuantity(product.getQuantity());
        existing.setImages(product.getImages());
        existing.setThumbnailImage(product.getThumbnailImage());
        existing.setTags(product.getTags());
        existing.setGiftCategory(product.getGiftCategory());
        existing.setPersonalized(product.isPersonalized());
        existing.setAllowCustomerTextInput(product.isAllowCustomerTextInput());
        existing.setAllowCustomerImageUpload(product.isAllowCustomerImageUpload());
        existing.setCustomInstructions(product.getCustomInstructions());
        existing.setPersonalizationCharges(product.getPersonalizationCharges());
        existing.setFeatured(product.isFeatured());
        existing.setCategory(product.getCategory());
        existing.setSubcategory(product.getSubcategory());
        existing.setIn_stock(product.getQuantity() > 0);
        if (product.getStatus() != null) {
            existing.setStatus(product.getStatus());
        }
        return productRepository.save(existing);
    }

    @Override
    public Product updateProductStock(Long productId) throws ProductException {
        Product product = findProductById(productId);
        product.setIn_stock(!product.isIn_stock());
        return productRepository.save(product);
    }

    @Override
    public Product duplicateProduct(Long productId, String adminEmail) throws ProductException {
        Product original = findProductById(productId);
        Product duplicate = new Product();
        duplicate.setTitle(original.getTitle() + " (Copy)");
        duplicate.setDescription(original.getDescription());
        duplicate.setShortDescription(original.getShortDescription());
        duplicate.setSku("SKU-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        duplicate.setBrand(original.getBrand());
        duplicate.setCategory(original.getCategory());
        duplicate.setSubcategory(original.getSubcategory());
        duplicate.setMrpPrice(original.getMrpPrice());
        duplicate.setSellingPrice(original.getSellingPrice());
        duplicate.setDiscountPercent(original.getDiscountPercent());
        duplicate.setQuantity(original.getQuantity());
        duplicate.setImages(new ArrayList<>(original.getImages()));
        duplicate.setThumbnailImage(original.getThumbnailImage());
        duplicate.setTags(new ArrayList<>(original.getTags()));
        duplicate.setGiftCategory(original.getGiftCategory());
        duplicate.setOccasion(original.getOccasion());
        duplicate.setRecipient(original.getRecipient());
        duplicate.setPersonalized(original.isPersonalized());
        duplicate.setAllowCustomerTextInput(original.isAllowCustomerTextInput());
        duplicate.setAllowCustomerImageUpload(original.isAllowCustomerImageUpload());
        duplicate.setCustomInstructions(original.getCustomInstructions());
        duplicate.setPersonalizationCharges(original.getPersonalizationCharges());
        duplicate.setFeatured(false);
        duplicate.setStatus(ProductStatus.DRAFT);
        duplicate.setIn_stock(original.isIn_stock());
        duplicate.setCreatedAt(LocalDateTime.now());
        Product saved = productRepository.save(duplicate);
        auditLogService.log("DUPLICATE", "Product", saved.getId(), adminEmail, "Duplicated from " + productId);
        return saved;
    }

    @Override
    public Product enableProduct(Long productId) throws ProductException {
        Product product = findProductById(productId);
        product.setStatus(ProductStatus.ACTIVE);
        return productRepository.save(product);
    }

    @Override
    public Product disableProduct(Long productId) throws ProductException {
        Product product = findProductById(productId);
        product.setStatus(ProductStatus.DISABLED);
        return productRepository.save(product);
    }

    @Override
    public Product toggleFeatured(Long productId) throws ProductException {
        Product product = findProductById(productId);
        product.setFeatured(!product.isFeatured());
        return productRepository.save(product);
    }

    @Override
    public Product findProductById(Long id) throws ProductException {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductException("product not found"));
    }

    @Override
    public List<Product> searchProduct(String query) {
        return productRepository.searchProduct(query);
    }

    @Override
    public Page<Product> getAllProduct(String giftCategory,
                                       Long occasionId,
                                       Long recipientId,
                                       Boolean personalized,
                                       Integer minPrice,
                                       Integer maxPrice,
                                       Integer minDiscount,
                                       String sort,
                                       String stock,
                                       Integer pageNumber) {
        Specification<Product> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get("status"), ProductStatus.ACTIVE));

            if (giftCategory != null && !giftCategory.isEmpty()) {
                predicates.add(criteriaBuilder.equal(
                        root.get("giftCategory"), GiftCategory.valueOf(giftCategory.toUpperCase())));
            }
            if (occasionId != null) {
                predicates.add(criteriaBuilder.equal(root.get("occasion").get("id"), occasionId));
            }
            if (recipientId != null) {
                predicates.add(criteriaBuilder.equal(root.get("recipient").get("id"), recipientId));
            }
            if (personalized != null) {
                predicates.add(criteriaBuilder.equal(root.get("personalized"), personalized));
            }
            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("sellingPrice"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("sellingPrice"), maxPrice));
            }
            if (minDiscount != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("discountPercent"), minDiscount));
            }
            if (stock != null && stock.equalsIgnoreCase("in_stock")) {
                predicates.add(criteriaBuilder.isTrue(root.get("in_stock")));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Pageable pageable;
        if (sort != null && !sort.isEmpty()) {
            pageable = switch (sort) {
                case "price_low" ->
                        PageRequest.of(pageNumber != null ? pageNumber : 0, 10, Sort.by("sellingPrice").ascending());
                case "price_high" ->
                        PageRequest.of(pageNumber != null ? pageNumber : 0, 10, Sort.by("sellingPrice").descending());
                default -> PageRequest.of(pageNumber != null ? pageNumber : 0, 10, Sort.unsorted());
            };
        } else {
            pageable = PageRequest.of(pageNumber != null ? pageNumber : 0, 10, Sort.unsorted());
        }

        return productRepository.findAll(spec, pageable);
    }

    @Override
    public List<Product> recentlyAddedProduct() {
        return productRepository.findTop10ByOrderByCreatedAtDesc();
    }

    private void setCategory(Product product, Long categoryId, Long subcategoryId) throws ProductException {
        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ProductException("Category not found"));
            product.setCategory(category);
        }
        if (subcategoryId != null) {
            Category subcategory = categoryRepository.findById(subcategoryId)
                    .orElseThrow(() -> new ProductException("Subcategory not found"));
            product.setSubcategory(subcategory);
        }
    }

    private void setOccasionAndRecipient(Product product, Long occasionId, Long recipientId) throws ProductException {
        if (occasionId != null) {
            Occasion occasion = occasionRepository.findById(occasionId)
                    .orElseThrow(() -> new ProductException("Occasion not found"));
            product.setOccasion(occasion);
        }
        if (recipientId != null) {
            Recipient recipient = recipientRepository.findById(recipientId)
                    .orElseThrow(() -> new ProductException("Recipient not found"));
            product.setRecipient(recipient);
        }
    }
}
