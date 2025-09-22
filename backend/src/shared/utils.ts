import { Op } from "sequelize"

const operators = {
    'eq': Op.eq,
    'in': Op.in,
    'between': Op.between
}

interface Filter {
    operator: string, 
    value: string | number | number[]
};

type Filters = {
    [key: string]: Filter
};

//the first level key is for chosing between outer where
//or include where
export type Where = {
    [key: string]: {
        [key: string]: any
    }
}

export const parseFilters = (filters: Filters): Where => {
    const where: Where = {};
    Object.entries(filters).forEach(([key, filter]) => {
        const parts = key.split('_');
        if(parts.length == 1){
            if(!('outer' in where)){
                where['outer'] = {};
            }
            where['outer'][parts[0]] = {
                [operators[filter.operator as keyof typeof operators]]: filter.value
            }
        }else{
            //remove and store the column name
            const column = parts.pop()!;
            //join the other parts as they make all the relation path
            const path = parts.join('.');
            if(!(path in where)){
                where[path] = {};
            }

            where[path][column] = {
                [operators[filter.operator as keyof typeof operators]]: filter.value
            }

        }
    }); 

    return where;
}