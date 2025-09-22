import { Table, Column, Model, DataType, AllowNull, HasMany } from 'sequelize-typescript';
import { User } from './User';
import { BoardUser } from './BoardUser';

@Table({
  timestamps: true,
  tableName: 'board_roles'
})
export class BoardRoles extends Model {
  
  @Column({
      type: DataType.STRING,
      allowNull: false
  })
  declare name: string;

  @HasMany(() => BoardUser)
  declare boardUsers: BoardUser[];

}