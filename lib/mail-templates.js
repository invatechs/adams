var successMail="";
successMail += "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"margin-top:10px;\">";
successMail += "    <tr style=\"width:100%; text-align=left;\">";
successMail += "        <td><b>{{host}}</b> repository <b>{{path}}</b> on branch <b>{{branch}}</b> has been successfully deployed. Pushed by <b>{{pusher}}</b> with comment: <b>{{commitComment}}</b>.<\/td>";
successMail += "    <\/tr>";
successMail += "<\/table>";

var errorMail="";
errorMail += "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"margin-top:10px;\">";
errorMail += "    <tr style=\"width:100%; text-align=left;\">";
errorMail += "        <td><b>{{host}}</b> repository <b>{{path}}</b> on branch <b>{{branch}}</b> has generated an error. Pushed by <b>{{pusher}}</b> with comment: <b>{{commitComment}}</b>.<\/td>";
errorMail += "    <\/tr>";
errorMail += "<\/table>";

var mailTemplates = {
  success: successMail,
  error: errorMail
};

module.exports = mailTemplates;