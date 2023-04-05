DROP DATABASE IF EXISTS products;
CREATE DATABASE products;

\c products;

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT,
  slogan TEXT,
  description TEXT,
  category TEXT,
  default_price TEXT
);

CREATE TABLE styles (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  name TEXT,
  sale_price TEXT,
  original_price VARCHAR(50),
  default_style BOOLEAN
);

CREATE TABLE features (
  id SERIAL PRIMARY KEY,
  name TEXT,
  value TEXT,
  product_id INT REFERENCES products(id)
);

CREATE TABLE related_products (
  id SERIAL PRIMARY KEY,
  current_product_id INT REFERENCES products(id),
  related_product_id INT
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  style_id INT REFERENCES styles(id),
  url TEXT,
  thumbnail_url TEXT
);

CREATE TABLE skus (
  id SERIAL PRIMARY KEY,
  style_id INT REFERENCES styles(id),
  size TEXT,
  quantity INT
);

COPY products(id, name, slogan, description, category, default_price) FROM '/users/zach/Documents/sdc-data/product.csv' DELIMITER ',' CSV HEADER;
COPY styles(id, product_id, name, sale_price, original_price, default_style) FROM '/users/zach/Documents/sdc-data/styles.csv' DELIMITER ',' CSV HEADER;
COPY related_products(id, current_product_id, related_product_id) FROM '/users/zach/Documents/sdc-data/related.csv' DELIMITER ',' CSV HEADER;
COPY photos(id, style_id, url, thumbnail_url) FROM '/users/zach/Documents/sdc-data/photos.csv' DELIMITER ',' CSV HEADER;
COPY skus(id, style_id, size, quantity) FROM '/users/zach/Documents/sdc-data/skus.csv' DELIMITER ',' CSV HEADER;
