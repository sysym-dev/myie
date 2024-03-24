import express from 'express';

export class BaseException {
  status: number;
  name: string = 'Error';
  message: string;

  constructor(status: number, message?: string) {
    this.status = status;
    this.message = message ?? '';
  }

  render(req: express.Request, res: express.Response) {
    return res.status(this.status).render(`errors/${this.status}`, {
      title: this.name,
      message: this.message,
    });
  }
}
