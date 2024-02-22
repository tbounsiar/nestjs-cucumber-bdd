CREATE TABLE company
(
    id         BIGINT NOT NULL AUTO_INCREMENT,
    name       VARCHAR(255),
    email      VARCHAR(255),
    address_id BIGINT,
    PRIMARY KEY (id),
    FOREIGN KEY (address_id)
        REFERENCES address (id)
        ON DELETE CASCADE
);