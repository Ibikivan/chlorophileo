import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Notification } from "src/notification/notification.model";
import { Plant } from "src/plant/plant.model";

@Table({ tableName: 'users', paranoid: true })
class User extends Model<User> {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    declare id: string

    @Column({ unique: true, allowNull: false, validate: { isEmail: true } })
    email: string

    @Column({ allowNull: false })
    password: string

    @Column({ type: DataType.DATE, allowNull: true })
    tokenRevokedBefore: Date

    @HasMany(() => Plant)
    plants: Plant[]

    @HasMany(() => Notification)
    notifications: Notification[]
}

User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
};

export { User }
