const aws = require("aws-sdk");
const nodemailer = require("nodemailer");
var s3 = new aws.S3();
aws.config.update({ region: "us-east-2" });

exports.handler = async (event) => {
  const {
    senderEmail,
    senderName,
    message,
    ssn,
    fileName,
    namecontrol,
    taxperiod,
    base64Data,
    date,
  } = JSON.parse(event.body);

  const base64RemoveDataURI = base64Data.replace(
    "data:application/pdf;base64,",
    ""
  );
  console.log("ssn:  ", ssn);
  console.log("fileName:  ", fileName);
  console.log("namecontrol:  ", namecontrol);
  console.log("taxperiod:  ", taxperiod);


  // now post to S3
  var s3 = new aws.S3();

  let buff = Buffer.from(base64RemoveDataURI, "base64");
  var params = {
    Bucket: "arn:aws:s3:us-east-2:076667109423:accesspoint/rjctest",
    Key: fileName,
    Body: buff,
  };
  let returnval = "";
  console.log("s3");
  try {
    console.log("enter s3 create");
    const data = await s3.putObject(params).promise();
    returnval = data;
    console.log("Successfully saved object to S3");
  } catch (err) {
    console.log("error: ", err);
  }

  console.log("S3 done");

  // now post to dynamo
  // Create the DynamoDB service object
  // Call DynamoDB to add the item to the table
  var ddb = new aws.DynamoDB({ apiVersion: "2012-08-10" });

  var paramsddb = {
    TableName: "rjc-test-files",
    Item: {
      ssn: { S: ssn },
      fileurl: {
        S: "https://my-test-bucket-rjc.s3.us-east-2.amazonaws.com/" + fileName},
      namecontrol: { S: namecontrol },
      taxperiod: { S: taxperiod },
    },
  };

  try {
    const data = await ddb.putItem(paramsddb).promise();
    console.log("Item entered successfully:", data);
  } catch (err) {
    console.log("Error: ", err);
  }

  console.log("ddb done");

  //return emailProps;
  return returnval;
};
