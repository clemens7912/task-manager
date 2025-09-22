import { Table, Model, Column, DataType, ForeignKey} from 'sequelize-typescript';
import { Cards } from './Cards';
import { User } from './User';

@Table({
    timestamps: true,
    tableName: 'user_cards'
})
export class UserCards extends Model {

    @ForeignKey(() => Cards)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare cardId: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare userId: number;

}