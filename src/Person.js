class Person {
    //表示建構函式
    constructor(name='Noname',age = 18){
        //instance,實體，實例
        this.name = name;
        this.age = age;
    }

    toString(){
        //
        const {name,age} = this;
        return JSON.stringify({name,age})
    }

    toJSON(){
        return{
            name:this.name,
            age:this.age,
            from:'toJSON'
        };
    }

}

module.exports = Person;

// const p1 = new Person();
// const p1 = new Person('Flora',27);

// console.log(p1);//Person { name: undefined, age: undefined }
// console.log('' + p1);//{}
// console.log(p2);
// console.log('' + p2);
// console.log(toJSON.stringify(p2));
