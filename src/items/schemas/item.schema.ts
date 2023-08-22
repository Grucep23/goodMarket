import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

@Schema({timestamps: true})
export class Item {

  
  @Prop()
  name: string;

  @Prop()
  classify: string[];

  @Prop({type: Object})
  store:{
    _id: mongoose.Schema.Types.ObjectId,
    name: string,
    logo: string,
  }

  @Prop()
  location: string;

  @Prop()
  description: string;

  @Prop()
  startDate: Date;

  @Prop()
  endtDate: Date;

  
  @Prop()
  isActive: boolean;

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

export const ItemSchema = SchemaFactory.createForClass(Item);
