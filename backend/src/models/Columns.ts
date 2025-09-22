import { Table, Model, Column, DataType, AllowNull, ForeignKey, BelongsTo, BelongsToMany, HasMany } from 'sequelize-typescript';
import { Board } from './Board';
import { Cards } from './Cards';

@Table({
    timestamps: true,
    tableName: 'columns'
})
export class Columns extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string;

    @ForeignKey(() => Board)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare boardId: number; 

    @BelongsTo(() => Board)
    declare board: Board;

    @HasMany(() => Cards)
    declare cards: Cards;
}