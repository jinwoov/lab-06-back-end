DROP TABLE IF EXISTS locationSearch;

CREATE TABLE locationSearch (
    id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude VARCHAR(255),
    longitude VARCHAR(255)
);

-- INSERT INTO people (first_name, last_name) VALUES ('Jin', 'Kim');