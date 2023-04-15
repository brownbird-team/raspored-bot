-- -------------------------------------------------------------------------- --
--                          TABLICE DNEVNIH IZMJENA                           --
-- -------------------------------------------------------------------------- --


-- Tablice unutar ovog file-a koriste se za pohranu dnevnih izmjena u rasporedu 
-- sati koji je pohranjen u tablicama iz file-a 01_primaryScheduleTables.sql. 
-- Dnevne izmjene su izmjene u rasporedu koje vrijede samo jedan odabrani dan
-- (datum), poanta ovih izmjena jest da ukoliko je neki profesor bolestan odnosno
-- nije u mogućnosti održati sat iz bilo kojeg razloga, u ove tablice će se
-- upisati tko će ga i kada mijenjati i što će raditi na toj zamjeni (može predavati
-- i neki drugi predmet umjesto zadanog)


-- Tablica izmjene pohranjuje verzije master_tablice na koju je izmjena spojena,
-- datum na koji se izmjena odnosi i o kojem se tipu izmjene radi, trenutno jedini
-- dozvoljeni tip izmjene je 'subject'
CREATE TABLE IF NOT EXISTS ras_change (
    id INT AUTO_INCREMENT,
    change_type VARCHAR(8) NOT NULL,
    master_id INT NOT NULL,
    master_version INT NOT NULL,
    change_date DATE,

    PRIMARY KEY (id),
    UNIQUE (id, change_type),
    UNIQUE (id, master_id),
    CONSTRAINT valid_change_type CHECK (change_type IN ('subject')),
    FOREIGN KEY (master_id, master_version) REFERENCES ras_master_version(master_id, version)
);

-- Ova tablica omogućuje kreiranje više verzija pojedine izmjene
CREATE TABLE IF NOT EXISTS ras_change_version (
    id INT AUTO_INCREMENT,
    change_id INT NOT NULL,
    created DATETIME NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (change_id) REFERENCES ras_change(id)
);

-- subject_change je tip izmjene koji za neki sat i razred odnosno grupu, definira
-- što će se održati i u kojoj učionici umjesto onog predmeta koji bi inače imali
CREATE TABLE IF NOT EXISTS ras_subject_change (
    change_id INT,
    master_id INT NOT NULL,
    change_type VARCHAR(8),
    class_set_id INT NOT NULL,
    period_set_id INT NOT NULL,

    PRIMARY KEY (change_id),
    UNIQUE(change_id, master_id),
    CONSTRAINT change_is_subject CHECK (change_type = 'subject'),
    FOREIGN KEY (change_id, change_type)   REFERENCES ras_change(id, change_type),
    FOREIGN KEY (master_id, class_set_id)  REFERENCES ras_class_set(master_id, id),
    FOREIGN KEY (master_id, period_set_id) REFERENCES ras_period_set(master_id, id)
);

-- Omogućuje da se definira u kojoj će se učionici održati neki lesson, za neki
-- period u danu koji je definiran u tablici ras_change
CREATE TABLE IF NOT EXISTS ras_subject_change_lesson_classroom (
    change_id INT,
    master_id INT,
    period_id INT,
    change_version_id INT,
    lesson_id INT,
    classroom_text VARCHAR(256),

    PRIMARY KEY (change_id, master_id, period_id, change_version_id, lesson_id),
    FOREIGN KEY (change_id, master_id)         REFERENCES ras_subject_change(change_id, master_id),
    FOREIGN KEY (change_id, change_version_id) REFERENCES ras_change_version(change_id, id),
    FOREIGN KEY (master_id, period_id)         REFERENCES ras_period(master_id, id),
    FOREIGN KEY (master_id, lesson_id)         REFERENCES ras_lesson(master_id, id)
);

-- Tablica ras_subject_change_field služi kako bi odabrali period u danu i grupu
-- za koju želimo kreirati izmjenu, te tip imjene kakav kreiramo, dostupni tipovi
-- su lesson, text, rel, empty i normal tip empty je poseban tip koji govori da ta
-- grupa nema predavanja taj sat, a tip normal, također poseban tip, govori da taj sat
-- razred ima ono što bi normalno imao, koristi se za poništavanje izmjene u sljedećoj
-- verziji iste izmjene
CREATE TABLE IF NOT EXISTS ras_subject_change_field (
    id INT AUTO_INCREMENT,
    change_id INT NOT NULL,
    master_id INT NOT NULL,
    change_version_id INT NOT NULL,
    field_type VARCHAR(8) NOT NULL,
    period_id INT NOT NULL,
    group_id INT NOT NULL,
    delete_version INT,

    PRIMARY KEY (id),
    UNIQUE (id, field_type),
    UNIQUE (id, master_id),
    UNIQUE (change_id, period_id, group_id, change_version_id),
    CONSTRAINT valid_field_type CHECK (field_type IN ('lesson', 'text', 'rel', 'empty', 'normal')),
    FOREIGN KEY (change_id, master_id)         REFERENCES ras_subject_change(change_id, master_id),
    FOREIGN KEY (change_id, change_version_id) REFERENCES ras_change_version(change_id, id),
    FOREIGN KEY (master_id, period_id)         REFERENCES ras_period(master_id, id),
    FOREIGN KEY (master_id, group_id)          REFERENCES ras_group(master_id, id),
    FOREIGN KEY (change_id, delete_version)    REFERENCES ras_change_version(change_id, id)
);

-- Tablica ras_subject_change_field_lesson predstavlja tip polja lesson, u ovom tipu polja
-- definiramo koju lekciju želimo da grupa ima umijesto lekcije koju bi inaće imala
CREATE TABLE IF NOT EXISTS ras_subject_change_field_lesson (
    field_id INT,
    field_type VARCHAR(8),
    master_id INT NOT NULL,
    lesson_id INT NOT NULL,

    PRIMARY KEY (field_id),
    CONSTRAINT field_is_lesson CHECK (field_type = 'lesson'),
    FOREIGN KEY (field_id, field_type) REFERENCES ras_subject_change_field(id, field_type),
    FOREIGN KEY (field_id, master_id)  REFERENCES ras_subject_change_field(id, master_id),
    FOREIGN KEY (master_id, lesson_id) REFERENCES ras_lesson(master_id, id)
);

-- Tablica ras_subject_change_field_text predstavlja tip polja text, na ovaj način
-- jednostavno upisujemo neki tekst, koji predstavlja ono što bi učenici trebali
-- imati taj sat umjesto uobičajene lekcije
CREATE TABLE IF NOT EXISTS ras_subject_change_field_text (
    field_id INT,
    field_type VARCHAR(8),
    field_text VARCHAR(256) NOT NULL,
    classroom_text VARCHAR(256),

    PRIMARY KEY (field_id),
    CONSTRAINT field_is_text CHECK (field_type = 'text'),
    FOREIGN KEY (field_id, field_type) REFERENCES ras_subject_change_field(id, field_type)
);

-- Tablica ras_subject_change_field_rel predstavlja polje rel, koje omogućuje da
-- danoj grupi postavimo da im neki profesor predaje neki predmet, ovo omogućuje
-- da bilo koji profesor predaje bilo koji predmet toj grupi
CREATE TABLE IF NOT EXISTS ras_subject_change_field_rel (
    field_id INT,
    field_type VARCHAR(8),
    master_id INT NOT NULL,
    teacher_id INT NOT NULL,
    subject_id INT NOT NULL,
    classroom_text VARCHAR(256),

    PRIMARY KEY (field_id),
    CONSTRAINT field_is_rel CHECK (field_type = 'rel'),
    FOREIGN KEY (field_id, field_type)  REFERENCES ras_subject_change_field(id, field_type),
    FOREIGN KEY (field_id, master_id)   REFERENCES ras_subject_change_field(id, master_id),
    FOREIGN KEY (master_id, teacher_id) REFERENCES ras_teacher(master_id, id),
    FOREIGN KEY (master_id, subject_id) REFERENCES ras_subject(master_id, id)
);


