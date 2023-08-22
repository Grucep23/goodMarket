import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
    @IsNotEmpty()
    name: string;
    description: string;

    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;

    @IsNotEmpty()
    @IsArray()
    @IsMongoId({each: true, message: "each permission is a mongo object id"})
    permissions: mongoose.Schema.Types.ObjectId[];
}
