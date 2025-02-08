-- Tabla que almacena los tipos de entidad (ej. cliente, proveedor)
CREATE TABLE entity_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    description TEXT
);

-- Tabla que almacena la información de los tipos de impuesto
CREATE TABLE tax_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    percentage DECIMAL NOT NULL
);

-- Tabla que almacena la información de los roles de los usuarios
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
);

-- Tabla que almacena la información de las familias de productos
CREATE TABLE families (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    image_url VARCHAR,
    color VARCHAR
);

-- Tabla que almacena los tipos de documentos (ej. factura, albarán)
CREATE TABLE document_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT
);

-- Tabla que almacena los estados de los documentos (ej. pendiente, procesado)
CREATE TABLE document_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT
);

-- Tabla que almacena las formas de pago (ej. efectivo, tarjeta)
CREATE TABLE payment_methods (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
);

-- Tabla que almacena la información de los usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    role_id INT NOT NULL,
    image_url VARCHAR,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);


-- Tabla que almacena la información de las entidades (clientes o proveedores)
CREATE TABLE entities (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    alias VARCHAR,
    entity_type_id INT NOT NULL,
    address VARCHAR,
    zip_code VARCHAR,
    city VARCHAR,
    province VARCHAR,
    country VARCHAR,
    phone VARCHAR,
    email VARCHAR,
    tax_id VARCHAR,
    FOREIGN KEY (entity_type_id) REFERENCES entity_types(id)
);

-- Tabla que almacena la información de los productos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    price DECIMAL NOT NULL,
    family_id INT NOT NULL,
    tax_type_id INT NOT NULL,
    image_url VARCHAR,
    sold_by_weight BOOLEAN NOT NULL DEFAULT FALSE,
    retail_price DECIMAL NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
	cost DECIMAL NOT NULL,
    is_composite BOOLEAN NOT NULL DEFAULT FALSE,
    is_variation BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (family_id) REFERENCES families(id),
    FOREIGN KEY (tax_type_id) REFERENCES tax_types(id)
);

-- Tabla que almacena la relación entre productos compuestos y sus componentes
CREATE TABLE product_packs(
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    component_product_id INT NOT NULL,
	quantity DECIMAL NOT NULL,
	order INT NOT NULL,
	FOREIGN KEY (product_id) REFERENCES products(id),
	FOREIGN KEY (component_product_id) REFERENCES products(id)
);

-- Tabla que almacena las variaciones de los productos
CREATE TABLE product_variations(
	id SERIAL PRIMARY KEY,
	product_id INT NOT NULL,
	name VARCHAR NOT NULL,
	description TEXT,
	price DECIMAL NOT NULL,
	FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Tabla que almacena la información de producción planificada
CREATE TABLE productions (
	id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    production_date DATE NOT NULL,
    quantity DECIMAL NOT NULL,
	production_hour TIME NOT NULL,
	FOREIGN KEY (product_id) REFERENCES products(id)
);


-- Tabla que almacena la cabecera de los documentos (facturas, pedidos, etc.)
CREATE TABLE document_headers (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    number VARCHAR NOT NULL,
    discount_percentage DECIMAL,
    discount_amount DECIMAL,
    total_tax DECIMAL,
    entity_id INT,
	entity_address VARCHAR,
    entity_zip_code VARCHAR,
    entity_city VARCHAR,
    entity_province VARCHAR,
    entity_region VARCHAR,
    entity_country VARCHAR,
	entity_tax_id VARCHAR,
    document_type_id INT,
    observations TEXT,
    user_id INT,
    document_status_id INT,
    FOREIGN KEY (entity_id) REFERENCES entities(id),
    FOREIGN KEY (document_type_id) REFERENCES document_types(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (document_status_id) REFERENCES document_statuses(id)
);


-- Tabla que almacena las líneas de los documentos, incluyendo productos y descuentos.
-- Los importes se almacenan con la máxima precisión posible, sin redondeo.
CREATE TABLE document_lines (
    id SERIAL PRIMARY KEY,
    document_header_id INT NOT NULL,
    product_id INT,
    product_name VARCHAR NOT NULL,
    product_quantity DECIMAL (10,3) NOT NULL,
    product_price DECIMAL NOT NULL,
    tax_percentage DECIMAL NOT NULL,
	tax_amount DECIMAL NOT NULL,
    tax_description TEXT,
    discount_percentage DECIMAL,
    discount_amount DECIMAL NOT NULL,
    discount_description TEXT,
    line_total DECIMAL NOT NULL,
    line_order INT NOT NULL,
    line_type VARCHAR NOT NULL,
    