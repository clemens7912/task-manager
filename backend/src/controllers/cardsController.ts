import { Columns } from './../models/Columns';
import { UserCards } from './../models/UserCards';
import { User } from './../models/User';
import { Tags } from './../models/Tags';
import { CardsTags } from './../models/CardsTags';
import { Cards } from './../models/Cards';
import { Request, Response } from 'express';
import { Op, WhereOptions } from 'sequelize';
import { parseFilters, Where } from './../shared/utils';

const normalizeDate = (date: string): string | null => {
    return date === '' ? null : date ;
}

export const getCards = async (req: Request, res: Response) => {
    const {columnId, page = 1, limit = 5, filters = null} = req.query;
    const filtersClauses = filters ? JSON.parse(String(filters)) : null;
    console.log(filtersClauses);

    if(!columnId){
        res.status(404).json({message: 'Parameter columnId required'});
        return; 
    }

    let whereClauses: Where = {};
    if(filtersClauses){
        whereClauses = parseFilters(filtersClauses);
    }

    const include: any[] = [];
    if (Object.keys(whereClauses['cards.tags'] || {}).length > 0) {
        include.push({
            model: Tags,
            required: true,
            where: whereClauses['cards.tags'],
            attributes: [],
            through: { attributes: [] }
        });
    }

    if (Object.keys(whereClauses['cards.users'] || {}).length > 0) {
        include.push({
            model: User,
            required: true,
            where: whereClauses['cards.users'],
            attributes: [],
            through: { attributes: [] }
        });
    }


    const options: {[key: string]: any} = {
        where: {
            columnId,
            ...(whereClauses['outer'] || {}),
        },
        include: include,
        offset: (+page - 1) * +limit,
        limit: +limit
    };

    try{
        const filteredCardsIds = await Cards.findAll({
            attributes: ['id'],
            ...options,
            
        });

        const cards = await Cards.findAll({
            where:{
                id: filteredCardsIds.map(r => r.id)
            },
            include: [
                {
                    model: Tags, 
                    required: false
                },
                {
                    model: User,
                    required: false
                }
            ]
        });

        const total = await Cards.count({
            where: options.where,
            include: options.include,
            distinct: true
        });

        res.status(200).json({data: cards, total});
    }catch(error: unknown){
        if(error instanceof Error){
            console.log(error.stack);
            res.status(500).json({
                'message': error.message
            });
        }else{
            console.log(error);
            res.status(500).json({
                'message':'Error en servidor'
            });
        }
    }
}


export const createCard = async (req: Request, res: Response) => {
    try{
        const {column, shortDescription, longDescription} = (req.body as Cards);
        const startDate = normalizeDate(req.body.startDate);
        const endDate = normalizeDate(req.body.endDate);

        //create card
        const card = await Cards.create({columnId: column.id, shortDescription, longDescription, startDate, endDate});

        //set tags of card
        const tags = req.body.tags as Tags[];
        const tagsId = tags.map(tag => tag.id);
        card.$set('tags', tagsId);
        card.setDataValue('tags', tags);
        

        //create rows in card with users junction table
        const users = req.body.users as User[];
        const usersId = users.map(user => user.id);
        card.$set('users', usersId);
        card.setDataValue('users', users);

        res.status(201).json(card);
    } catch(error: unknown){
        if(error instanceof Error){
            console.log(error.stack);
            res.status(500).json({
                'message': error.message
            });
        }else{
            console.log(error);
            res.status(500).json({
                'message':'Error en servidor'
            });
        }
    }
}
export const updateCard = async (req: Request, res: Response) => {
    const id = req.params.id;
    try{
        const {column, shortDescription, longDescription} = (req.body as Cards);
        const startDate = normalizeDate(req.body.startDate);
        const endDate = normalizeDate(req.body.endDate);

        //update card
        const card = await Cards.findByPk(id);
        if(!card){
            res.status(404).json({message: 'Card not found'});
            return;
        }

        await card.update({columnId: column.id, shortDescription, longDescription, startDate, endDate})

        //set tags of card
        const tags = req.body.tags as Tags[];
        const tagsId = tags.map(tag => tag.id);
        card.$set('tags', tagsId);
        card.setDataValue('tags', tags);
        

        //create rows in card with users junction table
        const users = req.body.users as User[];
        const usersId = users.map(user => user.id);
        card.$set('users', usersId);
        card.setDataValue('users', users);

        //set column
        card.setDataValue('column', column);

        res.status(200).json(card);
    } catch(error: unknown){
        if(error instanceof Error){
            console.log(error.stack);
            res.status(500).json({
                'message': error.message
            });
        }else{
            console.log(error);
            res.status(500).json({
                'message':'Error en servidor'
            });
        }
    }
}

export const updateCardColumn = async (req: Request, res: Response) => {
    const id = req.params.id;
    const columnId = req.body.columnId;

    try{
        const card = await Cards.findByPk(id);
        if(!card){
            res.status(404).json({message: 'Card not found'});
            return;
        }

        await card.update({columnId});
        
        res.status(200).json(card);
    } catch(error: unknown){
        if(error instanceof Error){
            console.log(error.stack);
            res.status(500).json({
                'message': error.message
            });
        }else{
            console.log(error);
            res.status(500).json({
                'message':'Error en servidor'
            });
        }
    }
}

export const deleteCard = async (req: Request, res: Response) => {
    const id = req.params.id;
    try{
        await Cards.destroy({
            where: {id}
        });

        res.status(204).send();
    } catch(error: unknown){
        if(error instanceof Error){
            console.log(error.stack);
            res.status(500).json({
                'message': error.message
            });
        }else{
            console.log(error);
            res.status(500).json({
                'message':'Error en servidor'
            });
        }
    }
}