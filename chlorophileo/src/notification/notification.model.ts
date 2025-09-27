import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/user/user.model";

@Table({ tableName: 'notifications', paranoid: true })
export class Notification extends Model<Notification> {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ allowNull: false })
  message: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  read: boolean;

  @Column({ type: DataType.STRING, allowNull: false })
  plantId: string

  @ForeignKey(() => User)
  @Column({ field: 'userId', type: DataType.UUID })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}