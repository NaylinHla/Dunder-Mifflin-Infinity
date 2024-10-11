-- Drop existing tables if they exist (optional)
DROP TABLE IF EXISTS order_entries;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS paper_properties;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS paper;

-- Create customers table
CREATE TABLE customers (
                           id SERIAL PRIMARY KEY,
                           name VARCHAR(255),
                           address VARCHAR(255),
                           phone VARCHAR(50),
                           email VARCHAR(255)
);

-- Create paper table
CREATE TABLE paper (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(255),
                       discontinued BOOLEAN,
                       stock INTEGER,
                       price DOUBLE PRECISION
);

-- Create properties table
CREATE TABLE properties (
                            id SERIAL PRIMARY KEY,
                            property_name VARCHAR(255)
);

-- Create paper_properties join table (many-to-many relationship)
CREATE TABLE paper_properties (
                                  paper_id INTEGER REFERENCES paper(id),
                                  property_id INTEGER REFERENCES properties(id),
                                  PRIMARY KEY (paper_id, property_id)
);

-- Create orders table
CREATE TABLE orders (
                        id SERIAL PRIMARY KEY,
                        order_date TIMESTAMP WITH TIME ZONE,
                        delivery_date DATE,
                        status VARCHAR(50),
                        total_amount DOUBLE PRECISION,
                        customer_id INTEGER REFERENCES customers(id)
);

-- Create order_entries table (order items)
CREATE TABLE order_entries (
                               id SERIAL PRIMARY KEY,
                               quantity INTEGER,
                               product_id INTEGER REFERENCES paper(id),
                               order_id INTEGER REFERENCES orders(id)
);

-- Insert data into customers table
INSERT INTO customers (id, name, address, phone, email) VALUES
    (7, 'Naylin Hla', 'Hjertingvej 106', '28993603', 'naylinhla@gmail.com');

-- Insert data into paper table
INSERT INTO paper (id, name, discontinued, stock, price) VALUES
                                                             (28, 'Standard', FALSE, 96, 10),
                                                             (29, 'Deluxe', FALSE, 97, 25),
                                                             (30, 'Eco-Friendly', FALSE, 93, 5);

-- Insert data into properties table
INSERT INTO properties (id, property_name) VALUES
                                               (17, 'Blue'),
                                               (19, 'Black'),
                                               (20, 'Red');

-- Insert data into orders table
INSERT INTO orders (id, order_date, delivery_date, status, total_amount, customer_id) VALUES
    (19, '2024-10-09 14:41:08.031000 +00:00', '2024-10-10', 'Pending', 150, 7);

-- Insert data into order_entries table
INSERT INTO order_entries (id, quantity, product_id, order_id) VALUES
                                                                   (20, 3, 29, 19),
                                                                   (21, 7, 30, 19),
                                                                   (22, 4, 28, 19);