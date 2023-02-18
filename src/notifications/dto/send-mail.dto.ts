type TemplateOptions = {
  name: string;
  parameters: any;
};

export class SendMailDto {
  template?: TemplateOptions;
  subject?: string;
  to: string;
  title?: string;
  text?: string;
  html?: string;
}
