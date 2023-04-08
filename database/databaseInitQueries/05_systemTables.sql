-- -------------------------------------------------------------------------- --
--                             SISTEMSKE TABLICE                              --
-- -------------------------------------------------------------------------- --

-- Sistemske tablice koriste se za spremanje postavki bota i korisnika koji
-- su se putem discorda ili email-a pretplatili na bota

-- Postavke discord bota
CREATE TABLE IF NOT EXISTS ras_disc_setting (
    id INT AUTO_INCREMENT,
    option VARCHAR(30) NOT NULL,
    value TEXT,

    PRIMARY KEY (id),
    UNIQUE (option)
);

-- Serveri u kojima se nalazi discord bot
CREATE TABLE IF NOT EXISTS ras_disc_server (
    server_id VARCHAR(50),
    prefix TEXT,
    master_id INT,
    class_id INT,

    PRIMARY KEY (server_id),
    INDEX (server_id),
    FOREIGN KEY (master_id, class_id) REFERENCES ras_class(master_id, id)
);

-- Kanali konfigurirani da discord bot u njih šalje izmjene
CREATE TABLE IF NOT EXISTS ras_disc_channel (
    channel_id VARCHAR(50),
    server_id VARCHAR(50),
    prefix TEXT,
    master_id INT,
    class_id INT,
    mute BOOLEAN NOT NULL DEFAULT FALSE,
    
    PRIMARY KEY (channel_id),
    INDEX (server_id),
    FOREIGN KEY (server_id) REFERENCES ras_disc_server(server_id),
    FOREIGN KEY (master_id, class_id) REFERENCES ras_class(master_id, id)
);

-- Postavke email bota
CREATE TABLE IF NOT EXISTS ras_email_setting (
    id INT AUTO_INCREMENT,
    option VARCHAR(30) NOT NULL,
    value TEXT,

    PRIMARY KEY (id),
    UNIQUE (option)
);

-- Korisnici registrirani na email bota
CREATE TABLE IF NOT EXISTS ras_email_user (
    id INT AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    user_type VARCHAR(8),
    master_id INT,
    class_id INT,
    teacher_id INT,
    mute BOOLEAN NOT NULL DEFAULT FALSE,
    web_theme VARCHAR(15) NOT NULL DEFAULT 'light',
    web_token VARCHAR(100),
    web_token_created DATETIME,
    temp_token VARCHAR(100),
    temp_token_created DATETIME,
    temp_token_count INT NOT NULL DEFAULT 0,

    PRIMARY KEY (id),
    UNIQUE (email),
    UNIQUE (web_token),
    UNIQUE (temp_token),
    CONSTRAINT valid_user_type CHECK (user_type IN ('class', 'teacher')),
    FOREIGN KEY (master_id, class_id)   REFERENCES ras_class(master_id, id),
    FOREIGN KEY (master_id, teacher_id) REFERENCES ras_teacher(master_id, id)
);

-- Postavke vezane uz web sučelje
CREATE TABLE IF NOT EXISTS ras_web_setting (
    id INT AUTO_INCREMENT,
    option VARCHAR(30) NOT NULL,
    value TEXT,

    PRIMARY KEY (id),
    UNIQUE (option)
);


