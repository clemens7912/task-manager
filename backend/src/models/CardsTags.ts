import { Table, Model, Column, DataType, ForeignKey} from 'sequelize-typescript';
import { Cards } from './Cards';
import { Tags } from './Tags';

@Table({
    timestamps: true,
    tableName: 'cards_tags'
})
export class CardsTags extends Model {

    @ForeignKey(() => Cards)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare cardId: number;

    @ForeignKey(() => Tags)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare tagId: number;

}