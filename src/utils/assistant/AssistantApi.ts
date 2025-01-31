import { ConfigKey, ConfigService } from '../ConfigService';
import FetchApi from '../fetch/FetchApi';
export default class AssistantApi {
  private static instance: AssistantApi;
  private authToken: string | null = null;

  private constructor(
    private readonly fetchApi: FetchApi,
    private readonly configService: ConfigService
  ) {}

  static getInstance(): AssistantApi {
    if (!AssistantApi.instance) {
      AssistantApi.instance = new AssistantApi(
        FetchApi.getInstance(),
        ConfigService.getInstance()
      );
    }

    return AssistantApi.instance;
  }

  async auth() {
    const response = await this.fetchApi.fetch(
      `${process.env.REACT_APP_API_HOST}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: process.env.REACT_APP_API_LOGIN,
          password: process.env.REACT_APP_API_PASS,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      this.authToken = data.accessToken;
    }
  }

  async sendEmail(email: string, message: string): Promise<boolean> {
    if (!this.authToken) {
      await this.auth();
    }

    const displayName = this.configService.getValue<string>(
      ConfigKey.welcomeName
    );
    const response = await this.fetchApi.fetch(
      `${process.env.REACT_APP_API_HOST}/notification/email`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'BoardApp Notification',
          content: message,
          template: 'boardapp-notification',
          templateData: {
            displayName,
            message,
          },
          isHtml: true,
        }),
      }
    );

    if (response.ok) {
      console.log('Email notification sent successfully');
      return true;
    }
    return false;
  }
}
