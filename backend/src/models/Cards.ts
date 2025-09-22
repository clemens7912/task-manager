import { Table, Model, BelongsToMany, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';
import { Tags } from './Tags';
import { CardsTags } from './CardsTags';
import { Columns } from './Columns';
import { UserCards } from './UserCards';

@Table({
    timestamps: true,
    tableName: 'cards'
})
export class Cards extends Model {
    
    @BelongsToMany(() => Tags, () => CardsTags)
    declare tags: Tags[];

    @ForeignKey(() => Columns)
    @Column({
        type: DataType.INTEGER, 
        allowNull: false
    })
    declare columnId: number; 

    @BelongsTo(() => Columns)
    declare column: Columns;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare shortDescription: string;

    @Column({
        type: DataType.TEXT,
    })
    declare longDescription: string; 

    @Column({
        type: DataType.DATEONLY
    })
    declare startDate: Date;

    @Column({
        type: DataType.DATEONLY
    })
    declare endDate: Date;

    @BelongsToMany(() => User, () => UserCards)
    declare users: User[];
}