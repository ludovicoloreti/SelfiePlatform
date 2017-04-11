var config = require('../config/config'); // get config file
var path = require('path');
var color = require('colors-cli/safe')
var error = color.red.bold;
var warn = color.yellow;
var notice = color.x45;
var sys = require('util')
var child_process = require('child_process');
var fs = require('fs');
var winston = require('winston');
var srvLogger = require('express-logger');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'SelfiePlatformLogger',
      timestamp: function() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        var hh = today.getHours();
        var mms = today.getMinutes();
        var ss = today.getSeconds();
        if(dd<10){ dd='0'+dd }
        if(mm<10){ mm='0'+mm }
        if(mms<10){ mms='0'+mms}
        if(hh<10){ hh='0'+hh }
        if(ss<10){ ss='0'+ss }
        var oggi = dd+'/'+mm+'/'+yyyy+' - '+hh+':'+mms+':'+ss;
        return oggi;
      },
      filename: 'client/logs/client.json',
      json: true,
      level: 'info'
    })
  ]
});

logger.info('Server\'s running quite well. Let magic happens!',{error: false, start: true});

module.exports = function (app) {

  /* GET listing. */
  app.get('/api/photos', function(req, res, next) {
    var path = config.absolutePathImages;
    var data = [];
    fs.readdir(path, function(err, items) {
      console.log(notice("Stampo a schermo tutte le immagini presenti nel server:"));
      logger.info('GET - /api/photos. Invio le foto al client.',{error: false });
      counter = 1;
      for (var i=0; i<items.length; i++) {
        var file = path + '/' + items[i];
        data.push("http://"+config.server+':'+config.port+'/'+config.relativePathImages+'/'+items[i]);
        fs.stat(file, function(f) {
          return function(err, stats) {
            if (err === null) {
              console.log("Nome File: "+notice(f)+" - Dimensioni: "+notice(stats["size"])+" Byte");
              logger.info(counter+') Nome File: '+f+', Dimensioni: '+stats["size"]+' Byte.',{error: false });
              counter++;
            }
            else {
              console.log(error("Errore:"+err));
              logger.info('Errore nella creazione dell\'array contentente le immagini.',{error: true, errorMsg: JSON.stringify(err)});
            }
          }
        }(file));
      }
      res.json(data);
    });
  });

  app.get('/api/photos/:id', function(req, res, next) {
    console.log(req.params);
    res.json({"nomeaa": "belaaaa"});
  });


  app.post('/api/takePhoto', function(req, res) {
    // TODO control everything
    console.log("»   /api/takePhoto called.\nRequest Body is: \n" + JSON.stringify(req.body));
    logger.info('POST - /api/takePhoto. Nome foto: '+req.body.nome+' .',{error: false });
    var name = req.body.nome;
    child_process.exec('sudo gphoto2 --capture-image-and-download --filename "client/images/'+name+'.jpg"', function (err, stdout, stderr) {
      //sudo gphoto2 --capture-image-and-download --filename "client/images/'+name+'.jpg"
      console.log("\nCreazione del file in corso..\n")
      if (stdout) {
        console.log(notice(stdout));
        urlImage = 'http://'+config.server+':'+config.port+'/'+config.relativePathImages+'/'+name+'.jpg';
        logger.info('Foto creata con successo.',{error: false, url:urlImage});
        msgToSend = {
          success: true,
          msg: 'Photo has been taken.',
          response: stdout,
          image: urlImage
        };
      } else if (stderr) {
        console.log(error('stderr: ' + stderr));
        logger.info('Errore nella creazione della foto.',{error: true, errorMsg: JSON.stringify(stderr) });
        msgToSend = {
          success: false,
          msg: 'Photo has NOT been taken.',
          response: stderr
        };
      } else if (err) {
        console.log(error('exec error: ' + err));
        logger.info('Errore nella creazione della foto (exec_error).',{error: true, errorMsg: JSON.stringify(err) });
        msgToSend = {
          success: false,
          msg: 'Photo has NOT been taken. Exec error!',
          response: err
        };
      } else {
        console.log(warn("Codice non identificato. ")+"Possibilità:\n"+notice("- File creato con successo (http://"+config.server+":"+config.port+"/"+config.relativePathImages+"/"+name+")\n")+warn("- Errore totalmente sconosciuto"));
        logger.info('Errore non identificato. (Possibile file creato: http://'+config.server+':'+config.port+'/'+config.relativePathImages+'/'+name+')',{error: true, errorMsg: 'Errore Sconosciuto! - /api/takePhoto' });
        msgToSend = {
          success: true,
          msg: 'ok',
          fileName: 'http://'+config.server+':'+config.port+'/'+config.relativePathImages+'/'+name+'.jpg'
        };
      }
      res.json(msgToSend);
    });
  });


  app.post('/api/deleteAll', function(req, res) {
    // TODO control everything
    console.log("»   /api/deleteAll called.");
    var pwd = req.body.pwd;
    console.log("Password: "+pwd+"\n");
    logger.info('POST - /api/deleteAll. Password: '+pwd+'.',{error: false });
    if (pwd == "bitsabenba55") {
      child_process.exec('cd client/images && sudo rm -rf *', function (err, stdout, stderr) {
        console.log("\nCancellazione delle foto in corso..\n")
        if (stdout) {
          console.log(stdout);
          logger.info('Foto cancellate con successo! '+JSON.stringify(stdout),{error: false});
          msgToSend = {
            success: true,
            msg: 'Deleted.',
            response: stdout
          };
        } else if (stderr) {
          console.log('stderr: ' + stderr);
          logger.info('Errore nella cancellazione delle foto!',{error: true, errorMsg: JSON.stringify(stderr) });
          msgToSend = {
            success: false,
            msg: 'Error during the operation of delete.',
            response: stderr
          };
        } else if (err) {
          console.log('exec error: ' + err);
          logger.info('Errore nella cancellazione delle foto! (exec_error)',{error: true, errorMsg: JSON.stringify(err) });
          msgToSend = {
            success: false,
            msg: 'Exec error!',
            response: err
          };
        } else {
          console.log("CANCELLATE");
          logger.info('Foto cancellate con successo!',{error: false});
          msgToSend = {
            success: true,
            msg: 'PHOTOS DELETED!'
          };
        }
        res.json(msgToSend);
      });
    } else {
      logger.info('Errore nell\'autenticazione per la cancellazione delle foto.',{error: true, errorMsg: 'Password digitata: '+pwd });
      msgToSend = {
        success: false,
        msg: 'ERRORE AUTENTICAZIONE',
        response: 'Password digitata:'+pwd
      };
      res.json(msgToSend);
    }
  });


  // app.post('/api/deleteLogs', function(req, res) {
  //   // TODO control everything
  //   console.log("»   /api/deleteLogs called.");
  //   var pwd = req.body.pwd;
  //   console.log("Password: "+pwd+"\n");
  //   logger.info('POST - /api/deleteLogs. Password: '+pwd+'.',{error: false });
  //   if (pwd == "bitsabenba55") {
  //     child_process.exec('cd client/logs && whoami', function (err, stdout, stderr) {
  //       console.log("\nCancellazione del file di log in corso..\n")
  //       if (stdout) {
  //         console.log(stdout);
  //         logger.info('Logs cancellati con successo! '+JSON.stringify(stdout),{error: false});
  //         msgToSend = {
  //           success: true,
  //           msg: 'Deleted.',
  //           response: stdout
  //         };
  //       } else if (stderr) {
  //         console.log('stderr: ' + stderr);
  //         logger.info('Errore nella cancellazione dei logs!',{error: true, errorMsg: JSON.stringify(stderr) });
  //         msgToSend = {
  //           success: false,
  //           msg: 'Error during the operation of delete.',
  //           response: stderr
  //         };
  //       } else if (err) {
  //         console.log('exec error: ' + err);
  //         logger.info('Errore nella cancellazione dei logs! (exec_error)',{error: true, errorMsg: JSON.stringify(err) });
  //         msgToSend = {
  //           success: false,
  //           msg: 'Exec error!',
  //           response: err
  //         };
  //       } else {
  //         console.log("CANCELLATO");
  //         logger.info('Logs cancellati con successo!',{error: false});
  //         msgToSend = {
  //           success: true,
  //           msg: 'CARTELLA LOGS SVUOTATA!'
  //         };
  //       }
  //       res.json(msgToSend);
  //     });
  //   } else {
  //     logger.info('Errore nell\'autenticazione per la cancellazione dei logs.',{error: true, errorMsg: 'Password digitata: '+pwd });
  //     msgToSend = {
  //       success: false,
  //       msg: 'ERRORE AUTENTICAZIONE',
  //       response: 'Password digitata:'+pwd
  //     };
  //     res.json(msgToSend);
  //   }
  //   try { fs.unlinkSync("client/logs/client.json"); }
  //   catch (ex) { console.log(ex) }
  //   try { fs.unlinkSync("client/logs/server.log"); }
  //   catch (ex) { console.log(ex) }
  //   logger = new (winston.Logger)({
  //     transports: [
  //       new (winston.transports.File)({
  //         name: 'SelfiePlatformLogger',
  //         timestamp: function() {
  //           var today = new Date();
  //           var dd = today.getDate();
  //           var mm = today.getMonth()+1; //January is 0!
  //           var yyyy = today.getFullYear();
  //           var hh = today.getHours();
  //           var mms = today.getMinutes();
  //           var ss = today.getSeconds();
  //           if(dd<10){ dd='0'+dd }
  //           if(mm<10){ mm='0'+mm }
  //           if(mms<10){ mms='0'+mms}
  //           if(hh<10){ hh='0'+hh }
  //           if(ss<10){ ss='0'+ss }
  //           var oggi = dd+'/'+mm+'/'+yyyy+' - '+hh+':'+mms+':'+ss;
  //           return oggi;
  //         },
  //         filename: 'client/logs/client.json',
  //         json: true,
  //         level: 'info'
  //       })
  //     ]
  //   });
  //   app.use(srvLogger({path: "client/logs/server.log"}));
  // });


  app.post('/api/movePhotos', function(req, res) {
    // TODO control everything
    console.log("»   /api/movePhotos called.");
    var pwd = req.body.pwd;
    console.log("Password: "+pwd+"\n");
    logger.info('POST - /api/movePhotos. Password: '+pwd+'.',{error: false });
    if (pwd == "bitsabenba55") {
      child_process.exec('mv -v /home/pi/SelfiePlatform/client/images/* /media/anal/', function (err, stdout, stderr) {
        if (stdout) {
          console.log(stdout);
          logger.info('Foto passate con successo! '+JSON.stringify(stdout),{error: false});
          msgToSend = {
            success: true,
            msg: 'Bravoh.',
            response: stdout
          };
        } else if (stderr) {
          console.log('stderr: ' + stderr);
          logger.info('Errore nel passaggio delle foto!',{error: true, errorMsg: JSON.stringify(stderr) });
          msgToSend = {
            success: false,
            msg: 'Error during the operation of move photos.',
            response: stderr
          };
        } else if (err) {
          console.log('exec error: ' + err);
          logger.info('Errore nel passaggio delle foto! (exec_error)',{error: true, errorMsg: JSON.stringify(err) });
          msgToSend = {
            success: false,
            msg: 'Exec error!',
            response: err
          };
        } else {
          console.log("Passateeee");
          logger.info('Foto passate con successo!',{error: false});
          msgToSend = {
            success: true,
            msg: 'FOTO PASSATE CON SUCCESSO!'
          };
        }
        res.json(msgToSend);
      });
    } else {
      logger.info('Errore nell\'autenticazione per il passaggio delle foto.',{error: true, errorMsg: 'Password digitata: '+pwd });
      msgToSend = {
        success: false,
        msg: 'ERRORE AUTENTICAZIONE',
        response: 'Password digitata:'+pwd
      };
      res.json(msgToSend);
    }

  });



  app.post('/api/restart', function(req, res) {
    // TODO control everything
    console.log("»   /api/restart called.");
    var pwd = req.body.pwd;
    console.log("Password: "+pwd+"\n");
    try { fs.unlinkSync("client/logs/client.json"); }
    catch (ex) { console.log(ex) }
    try { fs.unlinkSync("client/logs/server.log"); }
    catch (ex) { console.log(ex) }
    logger = new (winston.Logger)({
      transports: [
        new (winston.transports.File)({
          name: 'SelfiePlatformLogger',
          timestamp: function() {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();
            var hh = today.getHours();
            var mms = today.getMinutes();
            var ss = today.getSeconds();
            if(dd<10){
              dd='0'+dd
            }
            if(mm<10){
              mm='0'+mm
            }
            if(mms<10){
              mms='0'+mms
            }
            if(hh<10){
              hh='0'+hh
            }
            var oggi = dd+'/'+mm+'/'+yyyy+' - '+hh+':'+mms+':'+ss;
            return oggi;
          },
          filename: 'client/logs/client.json',
          json: true,
          level: 'info'
        })
      ]
    });
    srvLogger({path: "client/logs/server.log"});
    logger.info('POST - /api/restart. Password: '+pwd+'.',{error: false });
    if (pwd == "restartRaspone_bitsabenba55") {
      child_process.exec('sudo reboot', function (err, stdout, stderr) {
        console.log("\nRiavvio in corso\n")
        if (stdout) {
          console.log(stdout);
          logger.info('SISTEMA IN RIAVVIO! '+JSON.stringify(stdout),{error: false});
          msgToSend = {
            success: true,
            msg: 'Rebooting.',
            response: stdout
          };
        } else if (stderr) {
          console.log('stderr: ' + stderr);
          logger.info('(mmh..) Errore tentativo di riavvio !',{error: true, errorMsg: JSON.stringify(stderr) });
          msgToSend = {
            success: false,
            msg: 'Error during the operation of reboot.',
            response: stderr
          };
        } else if (err) {
          console.log('exec error: ' + err);
          logger.info('(mmh..) Errore tentativo di riavvio (exec_error)!',{error: true, errorMsg: JSON.stringify(err) });
          msgToSend = {
            success: false,
            msg: 'Exec error!',
            response: err
          };
        } else {
          console.log("Rebooted");
          logger.info('SISTEMA RIAVVIATO!',{error: false});
          msgToSend = {
            success: true,
            msg: 'rebootedddd!'
          };
        }
        res.json(msgToSend);
      });
    } else {
      logger.info('Errore nell\'autenticazione per il riavvio.',{error: true, errorMsg: 'Password digitata: '+pwd });
      msgToSend = {
        success: false,
        msg: 'ERRORE AUTENTICAZIONE',
        response: 'Password digitata:'+pwd
      };

      res.json(msgToSend);

    }
  });


  /*
  // ESEMPI da usare ---------------------------------------------------------------------
  // get all todos
  app.get('/api/todos', function (req, res) {
  // use mongoose to get all todos in the database
  getTodos(res);
});

// create todo and send back all todos after creation
app.post('/api/todos', function (req, res) {

// create a todo, information comes from AJAX request from Angular
Todo.create({
text: req.body.text,
done: false
}, function (err, todo) {
if (err)
res.send(err);

// get and return all the todos after you create another
getTodos(res);
});

});

// delete a todo
app.delete('/api/todos/:todo_id', function (req, res) {
Todo.remove({
_id: req.params.todo_id
}, function (err, todo) {
if (err)
res.send(err);

getTodos(res);
});
});

// application -------------------------------------------------------------
// app.get('*', function (req, res) {
//   // console.log(res)
//   res.sendFile(__dirname + '/client/index.html'); // load the single view file (angular will handle the page changes on the front-end)
// });
*/
};
