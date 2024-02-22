CREATE TABLE address
(
    id            BIGINT NOT NULL AUTO_INCREMENT,
    street_number INTEGER,
    street_name   VARCHAR(255),
    suburb        VARCHAR(255),
    post_code     VARCHAR(255),
    city          VARCHAR(255),
    state         VARCHAR(255),
    PRIMARY KEY (id)
);