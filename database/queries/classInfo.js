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
            ON rc.master_id = rcv.master_id AND rc.id = rcv.class_id
        GROUP BY rc.master_id, rc.id
    ) clsv
        ON clsv.master_id = rcv.master_id AND clsv.id = rcv.class_id AND clsv.version = rcv.version
    WHERE delete_version IS NULL AND rcv.class_id=? AND rcv.master_id=? ;`

    let result = await db.Connection.query(query,[class_id,master_id]);

    let formatedResult;

    if (result.length === 0) {
      formatedResult = null;
    }
    else{
        formatedResult={
            class_id: result[0].class_id,
            master_id: result[0].master_id,
            name: result[0].name,
        }
    }   

    return formatedResult;
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
            ON rc.master_id = rcv.master_id AND rc.id = rcv.class_id
        GROUP BY rc.master_id, rc.id
    ) clsv
        ON clsv.master_id = rcv.master_id AND clsv.id = rcv.class_id AND clsv.version = rcv.version
    WHERE delete_version IS NULL AND rcv.name=? AND rcv.master_id=? ;`
    
    

    let result = await db.Connection.query(query,[name,master_id]);

    let formatedResult;

    if (result.length === 0) {
      formatedResult = null;
    }
    else{
        formatedResult={
            class_id: result[0].class_id,
            master_id: result[0].master_id,
            name: result[0].name,
        }
    }       

    return formatedResult;
}


// Funckija za dobivanje svih razreda za neki master table
exports.getAllClasses = async ({ master_id }) => {


  if (master_id === undefined) master_id = await getLastMasterId();

  let query = `SELECT rcv.master_id, rcv.class_id, rcv.name
  FROM ras_class_version rcv
  INNER JOIN (
      SELECT rc.master_id, rc.id, rc.delete_version, MAX(rcv.version) AS version
      FROM ras_class rc
      INNER JOIN ras_class_version rcv
          ON rc.master_id = rcv.master_id AND rc.id = rcv.class_id
      GROUP BY rc.master_id, rc.id
  ) clsv
      ON clsv.master_id = rcv.master_id AND clsv.id = rcv.class_id AND clsv.version = rcv.version
  WHERE delete_version IS NULL  AND rcv.master_id=? ;`;

  let formatedResult = [];

        

  let result = await db.Connection.query(query, [master_id]);



  if (result.length === 0) return formatedResult;
  else {
    result.forEach((razred) => {
      formatedResult.push({
        class_id: razred.class_id,
        master_id: razred.master_id,
        name: razred.name,
      });
    });
  }



  return formatedResult;
};
