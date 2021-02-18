/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/

exports.getEmailHeader = (body, otp) => {
  return {
    to: body.emailAddress,
    from: 'support@cloudkibo.com',
    subject: `${body.storeName}: Your email address verification OTP`,
    text: `Your OTP is ${otp}`,
    bcc: 'accounts@cloudkibo.com'
  }
}

exports.getEmailBody = (email, otp) => {
  email.setHtml(`
    <body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;">
      <table class="body", style="width:100%">
        <tr>
          <td class="center" align="center" valign="top">
            <!-- BEGIN: Header -->
            <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;">
              <tr>
                <td class="center" align="center">
                  <!-- BEGIN: Header Container --> 
                  <table class="container" align="center">
                    <tr>
                      <td>
                        <table class="row ">
                          <tr>
                          </tr>
                        </table>
                        <!-- END: Logo -->
                      </td>
                      <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;">
                        <!-- BEGIN: Social Icons -->
                        <table class="six columns">
                          <tr>
                            <td>
                              <table class="wrapper social-icons" align="right" style="float: right;">i
                                <tr>
                                  <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;">
                                    <p style="color: #ffffff">
                                      Verify your email address
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!-- END: Social Icons -->
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <!-- END: Header Container -->
          </td>
        </tr>
      </table>
      <!-- END: Header -->
      <!-- BEGIN: Content -->
      <table class="container content" align="center">
        <tr>
          <td>
            <table class="row note">
              <tr>
                <td class="wrapper last">
                  <p> Hello, <br> Thank you for shopping with us. <br>Use the following otp to verify your email address <br>
                  </p>
                    <p>Send this OTP as message to the chatbot: ${otp}
                    </p>
                    <!-- BEGIN: Note Panel -->
                    <table class="twelve columns" style="margin-bottom: 10px">
                      <tr>
                        <td class="panel" style="background: #ECF8FF;border: 0;padding: 10px !important;">
                        </td>
                        <td class="expander">
                        </td>
                      </tr>
                    </table>
                    <!-- <p> If clicking the URL above does not work, copy and paste the URL into a browser window. </p> -->
                    <!-- END: Note Panel -->
                  </td>
                  </tr>
                  </table>
                    <span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span>
                    <!-- END: Disscount Content -->
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <!-- END: Content -->
      <!-- BEGIN: Footer -->
      <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;">
        <tr>
          <td class="center" align="center" style="vertical-align: middle;color: #fff;">
            <table class="container" align="center">
              <tr>
                <td style="vertical-align: middle;color: #fff;">
                  <!-- BEGIN: Unsubscribet -->
                  <table class="row">
                    <tr>
                      <td class="wrapper last" style="vertical-align: middle;color: #fff;">
                        <span style="font-size:12px;">
                          <i>This is a system generated email and reply is not required.</i>
                        </span>
                      </td>
                    </tr>
                  </table>
                  <!-- END: Unsubscribe -->
                  <!-- END: Footer Panel List -->
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <!-- END: Footer -->
    </td>
  </tr>
  </table>
  </body>
  `)
}
