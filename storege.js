import fs from 'fs';

export default class storege {
    async collection(name){
        this.name = name;
        this.filters = [];

        if (!fs.existsSync("database")) {
            fs.mkdirSync("database");
        }
        if (!fs.existsSync(`database/${name}.json`)) {
            fs.writeFileSync(`database/${name}.json` , JSON.stringify([] , null ,2));
        } 
        this.data = JSON.parse(fs.readFileSync(`database/${name}.json`, "utf-8"))
    }
    async insert(data){
            const file = `database/${this.name}.json`;
            if (!fs.existsSync("database")) {
                fs.mkdirSync("database");
            } 
            this.data.push(data);
            fs.writeFileSync(file , JSON.stringify(this.data , null ,2));
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
    update (data){
        const file = `database/${this.name}.json`;
        this.data = this.data.map(item =>{
           let match = this.filters.every(filter => {
                if (filter.operator === "=") 
                    return item[filter.field] === filter.value;
                
                if (filter.operator === ">") 
                    return item[filter.field] > filter.value;
                
                if (filter.operator === "<") 
                    return item[filter.field] < filter.value;
                
                return false;
            }); 

            if (match) {
                return {
                    ...item,
                    ...data
                }
            }
            return item;
        });
        fs.writeFileSync(file , JSON.stringify(this.data , null ,2));
        return this;
    }

}