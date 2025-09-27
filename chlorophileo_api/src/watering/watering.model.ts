import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Plant } from "src/plant/plant.model";

@Table({ tableName: 'waterings', paranoid: true })
export class Watering extends Model<Watering> {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  date: Date

  @Column({type: DataType.ENUM('Pending', 'Completed', 'Missed'), defaultValue: 'Pending' })
  status: String

  @ForeignKey(() => Plant)
  @Column({ field: 'plantId', type: DataType.UUID })
  plantId: string

  @BelongsTo(() => Plant)
  plant: Plant
}