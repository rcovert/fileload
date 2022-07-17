const aws = require("aws-sdk");
const nodemailer = require("nodemailer");
var s3 = new aws.S3();
aws.config.update({region: 'us-east-2'});

exports.handler = async (event) => {
  const { senderEmail, senderName, message, ssn, fileName, namecontrol, taxperiod, base64Data, date } = JSON.parse(
    event.body
  );

  const base64RemoveDataURI = base64Data.replace(
    "data:application/pdf;base64,",
    ""
  );
  console.log("ssn:  ", ssn);
  console.log("fileName:  ", fileName);
  console.log("namecontrol:  ", namecontrol);
  console.log("taxperiod:  ", taxperiod);

  //let transporter = nodemailer.createTransport({
  //  SES: new aws.SES({ region: "us-east-2", apiVersion: "2010-12-01" }),
  //});

  //let emailProps = await transporter.sendMail({
  //  from: senderName,
  //  to: senderEmail,
  //  subject: date,
  //  text: message,
  //  html: "<div>" + message + "</div>",
  //  attachments: [
  //    {
  //      filename: "TEST_FILE_NAME.pdf",
  //      content: base64RemoveDataURI,
  //      encoding: "base64",
  //    },
  //  ],
  //});
  
  // now post to S3
  var s3 = new aws.S3();
  
  let buff = Buffer.from(base64RemoveDataURI, 'base64');
  var params = {Bucket: 'arn:aws:s3:us-east-2:076667109423:accesspoint/rjctest', Key: fileName, Body: buff};
  let returnval = "";
  console.log("s3");
  try {
        console.log('enter s3 create')
        const data = await s3.putObject(params).promise();
        returnval = data;
        console.log("Successfully saved object to S3");
      } 
  catch (err) {
     console.log('error: ', err)
  };

  console.log('S3 done');
  
  // now post to dynamo
  // Create the DynamoDB service object
  var ddb = new aws.DynamoDB({apiVersion: '2012-08-10'});
  
  ddb.putItem(
  {
    "TableName": "rjc-test-files",
    "Item": {
        "ssn": {"S": ssn},
        "fileurl": {"S": 'https://my-test-bucket-rjc.s3.us-east-2.amazonaws.com/'+fileName},
        "namecontrol": {"S": namecontrol},
        "taxperiod":{"S": taxperiod}
    }
  }, function(result) {
    result.on('data', function(chunk) {
        console.log("" + chunk);
    });
  });
  console.log("Items are succesfully ingested in table .................."); 

  console.log('ddb done');

  //return emailProps;
  return returnval;
};
