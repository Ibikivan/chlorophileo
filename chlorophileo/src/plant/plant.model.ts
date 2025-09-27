import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "src/user/user.model";
import { Watering } from "src/watering/watering.model";
import * as dotenv from 'dotenv'
dotenv.config();

@Table({ tableName: 'plants', paranoid: true })
class Plant extends Model<Plant> {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string

  @Column({ allowNull: false })
  name: string

  @Column({ allowNull: true })
  species: string

  @Column({ field: 'imageUrl' })
  imageUrl: string

  @Column({ field: 'waterAmount', type: DataType.FLOAT })
  waterAmount: number // quantité d’eau (L)

  @Column({ type: DataType.INTEGER })
  frequency: number // fréquence en heure

  @ForeignKey(() => User)
  @Column({ field: 'userId', type: DataType.UUID })
  userId: string

  @BelongsTo(() => User)
  user: User

  @HasMany(() => Watering)
  waterings: Watering[]
}

Plant.prototype.toJSON = function () {
  const values = Object.assign({}, this.get())
  values.imageUrl = values.imageUrl ? process.env.API_URL + values.imageUrl : null;
  return values;
};

export { Plant }
