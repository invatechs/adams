var successMail="";
successMail += "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"margin-top:10px;\">";
successMail += "    <tr><td>Deploy status: <b>Success<\/b><\/td><\/tr>";
successMail += "    <tr><td>Git host: <b>{{host}}<\/b><\/td><\/tr>";
successMail += "    <tr><td>WebHook path: <b>{{webHookPath}}<\/b><\/td><\/tr>";
successMail += "    <tr><td>Branch: <b>{{branch}}<\/b><\/td><\/tr>";
successMail += "    <tr><td>Pushed by: <b>{{pusher}}<\/b><\/td><\/tr>";
successMail += "    <tr><td>Push comment: <b>{{commitComment}}<\/b><\/td><\/tr>";
successMail += "<\/table>";

var errorMail="";
errorMail += "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"margin-top:10px;\">";
errorMail += "    <tr><td>Deploy status: <b>Error<\/b><\/td><\/tr>";
errorMail += "    <tr><td>Git host: <b>{{host}}<\/b><\/td><\/tr>";
errorMail += "    <tr><td>WebHook path: <b>{{webHookPath}}<\/b><\/td><\/tr>";
errorMail += "    <tr><td>Branch: <b>{{branch}}<\/b><\/td><\/tr>";
errorMail += "    <tr><td>Pushed by: <b>{{pusher}}<\/b><\/td><\/tr>";
errorMail += "    <tr><td>Push comment: <b>{{commitComment}}<\/b><\/td><\/tr>";
errorMail += "<\/table>";

var mailTemplates = {
  success: successMail,
  error: errorMail
};

module.exports = mailTemplates;