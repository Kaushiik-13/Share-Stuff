import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { SellerProfileModule } from './seller_profile_creation/sellerProfile.module';
import { itemListingModule } from './item_listing/itemListing.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',   // change if different
      password: '1234',
      database: 'ss',     // your DB name
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // ❗ false because DB is already created
    }),
    AuthModule,
    SellerProfileModule,
    itemListingModule
  ],
})
export class AppModule {}
