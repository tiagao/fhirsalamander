var express = require('express'),
    mysql = require('mysql');

var app = express();

app.use(express.static('public'));

var env = app.get('env');

if(env == 'development') {
  console.log('Using development settings.');
  app.set('connection', mysql.createConnection({
    host: process.env.LOCAL_MYSQL_HOSTNAME,
    user: process.env.LOCAL_MYSQL_USERNAME,
    port: process.env.LOCAL_MYSQL_PORT,
    password: process.env.LOCAL_MYSQL_PASSWORD,
    database: 'fhirsalamander'}));
} else if(env == 'production') {
  console.log('Using production settings.');
  app.set('connection', mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: 'fhirsalamander'}));
}

app.get('/', function(req, res) {
  res.sendfile('public/index.html');
});

app.get('/getResults', function(req, res) {
  var doctorName = req.query.doctorName;
  var specialties = req.query.specialties;

  var individualQueryValues = [];
  var individualQuery = (
    "SELECT p.npi, ip.name_first, ip.name_last, ip.accepting, ips.speciality " +
    "FROM Providers as p INNER JOIN IndividualProviders as ip ON (p.npi = ip.npi) " +
    "INNER JOIN IndividualProviderSpecialties as ips ON (p.npi = ips.npi) "
  );
  if(doctorName) {
    individualQuery += "WHERE (ip.name_first LIKE ? OR ip.name_last LIKE ?) ";
    individualQueryValues.push(doctorName + "%");
    individualQueryValues.push(doctorName + "%");
  }
  if(specialties) {
    individualQuery += "AND ips.speciality IN (?) ";
    individualQueryValues.push(specialties);
  }
  individualQuery += "ORDER BY p.npi LIMIT 20";

  var facilityQueryValues = [];
  var facilityQuery = (
    "SELECT p.npi, fp.facility_name " +
    "FROM Providers p INNER JOIN FacilityProviders as fp ON (p.npi = fp.npi) "
  );
  if(doctorName) {
    facilityQuery += "WHERE fp.facility_name LIKE ? ";
    facilityQueryValues.push(doctorName + "%");
  }
  facilityQuery += "ORDER BY p.npi LIMIT 10";

  var connection = res.app.get('connection');

  connection.query(individualQuery, individualQueryValues, function(individualErr, individualResults) {
    if(individualErr) {
      console.log(individualErr);
      res.send("{}");
    } else {
      connection.query(facilityQuery, facilityQueryValues, function(facilityErr, facilityResults) {
        if(facilityErr) {
          console.log(facilityErr);
          res.send("{}");
        } else {
          var fullResults = JSON.stringify({
            individuals: individualResults,
            facilities: facilityResults
          });
          console.log(fullResults);
          res.send(fullResults);
        }
      });
    }
  });
});

app.get('/getProviderPlans', function(req, res) {
  var npi = req.query.npi;

  var query = (
    "SELECT pp.npi, pl.plan_id, pl.marketing_name, pl.summary_url " +
    "FROM Plans as pl INNER JOIN ProviderPlans as pp ON (pl.plan_id = pp.plan_id) " +
    "WHERE pp.npi = ? LIMIT 100"
  );
  var queryValues = [npi];

  var connection = res.app.get('connection');

  connection.query(query, queryValues, function(err, results) {
    if(err) {
      console.log(err);
      res.send("[]");
    } else {
      console.log(results);
      res.send(JSON.stringify(results));
    }
  });
});

app.listen((process.env.PORT || 3000), '0.0.0.0', function() {
  console.log('FHIRSalamander listening!');
});
