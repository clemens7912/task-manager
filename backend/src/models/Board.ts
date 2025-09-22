import { BoardUser } from './BoardUser';
import { Columns } from './Columns';
import { Tags } from './Tags';
import { User } from './User';
import { Table, Column, Model, DataType, BelongsToMany, HasMany } from 'sequelize-typescript';

@Table({
	timestamps: true,
	tableName: 'board'
})
export class Board extends Model {
	
	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true
	})
	declare name: string;

	@BelongsToMany(() => User, () => BoardUser)
  	declare users: User[];

	@HasMany(() => BoardUser)
	declare boardUsers: BoardUser[];

	@HasMany(() => Columns)
	declare columns: Columns[];

	@HasMany(() => Tags)
	declare tags: Tags[];
}