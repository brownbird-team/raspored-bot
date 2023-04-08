-- -------------------------------------------------------------------------- --
--                               TABLICE SETOVA                               --
-- -------------------------------------------------------------------------- --

-- Svrha tablica ras_class_set

-- Setovi razreda služe kako bi se definirala skupina razreda, ova funkcionalnost
-- korisna je kada škola ima dvije smjene koje funkcioniraju svaka za sebe, na taj
-- način svaka smjena može imati osobu koja je voditelj te smjene, i ta osoba može
-- kreirati set razreda za koji je zadužena i samo za njih podešavati izmjene

CREATE TABLE IF NOT EXISTS ras_class_set (
    master_id INT,
    id INT,
    delete_version INT,

    PRIMARY KEY (master_id, id),
    FOREIGN KEY (master_id)                 REFERENCES ras_master_table(id),
    FOREIGN KEY (master_id, delete_version) REFERENCES ras_master_version(master_id, version)
);

-- Verzija podataka vezanih uz set razreda
CREATE TABLE IF NOT EXISTS ras_class_set_version (
    master_id INT,
    class_set_id INT,
    version INT,
    name VARCHAR(256),
    unique_name VARCHAR(256),

    PRIMARY KEY (master_id, class_set_id, version),
    FOREIGN KEY (master_id, version)      REFERENCES ras_master_version(master_id, version),
    FOREIGN KEY (master_id, class_set_id) REFERENCES ras_class_set(master_id, id)
);

-- Verzija liste razreda koji se nalaze u setu razreda
CREATE TABLE IF NOT EXISTS ras_class_set_item_list_version (
    master_id INT,
    class_set_id INT,
    version INT,

    PRIMARY KEY (master_id, class_set_id, version),
    FOREIGN KEY (master_id, version)      REFERENCES ras_master_version(master_id, version),
    FOREIGN KEY (master_id, class_set_id) REFERENCES ras_class_set(master_id, id)
);

-- Razredi pridruženi verziji liste razreda u tablici ras_class_set_item_list_version
CREATE TABLE IF NOT EXISTS ras_class_set_item (
    master_id INT,
    class_set_id INT,
    version INT,
    class_id INT,

    PRIMARY KEY (master_id, class_set_id, version, class_id),
    FOREIGN KEY (master_id, class_set_id, version) REFERENCES ras_class_set_item_list_version(master_id, class_set_id, version),
    FOREIGN KEY (master_id, class_id)              REFERENCES ras_class(master_id, id)
);

-- Svrha tablica ras_period_set

-- Setovi perioda služe kako bi se definirala skupina perioda, u mnogim školama nastava
-- se održava u dvije smjene, ujutro/popodne, te smjene se često preklapaju predsatima
-- popodnevne ili kasnijim satima jutarnje smjene, pa tako ono što jutarnja smjena naziva
-- prvim satom popodnevnoj je -1. sat, setovi perioda omogućuju grupiranje perioda i odabir
-- posebnog naziva za svaki od perioda u skupini.

CREATE TABLE IF NOT EXISTS ras_period_set (
    master_id INT,
    id INT,
    delete_version INT,

    PRIMARY KEY (master_id, id),
    FOREIGN KEY (master_id)                 REFERENCES ras_master_table(id),
    FOREIGN KEY (master_id, delete_version) REFERENCES ras_master_version(master_id, version)
);

-- Verzija podataka vezanih uz set perioda
CREATE TABLE IF NOT EXISTS ras_period_set_version (
    master_id INT,
    period_set_id INT,
    version INT,
    name VARCHAR(256),
    unique_name VARCHAR(256),

    PRIMARY KEY (master_id, period_set_id, version),
    FOREIGN KEY (master_id, version)       REFERENCES ras_master_version(master_id, version),
    FOREIGN KEY (master_id, period_set_id) REFERENCES ras_period_set(master_id, id)
);

-- Verzija liste razreda koji se nalaze u setu razreda
CREATE TABLE IF NOT EXISTS ras_period_set_item_list_version (
    master_id INT,
    period_set_id INT,
    version INT,

    PRIMARY KEY (master_id, period_set_id, version),
    FOREIGN KEY (master_id, version)       REFERENCES ras_master_version(master_id, version),
    FOREIGN KEY (master_id, period_set_id) REFERENCES ras_period_set(master_id, id)
);

-- Razredi pridruženi verziji liste razreda u tablici ras_period_set_item_list_version
CREATE TABLE IF NOT EXISTS ras_period_set_item (
    master_id INT,
    period_set_id INT,
    version INT,
    period_id INT,
    specific_name VARCHAR(256),

    PRIMARY KEY (master_id, period_set_id, version, period_id),
    FOREIGN KEY (master_id, period_set_id, version) REFERENCES ras_period_set_item_list_version(master_id, period_set_id, version),
    FOREIGN KEY (master_id, period_id)              REFERENCES ras_period(master_id, id)
);


