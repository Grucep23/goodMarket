import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from 'src/permissions/schemas/permission.schema';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSIONS, INIT_STORES, USER_ROLE } from './data';
import { Store, StoreDocument } from 'src/stores/schemas/store.schema';

@Injectable()
export class DatabasesService implements OnModuleInit {
    private readonly logger = new Logger(DatabasesService.name);

    constructor(
        @InjectModel(User.name)
        private userModel: SoftDeleteModel<UserDocument>,

        @InjectModel(Permission.name)
        private permissionModel: SoftDeleteModel<PermissionDocument>,

        @InjectModel(Role.name)
        private roleModel: SoftDeleteModel<RoleDocument>,
        private configService: ConfigService,
        private userService: UsersService,

        @InjectModel(Store.name)
        private storeModel: SoftDeleteModel<StoreDocument>,

    ) { }


    async onModuleInit() {
        const isInit = this.configService.get<string>("SHOULD_INIT");
        if (Boolean(isInit)) {

            const countUser = await this.userModel.count({});
            const countPermission = await this.permissionModel.count({});
            const countStore = await this.storeModel.count({});
            const countRole = await this.roleModel.count({});

            //create permissions
            if (countPermission === 0) {
                await this.permissionModel.insertMany(INIT_PERMISSIONS);
            }

            // //create stores
            if (countStore === 0) {
                await this.storeModel.insertMany(INIT_STORES);
            }

            // create role
            if (countRole === 0) {
                const permissions = await this.permissionModel.find({}).select("_id");

                await this.roleModel.insertMany([
                    {
                        name: ADMIN_ROLE,
                        description: "Admin has full power",
                        isActive: true,
                        permissions: permissions
                    },
                    {
                        name: USER_ROLE,
                        description: "user use the system",
                        isActive: true,
                        permissions: []
                    }
                ]);
            }

            if (countUser === 0) {
                const adminRole = await this.roleModel.findOne({ name: ADMIN_ROLE });
                const userRole = await this.roleModel.findOne({ name: USER_ROLE })
                await this.userModel.insertMany([
                    {
                        userName: "admin",
                        email: "admin@gmail.com",
                        phoneNumber: "0909999999",
                        password: this.userService.getHashPassword(this.configService.get<string>("INIT_PASSWORD")),
                        role: adminRole?._id
                    },
                    {
                        userName: "nvktam",
                        email: "tam@gmail.com",
                        phoneNumber: "0902123123",
                        password: this.userService.getHashPassword(this.configService.get<string>("INIT_PASSWORD")),
                        role: userRole?._id
                    },
                    {
                        userName: "vthtrang",
                        email: "trang@gmail.com",
                        phoneNumber: "0902222000",
                        password: this.userService.getHashPassword(this.configService.get<string>("INIT_PASSWORD")),
                        role: userRole?._id
                    },
                ])
            }

            if (countUser > 0 && countRole > 0 && countPermission > 0) {
                this.logger.log('>>> ALREADY INIT DATA...');
            }
        }
    }
}
