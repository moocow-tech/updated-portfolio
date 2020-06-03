const sql = require('./db.js');

const StuSession = function(stuSession) {
    this.name = (stuSession.firstname + " " + stuSession.lastname);
    this.email = stuSession.email;
    this.course = stuSession.course;
};
//creates log in student_log
StuSession.createSession = (newInfo, result) => {   
    sql.query("INSERT INTO student_log set ?", newInfo, (err, res) => {
        if(err) {
            console.log("error: ", err);
            result(err, null);
            return;
        } 
       
        console.log("created student", {id: res.insertId, ...newInfo});
        result(null, {id: res.insertId, ...newInfo});
    });
};

//gets current sessions where there is no time_out
StuSession.getCurrentSession = (result) => {
    sql.query("Select * from student_log where time_out is NULL",(err,res) => {
        if(err) {
            console.log("error: ", err);
            result(null,err);
        } else {
            //console.log('tasks : ', res);
            result(null, res);
        }
    });
}; 

StuSession.getSessStats = (result) => {
    sql.query("select sum(case when time_out is null then 1 else 0 end)as IN_SESSION,count(time_out)as COMPLETE,count(distinct name)as STUDENT_COUNT from student_log",(err, res) => {
        if(err) {
            console.log("error: ", err);
            result(null,err);
        } else {
            console.log('tasks : ', res);
            result(null, res);
        }   
    });

} 
StuSession.updateById = (id , result) => {
    console.log(id)
    sql.query(
      "UPDATE student_log SET time_out = CURRENT_TIME() WHERE id = ?",
      id,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Customer with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated customer: ", { id: id });
        result(null, { id: id });
      }
    );
  };

module.exports = StuSession;