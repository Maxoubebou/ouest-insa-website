import NextForm from "next/form";
import { Section } from "@/common/layout";
import { fragmentOn } from "basehub";
import { buttonFragment } from "@/lib/basehub/fragments";
import { FormLayout, RichTextFormWrapper } from "@/app/_components/form-layout";
import { Button } from "@/common/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { LabeledInput, LabeledTextarea, LabeledWrapper } from "@/app/_components/labeled-input";
import { sendEvent, parseFormData } from "basehub/events";
import { Select } from "@/app/_components/select";
import { Resend } from "resend";

export const formFragment = fragmentOn("FormComponent", {
  title: true,
  subtitle: {
    json: {
      content: true,
    },
  },
  cta: buttonFragment,
  submissions: {
    ingestKey: true,
    schema: true,
  },
});
type Form = fragmentOn.infer<typeof formFragment>;

export function Form(props: Form) {
  return (
    <Section>
      <FormLayout
        subtitle={
          props.subtitle ? (
            <RichTextFormWrapper>{props.subtitle.json.content}</RichTextFormWrapper>
          ) : null
        }
        title={props.title}
      >
        <NextForm
          className="flex flex-col gap-3"
          action={async (data) => {
            "use server";
            const parsedData = parseFormData(
              props.submissions.ingestKey,
              props.submissions.schema,
              data,
            );
            if (!parsedData.success) {
              throw new Error(JSON.stringify(parsedData.errors));
            }
            await sendEvent(
              props.submissions.ingestKey,
              // @ts-expect-error -- basehub events are typed based on the schema, but this Form component should be generic
              parsedData.data,
            );

            // --- 2. Logique RESEND (Améliorée) ---
            const resend = new Resend(process.env.RESEND_API_KEY);

            // 1. Dictionnaire pour corriger les noms des champs
            const labelMap: Record<string, string> = {
              nom: "Nom",
              prNom: "Prénom",
              sociT: "Société",
              votreProjet: "Détails du projet",
              votreMail: "Adresse Email",
              commentAvezVousEntenduParlerDeNous: "Comment avez vous entendu parlez de nous",
            };

            // 2. Création des lignes du tableau HTML
            const rows = Object.entries(parsedData.data)
              .map(([key, value]) => {
                // On utilise le labelMap, ou on met la clé en majuscule si pas trouvée
                const label = labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
                
                // Style pour chaque ligne
                return `
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em; margin-bottom: 4px;">
                        ${label}
                      </div>
                      <div style="font-size: 16px; color: #111827; line-height: 1.5;">
                        ${value?.toString() || "-"}
                      </div>
                    </td>
                  </tr>
                `;
              })
              .join("");

            // 3. Template HTML complet (Design Email)
            const htmlTemplate = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; padding: 40px 20px; margin: 0;">
                
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                  
                  <div style="background-color: #3CACB6; padding: 30px 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Nouvelle Demande de Devis</h1>
                  </div>

                  <div style="padding: 40px;">
                    <table style="width: 100%; border-collapse: collapse;">
                      ${rows}
                    </table>
                    
                    <div style="margin-top: 30px; text-align: center;">
                       <a href="mailto:${parsedData.data.votreMail || ''}" style="display: inline-block; background-color: #3CACB6; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; font-size: 16px;">
                         Répondre au prospect
                       </a>
                    </div>
                  </div>

                  <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
                    Proposez sous 48h un rendez-vous au client, et dès que vous avez envoyé un mail de réponse, envoyez un message Slack pour prévenir que vous le prenez en charge.
                  </div>

                </div>
              </body>
              </html>
            `;

            await resend.emails.send({
              from: "Devis <onboarding@resend.dev>",
              to: ["demande-devis-website@ouest-insa.fr"],
              subject: `Devis : ${parsedData.data.sociT || "Nouveau prospect"} (${parsedData.data.nom})`,
              html: htmlTemplate,
            });
          }}
        >
          {props.submissions.schema.map((field) => {
            if (field.type === "textarea") {
              return (
                <LabeledTextarea key={field.id} rows={8} className="max-h-64 min-h-16" {...field} />
              );
            } else if (field.type === "select" || field.type === "radio") {
              return (
                <LabeledWrapper key={field.id} label={field.label} id={field.id}>
                  <Select id={field.id} name={field.name} required={field.required}>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </LabeledWrapper>
              );
            } else {
              return <LabeledInput key={field.id} {...field} />;
            }
          })}
          <div className="mt-3 flex items-center justify-between">
            <Button
              icon={props.cta.icon ?? <ArrowRightIcon className="size-5" />}
              iconSide="right"
              intent={props.cta.type}
              type="submit"
            >
              {props.cta.label}
            </Button>
          </div>
        </NextForm>
      </FormLayout>
    </Section>
  );
}