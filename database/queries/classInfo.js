const db = require('../connect');
const {getLastMasterId} = require('./general.js');
// funkcija koja vraca razred po id-u i master-id-u
exports.getClassById = async ({class_id, master_id}) =>{

    if(master_id === undefined) master_id = await getLastMasterId();

    let query = `SELECT rcv.master_id, rcv.class_id, rcv.name
    FROM ras_class_version rcv
    INNER JOIN (
        SELECT rc.master_id, rc.id, rc.delete_version, MAX(rcv.version) AS version
        FROM ras_class rc
        INNER JOIN ras_class_version rcv
        GROUP BY rc.master_id, rc.id
    ) clsv
        ON clsv.master_id = rcv.master_id AND clsv.id = rcv.class_id AND clsv.version = rcv.version
    WHERE delete_version IS NULL AND rcv.class_id=? AND rcv.master_id=? ;`

    let result = db.Connection.query(query,[class_id,master_id]);
    return result;
}
// Funkcija koja vraća ime podatke o razredu uz pomoć imena i master_id-a
exports.getClassByName = async ({name, master_id}) =>{

    if(master_id === undefined) master_id = await getLastMasterId();


    let query = `SELECT rcv.master_id, rcv.class_id, rcv.name
    FROM ras_class_version rcv
    INNER JOIN (
        SELECT rc.master_id, rc.id, rc.delete_version, MAX(rcv.version) AS version
        FROM ras_class rc
        INNER JOIN ras_class_version rcv
        GROUP BY rc.master_id, rc.id
    ) clsv
        ON clsv.master_id = rcv.master_id AND clsv.id = rcv.class_id AND clsv.version = rcv.version
    WHERE delete_version IS NULL AND rcv.name=? AND rcv.master_id=? ;`
    
    

    let result = db.Connection.query(query,[name,master_id]);
    return result;
}



exports.getAllClasses = async ({master_id}) =>{

    if(master_id === undefined)  master_id = await getLastMasterId();

    let query = `SELECT rcv.master_id, rcv.class_id, rcv.name
    FROM ras_class_version rcv
    INNER JOIN (
        SELECT rc.master_id, rc.id, rc.delete_version, MAX(rcv.version) AS version
        FROM ras_class rc
        INNER JOIN ras_class_version rcv
        GROUP BY rc.master_id, rc.id
    ) clsv
        ON clsv.master_id = rcv.master_id AND clsv.id = rcv.class_id AND clsv.version = rcv.version
    WHERE delete_version IS NULL AND rcv.master_id=? ;`
    

    let result = db.Connection.query(query,[master_id]);
    return result;
}
