import { Containers, services } from "@giusmento/mangojs-core";

import { INVERSITY_TYPES } from "@giusmento/mangojs-core";
import { Providers } from "@giusmento/mangojs-core";

import { utils } from "@giusmento/mangojs-core";

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

  console.log(`${emailFromAddress}, ${appName}`);

  const container = services.iam_server.IAMDefaultContainer;

  container.unbind(INVERSITY_TYPES.EmailService);
  container
    .bind<Providers.email.IEmailService>(INVERSITY_TYPES.EmailService)
    .toConstantValue(
      new Providers.email.EmailServiceBrevo(
        emailFromAddress,
        appName,
        brevoApikey
      )
    );
};
