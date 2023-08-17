import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
   
        @Prop({ required: true })
        phoneNumber: string;
    
        @Prop({ required: true })
        password: string;
    
        @Prop()
        name: string;
    
        @Prop()
        createdAt: Date;
    
        @Prop()
        updatedAt: Date;
        
        @Prop()
        isDeleted: boolean;
    
        @Prop()
        deleteAt: Date;
    }

export const UserSchema = SchemaFactory.createForClass(User);
