-- -------------------------------------------------------------------------- --
--                                TRIGGERI ZA                                 --
--                          TABLICE DNEVNIH IZMJENA                           --
-- -------------------------------------------------------------------------- --

-- Sljedeći trigeri koriste se za verifikaciju podataka prilikom upisa u tablice
-- dnevnih izmjena u rasporedu sati


-- Sljedeći trigger provjerava podatke koji se upisuju u tablicu ras_subject_change_field
-- potrebno je provjeriti, za period koji se upisuje je li dio seta perioda te
-- izmjene, te za grupu koja se upisuje je li dio razreda koji je dio seta razreda
-- te izmjene

-- DELIMITER $$
CREATE TRIGGER IF NOT EXISTS ras_subject_change_field_before_insert BEFORE INSERT ON ras_subject_change_field
    FOR EACH ROW
    BEGIN
        DECLARE var_master_version INT;      -- verzija iz tablice master_version
        DECLARE var_period_set_id INT;       -- ID seta perioda za tu izmjenu
        DECLARE var_period_set_version INT;  -- verzija tog seta perioda koja je relevantna

        DECLARE var_class_id INT;            -- ID razreda čija se grupa upisuje
        DECLARE var_class_set_id INT;        -- ID seta razreda za tu izmjenu
        DECLARE var_class_set_version INT;   -- verzija tog seta razreda koja je relevantna
        
        SET var_master_version = (
            SELECT master_version
            FROM ras_change
            WHERE id = NEW.change_id
        );

        SET var_period_set_id = (
            SELECT period_set_id
            FROM ras_subject_change
            WHERE change_id = NEW.change_id
        );
        SET var_period_set_version = (
            SELECT version
            FROM ras_period_set_item_list_version
            WHERE master_id = NEW.master_id AND period_set_id = var_period_set_id AND version <= var_master_version
            ORDER BY version DESC LIMIT 1
        );

        -- Provjeri nalazi li se dani period_id u setu perioda za tu izmjenu
        IF (SELECT COUNT(*) FROM ras_period_set_item WHERE version = var_period_set_version AND period_set_id = var_period_set_id AND period_id = NEW.period_id ) = 0 THEN
            SIGNAL SQLSTATE '45000' SET message_text = 'Given period is not in the period set';
        END IF;

        SET var_class_id = (
            SELECT class_id
            FROM ras_group_version
            WHERE master_id = NEW.master_id AND group_id = NEW.group_id AND version <= var_master_version
            ORDER BY version DESC LIMIT 1
        );
        SET var_class_set_id = (
            SELECT class_set_id
            FROM ras_subject_change
            WHERE change_id = NEW.change_id
        );
        SET var_class_set_version = (
            SELECT version
            FROM ras_class_set_item_list_version
            WHERE master_id = NEW.master_id AND class_set_id = var_class_set_id AND version <= var_master_version
            ORDER BY version DESC LIMIT 1
        );

        -- Provjeri nalazi li se dani class_id u setu razreda za tu izmjenu
        IF (SELECT COUNT(*) FROM ras_class_set_item WHERE version = var_class_set_version AND class_set_id = var_class_set_id AND class_id = var_class_id ) = 0 THEN
            SIGNAL SQLSTATE '45000' SET message_text = 'Given class is not in the class set';
        END IF;
    END;
-- DELIMITER ;


-- Sljedeći trigger provjerava podatke koji se upisuju u tablicu ras_subject_change_lesson_classroom
-- potrebno je provjeriti, je li dani period_id u setu perioda te izmjene i za dani lesson,
-- postoji li barem jedna grupa u tom lesson-u čiji je razred dio seta te izmjene

-- DELIMITER $$
CREATE TRIGGER IF NOT EXISTS ras_subject_change_lesson_classroom_before_insert BEFORE INSERT ON ras_subject_change_lesson_classroom
    FOR EACH ROW
    BEGIN
        DECLARE var_master_version INT;            -- verzija iz tablice master_version
        DECLARE var_period_set_id INT;             -- ID seta perioda za tu izmjenu
        DECLARE var_period_set_version INT;        -- verzija tog seta perioda koja je relevantna

        DECLARE var_class_set_id INT;              -- ID seta razreda za tu izmjenu
        DECLARE var_class_set_version INT;         -- verzija tog seta razreda koja je relevantna

        DECLARE number_of_groups_in_class_set INT; -- broj grupa iz te izmjene čiji se razredi nalaze u setu razreda
        
        SET var_master_version = (
            SELECT master_version
            FROM ras_change
            WHERE id = NEW.change_id
        );

        SET var_period_set_id = (
            SELECT period_set_id
            FROM ras_subject_change
            WHERE change_id = NEW.change_id
        );
        SET var_period_set_version = (
            SELECT version
            FROM ras_period_set_item_list_version
            WHERE master_id = NEW.master_id AND period_set_id = var_period_set_id AND version <= var_master_version
            ORDER BY version DESC LIMIT 1
        );

        -- Provjeri nalazi li se dani period_id u setu perioda za tu izmjenu
        IF (SELECT COUNT(*) FROM ras_period_set_item WHERE version = var_period_set_version AND period_set_id = var_period_set_id AND period_id = NEW.period_id ) = 0 THEN
            SIGNAL SQLSTATE '45000' SET message_text = 'Given period is not in the period set';
        END IF;

        SET var_class_set_id = (
            SELECT class_set_id
            FROM ras_subject_change
            WHERE change_id = NEW.change_id
        );
        SET var_class_set_version = (
            SELECT version
            FROM ras_class_set_item_list_version
            WHERE master_id = NEW.master_id AND class_set_id = var_class_set_id AND version <= var_master_version
            ORDER BY version DESC LIMIT 1
        );

        -- Query za prebrojavanje broja grupa danog lessona čiji su razredi u setu razreda
        SET number_of_groups_in_class_set = (
            WITH
            -- Jedan record, lesson koji se upisuje zajedno sa svojom verzijom
            -- master_version, koja se gleda za ovu izmjenu, dakle prva verzija
            -- manja ili jednaka master_version verziji izmjene
            items_mapped AS (
                SELECT master_id, lesson_id, MAX(version) AS version
                FROM ras_lesson_group_version
                WHERE master_id = NEW.master_id AND lesson_id = NEW.lesson_id AND version <= var_master_version
                GROUP BY master_id, lesson_id
            ),
            -- Lista svih grupa općenito, s time da je pored svake grupe ispisana
            -- verzija master_version, koja se gleda za ovu izmjenu, odnosno
            -- prva verzija manja ili jednaka master_version verziji izmjene
            group_mapped AS (
                SELECT master_id, group_id, MAX(version) AS version
                FROM ras_group_version
                WHERE version <= var_master_version
                GROUP BY master_id, group_id
            ),
            -- Lista razreda koji su u setu razreda ove izmjene
            class_set AS (
                SELECT *
                FROM ras_class_set_item
                WHERE master_id = NEW.master_id AND class_set_id = var_class_set_id AND version = var_class_set_version
            )

            -- Na dani lesson
            SELECT COUNT(*) AS groups_in_set FROM items_mapped
            -- Spoji sve njegove grupe
            INNER JOIN ras_lesson_group_version_item
                ON ras_lesson_group_version_item.master_id = items_mapped.master_id 
                    AND ras_lesson_group_version_item.lesson_id = items_mapped.lesson_id 
                    AND ras_lesson_group_version_item.version = items_mapped.version
            -- Na grupe spoji njihove verzije koje se gledaju
            INNER JOIN group_mapped
                ON group_mapped.master_id = items_mapped.master_id
                    AND group_mapped.group_id = ras_lesson_group_version_item.group_id
            -- S obzirom na id grupe i verziju grupe spoji podatke (class_id) za tu grupu
            INNER JOIN ras_group_version
                ON ras_group_version.master_id = group_mapped.master_id
                    AND ras_group_version.group_id = group_mapped.group_id
                    AND ras_group_version.version = group_mapped.version
            -- Poveži ih (INNER) na temelju razreda svake od grupa sa razredima u setu razreda
            INNER JOIN class_set
                ON ras_group_version.class_id = class_set.class_id
        );

        -- Ako je nakon povezivanja ostao barem 1 record upiši, inače baci grešku
        IF number_of_groups_in_class_set = 0 THEN
            SIGNAL SQLSTATE '45000' SET message_text = 'Given lesson does not contain any groups whose classes are in the class set';
        END IF;
    END;
-- DELIMITER ;


-- Sljedeći trigger provjerava podatke koji se upisuju u tablicu ras_subject_change_field_lesson
-- potrebno je provjeriti, za dani lesson i grupu, je li dana grupa dio danog lesson-a, odnosno
-- predaje li se danoj grupi u tom lesson-u

-- DELIMITER $$
CREATE TRIGGER IF NOT EXISTS ras_subject_change_field_lesson_before_insert BEFORE INSERT ON ras_subject_change_field_lesson
FOR EACH ROW
BEGIN
    DECLARE var_master_version INT;  -- verzija iz tablice master_version
    DECLARE var_lesson_version INT;  -- verzija master_version lesson-a koji se upisuje
    DECLARE var_group_id INT;        -- ID grupe za koju je definirano polje

    SET var_master_version = (
        SELECT ras_change.master_version
        FROM ras_subject_change_field
        INNER JOIN  ras_change
            ON ras_change.id = ras_subject_change_field.change_id
        WHERE ras_subject_change_field.id = NEW.field_id
    );

    SET var_lesson_version = (
        SELECT MAX(version)
        FROM ras_lesson_group_version
        WHERE master_id = NEW.master_id AND lesson_id = NEW.lesson_id AND version <= var_master_version
    );

    SET var_group_id = (
        SELECT group_id
        FROM ras_subject_change_field
        WHERE id = NEW.field_id
    );

    -- Prebroji sve grupe, koje su dio danog lessona, kojima je master_version
    -- jednak master_version verziji izmjene, koje su dio ove master_tablice i
    -- kojima je ID jednak ID-u tražene grupe (maksimalan broj takvih grupa je 1)
    IF (
        SELECT COUNT(*)
        FROM ras_lesson_group_version_item
        WHERE master_id = NEW.master_id
            AND lesson_id = NEW.lesson_id
            AND version = var_lesson_version
            AND group_id = var_group_id
    ) = 0 THEN
        SIGNAL SQLSTATE '45000' SET message_text = 'Given group is not part of given lesson';
    END IF;
END;
-- DELIMITER ;


