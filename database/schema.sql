CREATE DATABASE IF NOT EXISTS openvintedbuddy
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE openvintedbuddy;

CREATE TABLE IF NOT EXISTS products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    category VARCHAR(80) NOT NULL DEFAULT 'Non classé',
    buy_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    sell_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    status ENUM(
        'Brouillon',
        'En ligne',
        'Réservé',
        'Vendu',
        'Archivé'
    ) NOT NULL DEFAULT 'Brouillon',
    views INT UNSIGNED NOT NULL DEFAULT 0,
    favorites INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_products_status (status),
    INDEX idx_products_created (created_at)
);

CREATE TABLE IF NOT EXISTS buyers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    display_name VARCHAR(120) NOT NULL,
    platform_reference VARCHAR(120) NULL,
    notes TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NULL,
    buyer_id BIGINT UNSIGNED NULL,
    product_title VARCHAR(180) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    fees DECIMAL(10, 2) NOT NULL DEFAULT 0,
    shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
    sold_at DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sales_product
        FOREIGN KEY (product_id)
        REFERENCES products (id)
        ON DELETE SET NULL,

    CONSTRAINT fk_sales_buyer
        FOREIGN KEY (buyer_id)
        REFERENCES buyers (id)
        ON DELETE SET NULL,

    INDEX idx_sales_date (sold_at)
);

CREATE TABLE IF NOT EXISTS expenses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(180) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(80) NOT NULL DEFAULT 'Autre',
    spent_at DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS goals (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(120) NOT NULL,
    target_amount DECIMAL(10, 2) NOT NULL,
    period ENUM('month', 'year') NOT NULL DEFAULT 'month',
    starts_at DATE NOT NULL,
    ends_at DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);