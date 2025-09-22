import { Table, Column, Model, DataType, AllowNull, HasMany, BelongsTo, ForeignKey, Default, Index, BelongsToMany, HasOne } from 'sequelize-typescript';
import { Roles } from './Roles';
import { Board } from './Board';
import { BoardUser } from './BoardUser';
import { Cards } from './Cards';
import { UserCards } from './UserCards';

@Table({
  timestamps: true,
  tableName: 'users',
})
export class User extends Model {
  
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @ForeignKey(() => Roles)
  @Default(2)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare roleId: number;

  @BelongsTo(() => Roles)
  declare roles: Roles;

  @BelongsToMany(() => Board, () => BoardUser)
  declare boards: Board[];

  @HasMany(() => BoardUser)
	declare boardUsers: BoardUser[];

  @BelongsToMany(() => Cards, () => UserCards)
  declare cards: Cards[];
}