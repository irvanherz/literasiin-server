import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './midtrans.module-definition';
import { MidtransService } from './midtrans.service';

// @Module({})
// export class MidtransModule {
//   static forRoot(options: Record<string, any>): DynamicModule {
//     return {
//       module: MidtransModule,
//       providers: [
//         {
//           provide: 'MIDTRANS_OPTIONS',
//           useValue: options,
//         },
//         MidtransService,
//       ],
//       exports: [MidtransService],
//     };
//   }
// }

@Module({
  providers: [MidtransService],
  exports: [MidtransService],
})
export class MidtransModule extends ConfigurableModuleClass {}
