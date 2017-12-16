import db from 'oracledb';
import config from '../../config.js';

const dbConn = {
    "user": config.user,
    "password": config.password,
    "connectString": config.connectString
  }
// GET: /api/todos
exports.get = (req, res, next) => {
    db.getConnection(
        dbConn,
        function(err, connection)
        {
          if (err) {
            console.error(err.message);
            return;
          }
          connection.execute(
            // The statement to execute
            /*
            "SELECT department_id, department_name " +
              "FROM departments " +
              "WHERE department_id = :id",
            */
            "SELECT INFO FROM HELP WHERE SEQ = :id",  
            // The "bind value" 180 for the "bind variable" :id
            [5],
      
            // Optional execute options argument, such as the query result format
            // or whether to get extra metadata
            // { outFormat: oracledb.OBJECT, extendedMetaData: true },
      
            // The callback function handles the SQL execution results
            function(err, result)
            {
              if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
              }
              console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
              console.log(result.rows);     // [ [ 180, 'Construction' ] ]
              doRelease(connection);
            });
        });
    
};
 
 // GET: /api/todo
 exports.getOne = function(req, res, next){
    db.Todo.find({where: {id:req.params.id}}).success(function(todos){
         console.log(req.params.id);
         res.send(todos);
         return next();
    });
    
 };
 
 // POST: /api/todos
 exports.post = function(req, res, next){
     var sql;
     if(req.body.text != ""){
         sql = {text:req.body.text};
     } 
      if (req.body.details != ""){
         sql = {text:req.body.text,details:req.body.details};
     }	
     db.Todo.create(sql).success(function(todo){
         db.Todo.findAll().success(function(todos){
             res.send(todos);
             return next();
        });
     });
     
    return next();
 };
 
 // D: /api/todos
 exports.del = function(req, res, next){
     db.Todo.destroy({id:req.params.id}).success(function(affectedRows){
         console.log(affectedRows);
         
         db.Todo.findAll().success(function(todos){
             res.send(todos);
             return next();
        });
     });	
 };

 function doRelease(connection)
 {
   connection.close(
     function(err) {
       if (err) {
         console.error(err.message);
       }
     });
 }