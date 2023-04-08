-- -------------------------------------------------------------------------- --
--                         TABLICE STATIČNOG RASPOREDA                        --
-- -------------------------------------------------------------------------- --

-- Tablice u ovom file-u koriste se za pohranu verzija statičnog rasporeda sati
-- koji se ne mijenja često.

-- Po pitanju verzija statičnog rasporeda postoje dvije vrste verzija, verzije
-- pohranjene u tablici ras_master_table, nemaju ništa zajedničko, te se stoga 
-- ništa ne nasljeđuje između njih, to su dva rasporeda koji su potpuno odvojeni
-- i ne postoje relacije između njihovih djelova

-- U tablici ras_master_version pohranjene su podverzije svakog od rasporeda u
-- tablici ras_master_table, kod svake izmjene u statičnom rasporedu umjesto da
-- prekopiramo cijeli raspored i kreiramo novi master_table, mi ćemo samo dodati
-- novu verziju u master_version koja nasljeđuje sve što nismo primijenili iz
-- prethodne verzije te tablice (ili barem većinu toga), na taj način uvelike
-- štedimo prostor, jer mala promjena ne zahtjeva kopiranje cijelog rasporeda
-- kako bi se sačuvala prethodna verzija.

-- Master tablica
CREATE TABLE IF NOT EXISTS ras_master_table (
    id INT AUTO_INCREMENT,
    created DATETIME,
    name VARCHAR(256),
    description VARCHAR(512),

    PRIMARY KEY (id)
);

-- Podverzija master tablice
CREATE TABLE IF NOT EXISTS ras_master_version (
    master_id INT NOT NULL,
    version INT AUTO_INCREMENT,

    PRIMARY KEY (version),
    UNIQUE (master_id, version),
    FOREIGN KEY (master_id) REFERENCES ras_master_table(id)
);

-- Tablica perioda (sati u danu)
CREATE TABLE IF NOT EXISTS ras_period (
    master_id INT,
    id INT,
    delete_version INT,

    PRIMARY KEY (master_id, id),
    FOREIGN KEY (master_id)                 REFERENCES ras_master_table(id),
    FOREIGN KEY (master_id, delete_version) REFERENCES ras_master_version(master_id, version)
);

-- Verzije pojedinog perioda
CREATE TABLE IF NOT EXISTS ras_period_version (
    master_id INT,
    period_id INT,
    version INT,
    name VARCHAR(256),
    short VARCHAR(256),
    start_time TIME,
    end_time TIME,

    PRIMARY KEY (master_id, period_id, version),
    FOREIGN KEY (master_id, version)   REFERENCES ras_master_version(master_id, version),
    FOREIGN KEY (master_id, period_id) REFERENCES ras_period(master_id, id)
);

-- Tablica dana (u tjednu)
CREATE TABLE IF NOT EXISTS ras_day (
    master_id INT,
    id INT,
    delete_version INT,

    PRIMARY KEY (master_id, id),
    FOREIGN KEY (master_id)                 REFERENCES ras_master_table(id),
    FOREIGN KEY (master_id, delete_version) REFERENCES ras_master_version(master_id, version)
);

-- Verzije pojedinog dana
CREATE TABLE IF NOT EXISTS ras_day_version (
    master_id INT,
    day_id INT,
    version INT,
    name VARCHAR(256),
    short VARCHAR(256),
    day_of_week VARCHAR(8),

    PRIMARY KEY (master_id, day_id, version),
    FOREIGN KEY (master_id, version) REFERENCES ras_master_version(master_id, version),
    FOREIGN KEY (master_id, day_id)  REFERENCES ras_day(master_id, id),
    CHECK (day_of_week IS NULL OR day_of_week IN ('mon', 'tue', 'wen', 'thu', 'fri', 'sat', 'sun'))
);

-- Tablica tjedna (u termu)
CREATE TABLE IF NOT EXISTS ras_week (
    master_id INT,
    id INT,
    delete_version INT,

    PRIMARY KEY (master_id, id),
    FOREIGN KEY (master_id)                 REFERENCES ras_master_table(id),
    FOREIGN KEY (master_id, delete_version) REFERENCES ras_master_version(master_id, version)
);

-- Verzije pjedinog tjedna
CREATE TABLE IF NOT EXISTS ras_week_version (
    master_id INT,
    week_id INT,
    version INT,
    start_week INT,
    week_cycle INT,
    name VARCHAR(256),
    short VARCHAR(256),

    PRIMARY KEY (master_id, week_id, version),
    FOREIGN KEY (master_id, version) REFERENCES ras_master_version(master_id, version),
    FOREIGN KEY (master_id, week_id) REFERENCES ras_week(master_id, id)
);

-- Tablica terma (dijela godine)
CREATE TABLE IF NOT EXISTS ras_term (
    master_id INT,
    id INT,
    delete_version INT,

    PRIMARY KEY (master_id, id),
    FOREIGN KEY (master_id)                 REFERENCES ras_master_table(id),
    FOREIGN KEY (master_id, delete_version) REFERENCES ras_master_version(master_id, version)
);

-- Verzije pojedinog terma
CREATE TABLE IF NOT EXISTS ras_term_version (
    master_id INT,
    term_id INT,
    version INT,
    start_date DATE,
    end_date DATE,
    name VARCHAR(256),
    short VARCHAR(256),

    PRIMARY KEY (master_id, term_id, version),
    FOREIGN KEY (master_id, version) REFERENCES ras_master_version(master_id, version),
    FOREIGN KEY (master_id, term_id) REFERENCES ras_term(master_id, id)
);

-- Tablica predmeta (subject)
CREATE TABLE IF NOT EXISTS ras_subject (
    master_id INT,
    id INT,
    delete_version INT,

    PRIMARY KEY (master_id, id),   
    FOREIGN KEY (master_id)                 REFERENCES ras_master_table(id),
    FOREIGN KEY (master_id, delete_version) REFERENCES ras_master_version(master_id, version)
);

-- Verzije pojedinog predmeta
CREATE TABLE IF NOT EXISTS ras_subject_version (
    master_id INT,
    subject_id INT,
    version INT,
    name VARCHAR(256),
    short VARCHAR(256),

    PRIMARY KEY (master_id, subject_id, version),
    FOREIGN KEY (master_id, version)    REFERENCES ras_master_version(master_id, version),
    FOREIGN KEY (master_id, subject_id) REFERENCES ras_subject(master_id, id)
);

-- Tablica profesora (teacher)
CREATE TABLE IF NOT EXISTS ras_teacher (
    master_id INT,
    id INT,
    delete_version INT,

    PRIMARY KEY (master_id, id),
    FOREIGN KEY (master_id)                 REFERENCES ras_master_table(id),
    FOREIGN KEY (master_id, delete_version) REFERENCES ras_master_version(master_id, version)
);

-- Verzije pojedinog profesora
CREATE TABLE IF NOT EXISTS ras_teacher_version (
    master_id INT,
    teacher_id INT,
    version INT,
    firstname VARCHAR(256),
    lastname VARCHAR(256),
    email VARCHAR(256),
    gender VARCHAR(16),
    color VARCHAR(256),

    PRIMARY KEY (master_id, teacher_id, version),
    FOREIGN KEY (master_id, version)    REFERENCES ras_master_version(master_id, version),
    FOREIGN KEY (master_id, teacher_id) REFERENCES ras_teacher(master_id, id)
);

-- Tablica razreda (class)
CREATE TABLE IF NOT EXISTS ras_class (
    master_id INT,
    id INT,
    delete_version INT,

    PRIMARY KEY (master_id, id),
    FOREIGN KEY (master_id)                 REFERENCES ras_master_table(id),
    FOREIGN KEY (master_id, delete_version) REFERENCES ras_master_version(master_id, version)
);

-- Verzije pojedinog razreda
CREATE TABLE IF NOT EXISTS ras_class_version (
    master_id INT,
    class_id INT,
    version INT,
    name VARCHAR(256),
    short VARCHAR(256),

    PRIMARY KEY (master_id, class_id, version),
    FOREIGN KEY (master_id, version)  REFERENCES ras_master_version(master_id, version),
    FOREIGN KEY (master_id, class_id) REFERENCES ras_class(master_id, id)
);

-- Tablica grupa (grupa je dio razreda prema nekoj podjeli)
CREATE TABLE IF NOT EXISTS ras_group (
    master_id INT,
    id INT,
    delete_version INT,

    PRIMARY KEY (master_id, id),
    FOREIGN KEY (master_id)                 REFERENCES ras_master_table(id),
    FOREIGN KEY (master_id, delete_version) REFERENCES ras_master_version(master_id, version)
);

-- Verzije pojedine grupe
CREATE TABLE IF NOT EXISTS ras_group_version (
    master_id INT,
    group_id INT,
    version INT,
    name VARCHAR(256),
    class_id INT,
    division_tag INT NOT NULL,
    everyone_group BOOLEAN NOT NULL,

    PRIMARY KEY (master_id, group_id, version),
    FOREIGN KEY (master_id, version)  REFERENCES ras_master_version(master_id, version),
    FOREIGN KEY (master_id, group_id) REFERENCES ras_group(master_id, id),
    FOREIGN KEY (master_id, class_id) REFERENCES ras_class(master_id, id)
);

-- Tablica lesson-a, lesson povezuje profesora i grupu (razred)
CREATE TABLE IF NOT EXISTS ras_lesson (
    master_id INT,
    id INT,
    delete_version INT,

    PRIMARY KEY (master_id, id),
    FOREIGN KEY (master_id)                 REFERENCES ras_master_table(id),
    FOREIGN KEY (master_id, delete_version) REFERENCES ras_master_version(master_id, version)
);

-- Verzije pojedinog lessona, odnosno verzije informacija (predmeta) vezanog
-- uz taj lesson
CREATE TABLE IF NOT EXISTS ras_lesson_version (
    master_id INT,
    lesson_id INT,
    version INT,
    subject_id INT,

    PRIMARY KEY (master_id, lesson_id, version),
    FOREIGN KEY (master_id, version)    REFERENCES ras_master_version(master_id, version),
    FOREIGN KEY (master_id, lesson_id)  REFERENCES ras_lesson(master_id, id),
    FOREIGN KEY (master_id, subject_id) REFERENCES ras_subject(master_id, id)
);

-- Verzija skupine grupa, koje su povezane na taj lesson, datle svaki puta kada
-- mijenjamo koje su grupe povezane na lesson, kreiramo novu verziju skupine grupa
-- i dodjelimo joj grupe pomoću tablice ras_lesson_group_version_item
CREATE TABLE IF NOT EXISTS ras_lesson_group_version (
    master_id INT,
    lesson_id INT,
    version INT,

    PRIMARY KEY (master_id, lesson_id, version),
    FOREIGN KEY (master_id, version)   REFERENCES ras_master_version(master_id, version),
    FOREIGN KEY (master_id, lesson_id) REFERENCES ras_lesson(master_id, id)
);

-- Grupa u verziji skupine grupa, grupe koje se pridružuju recordu iz tablice ras_lesson_group_version
CREATE TABLE IF NOT EXISTS ras_lesson_group_version_item (
    master_id INT,
    lesson_id INT,
    version INT,
    group_id INT,

    PRIMARY KEY (master_id, lesson_id, version, group_id),
    FOREIGN KEY (master_id, lesson_id, version) REFERENCES ras_lesson_group_version(master_id, lesson_id, version),
    FOREIGN KEY (master_id, group_id) REFERENCES ras_group(master_id, id)
);

-- Verzija skupine profesora, koji predaju na tom lesson-u, jednako kao i kod grupa
-- svaki puta kada mijenjamo profesore povezane na lesson, kreiramo novu skupinu
-- profesora i upišemo ih u tablicu ras_lesson_teacher_version_item
CREATE TABLE IF NOT EXISTS ras_lesson_teacher_version (
    master_id INT,
    lesson_id INT,
    version INT,

    PRIMARY KEY (master_id, lesson_id, version),
    FOREIGN KEY (master_id, version)   REFERENCES ras_master_version(master_id, version),
    FOREIGN KEY (master_id, lesson_id) REFERENCES ras_lesson(master_id, id)
);

-- Profesor u verziji skupine profesora povezanih na lesson, profesori se pridružuju
-- recordu iz tablice ras_lesson_teacher_version
CREATE TABLE IF NOT EXISTS ras_lesson_teacher_version_item (
    master_id INT,
    lesson_id INT,
    version INT,
    teacher_id INT,

    PRIMARY KEY (master_id, lesson_id, version, teacher_id),
    FOREIGN KEY (master_id, lesson_id, version) REFERENCES ras_lesson_teacher_version(master_id, lesson_id, version),
    FOREIGN KEY (master_id, teacher_id) REFERENCES ras_teacher(master_id, id)
);

-- Tablica card služi za povezivanje lessona sa vremenom, odnosno određuje kada koji
-- profesor predaje kojem razredu (grupi), specificira za lesson koji se term, tjedan,
-- dan i sat održava
CREATE TABLE IF NOT EXISTS ras_card (
    master_id INT,
    id INT,
    delete_version INT,

    PRIMARY KEY (master_id, id),
    FOREIGN KEY (master_id)                 REFERENCES ras_master_table(id),
    FOREIGN KEY (master_id, delete_version) REFERENCES ras_master_version(master_id, version)
);

-- Verzija pojedinog card-a (kartice)
CREATE TABLE IF NOT EXISTS ras_card_version (
    master_id INT,
    card_id INT,
    version INT,
    lesson_id INT,
    period_id INT,
    day_id INT,
    week_id INT,
    term_id INT,

    PRIMARY KEY (master_id, card_id, version),
    FOREIGN KEY (master_id, version)   REFERENCES ras_master_version(master_id, version),
    FOREIGN KEY (master_id, card_id)   REFERENCES ras_card(master_id, id),
    FOREIGN KEY (master_id, lesson_id) REFERENCES ras_lesson(master_id, id),
    FOREIGN KEY (master_id, period_id) REFERENCES ras_period(master_id, id),
    FOREIGN KEY (master_id, day_id)    REFERENCES ras_day(master_id, id),
    FOREIGN KEY (master_id, week_id)   REFERENCES ras_week(master_id, id),
    FOREIGN KEY (master_id, term_id)   REFERENCES ras_term(master_id, id)
);


