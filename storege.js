import fs from 'fs';

export default class storege {
    async collection(name){
        this.name = name;
        this.filters = [];
        this.data = JSON.parse(fs.readFileSync(`database/${name}.json`, "utf-8"))
    }
    async insert(data){
            const file = `database/${this.name}.json`;
            if (!fs.existsSync("database")) {
                fs.mkdirSync("database");
            }
            let newData = [];
            newData.push(data);
            fs.writeFileSync(file , JSON.stringify(newData , null ,2));
            return true;
        }
    where (field , operator , value){
        this.filters.push({
            field,
            operator,
            value
        });
        return this;
    }
    get (){
        let result = this.data;
        for (const filter of this.filters) {
            result = result.filter(item => {
                if (filter.operator === "=") {
                    return item[filter.field] === filter.value;
                }
                if (filter.operator === ">") {
                    return item[filter.field] > filter.value;
                }
                if (filter.operator === "<") {
                    return item[filter.field] < filter.value;
                }
                if (filter.operator === "!=") {
                    return item[filter.field] !== filter.value;
                }
                return false;
            });
        }
        return result;
    }
    delete (){
        const file = `database/${this.name}.json`;
        this.data = this.data.filter(item => {
            return !this.filters.every(filter => {
                if (filter.operator === "=") 
                    return item[filter.field] === filter.value;
                
                if (filter.operator === ">") 
                    return item[filter.field] > filter.value;
                
                if (filter.operator === "<") 
                    return item[filter.field] < filter.value;
                
                return false;
            }); 
        });
        fs.writeFileSync(file , JSON.stringify(this.data , null ,2));
        return true;
    }

}