import { Table, Column, Model, DataType, AllowNull, HasMany } from 'sequelize-typescript';
import { User } from './User';

@Table({
  timestamps: true,
  tableName: 'roles',
})
export class Roles extends Model {
  
  @Column({
      type: DataType.STRING,
      allowNull: false
  })
  declare name: string;

  @HasMany(() => User)
  declare users: User;

}