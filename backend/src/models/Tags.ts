import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Board } from './Board';

@Table({
    timestamps: true,
    tableName: 'tags'
})
export class Tags extends Model {
    
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string; 

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare color: string; 

    @ForeignKey(() => Board)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare boardId: number;

    @BelongsTo(() => Board)
    declare board: Board;
    
}