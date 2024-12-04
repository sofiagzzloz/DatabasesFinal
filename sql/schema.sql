CREATE DATABASE restaurant_menu_database;
USE restaurant_menu_database;
CREATE TABLE restaurant (
	restaurant_id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_name VARCHAR(100) NOT NULL,
    address VARCHAR(100),
    city VARCHAR(50),
    country VARCHAR(50),
    website_link VARCHAR(200),
    contact_number VARCHAR(50),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

CREATE TABLE menu (
	menu_id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT,
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id),
    title VARCHAR(100) NOT NULL,
    version INT NOT NULL,
    created_at DATETIME NOT NULL,
    last_updated DATETIME NOT NULL
);

CREATE TABLE menu_section (
	section_id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT,
    FOREIGN KEY (menu_id) REFERENCES menu(menu_id),
    section VARCHAR(100) NOT NULL,
    section_description VARCHAR(200)
);

CREATE TABLE menu_item (
	item_id INT AUTO_INCREMENT PRIMARY KEY,
    section_id INT,
    FOREIGN KEY (section_id) REFERENCES menu_section(section_id),
    item VARCHAR(100) NOT NULL,
    item_description VARCHAR(200),
    price DECIMAL(5,2) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

CREATE TABLE dietary_restriction (
	restriction_id INT AUTO_INCREMENT PRIMARY KEY,
    restriction VARCHAR(50)
);

CREATE TABLE menu_item_dietary_restriction (
    item_id INT,
    restriction_id INT,
    PRIMARY KEY (item_id, restriction_id),
    FOREIGN KEY (item_id) REFERENCES menu_item(item_id),
    FOREIGN KEY (restriction_id) REFERENCES dietary_restriction(restriction_id)
);

CREATE TABLE ProcessingLog (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT,
    FOREIGN KEY (menu_id) REFERENCES menu(menu_id),
    operation_type VARCHAR(20) NOT NULL,
    file_name VARCHAR(255),
    operation_status VARCHAR(10) NOT NULL,
    operation_time_stamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    error_description TEXT
);