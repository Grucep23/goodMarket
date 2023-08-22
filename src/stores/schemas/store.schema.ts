import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type StoreDocument = HydratedDocument<Store>;

@Schema({timestamps: true})

export class Store {

    @Prop()
    nameStore: string;
  
    @Prop()
    address: string;
  
    @Prop()
    description: string;
  
    @Prop()
    logo: string;
  
    @Prop({type: Object})
    createdBy: {
      _id: mongoose.Schema.Types.ObjectId,
      userName: string,
    };
  
    @Prop({type: Object})
    updatedBy: {
      _id: mongoose.Schema.Types.ObjectId,
      userName: string,
    };
  
    @Prop({type: Object})
    deletedBy: {
      _id: mongoose.Schema.Types.ObjectId,
      userName: string,
    };
  
    @Prop()
    createdAt: Date;
  
    @Prop()
    updatedAt: Date;
  
    @Prop()
    isDeleted: boolean;
  
    @Prop()
    deleteAt: Date;
  
  }

export const StoreSchema = SchemaFactory.createForClass(Store);