import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';


export type PermissionDocument = HydratedDocument<Permission>;

@Schema({timestamps: true})
export class Permission {

  @Prop()
  name: string;

  @Prop()
  apiPath: string;

  @Prop()
  method: string;

  @Prop()
  module: string;

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

export const PermissionSchema = SchemaFactory.createForClass(Permission);