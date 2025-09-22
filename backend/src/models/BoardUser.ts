import { Table, Column, Model, ForeignKey, DataType, BelongsTo, Default } from 'sequelize-typescript';
import { User } from './User';
import { Board } from './Board';
import { BoardRoles } from './BoardRoles';

@Table({
  timestamps: true,
  tableName: 'board_users'
})
export class BoardUser extends Model {
	@ForeignKey(() => User)
	@Column({
		allowNull: false
	})
	declare userId: number;

	@BelongsTo(() => User)
	declare user: User;

	@ForeignKey(() => Board)
	@Column({
		allowNull: false
	})
	declare boardId: number;

	@BelongsTo(() => Board)
  	declare board: Board;

	@ForeignKey(() => BoardRoles)
	@Default(2)
	@Column
	declare roleId: number;

	@BelongsTo(() => BoardRoles)
	declare boardRoles: BoardRoles;

}