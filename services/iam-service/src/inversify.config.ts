import {
  INVERSITY_TYPES,
  Providers,
  services,
  utils,
} from "@giusmento/mangojs-core";

export const setIAMContainer = () => {
  /**
   * BIND Services
   * Bind only services that need to be overridden or customized
   * Works only if you user services AFTER the start up
   * */

  // Bind Email Service - Brevo
  console.log("[IAM Service] Binding EmailService...");
  //get env variables
  const brevoApikey = utils.loadSecret("BREVO_APIKEY_FILE");
  const emailFromAddress = process.env.EMAIL_SENDER_ADDRESS || "";
  const appName = process.env.APP_NAME;

  console.log(`${brevoApikey}, ${emailFromAddress}, ${appName}`);

  services.iam_server.IAMDefaultContainer.unbind(INVERSITY_TYPES.EmailService);
  services.iam_server.IAMDefaultContainer.bind<Providers.email.IEmailService>(
    INVERSITY_TYPES.EmailService
  ).toConstantValue(
    new Providers.email.EmailServiceBrevo(
      emailFromAddress,
      appName,
      brevoApikey
    )
  );
};
