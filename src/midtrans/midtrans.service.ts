import { Inject, Injectable } from '@nestjs/common';
import * as midtransClient from 'midtrans-client';
import { MODULE_OPTIONS_TOKEN } from './midtrans.module-definition';

@Injectable()
export class MidtransService {
  options: any;
  snap: any;
  iris: any;
  coreApi: any;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) private opts: any) {
    this.options = opts;
    this.snap = new midtransClient.Snap(opts);
    this.iris = new midtransClient.Iris(opts);
    this.coreApi = new midtransClient.CoreApi(opts);
  }
}
