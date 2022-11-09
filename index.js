// 一.原型链继承
function inherit1() {
  function Parent() {
    this.child_type = "1.0";
    this.info = {
      name: "hk",
      age: 30,
    };
  }

  Parent.prototype.getInfo = function () {
    console.log(this.child_type);
    console.log(this.info);
  };

  function Child() {}

  Child.prototype = new Parent();

  let child1 = new Child();
  child1.info.gender = "男";
  child1.getInfo(); // {name: "hk",age: 30, gender: '男'}

  let child2 = new Child();
  child2.getInfo(); // {name: "hk",age: 30, gender: '男'}

  console.log(child2.child_type);
}

// 优点：父类方法可以复用
// 缺点：
// 1.父类所有引用属性会被所有子类共享，更改一个子类的引用属性，其他子类也会受影响
// 2.子类型实例不能给父类型构造函数传参

// 二. 盗用构造函数继承（构造函数继承）
function inherit2() {
  function Parent() {
    this.info = {
      name: "hk",
      age: 30,
    };
  }

  function Child() {
    Parent.call(this);
  }

  let child1 = new Child();
  child1.info.gender = "男";
  console.log(child1.info); // {name: "hk",age: 30, gender: '男'}

  let child2 = new Child();
  console.log(child2.info); // {name: "hk",age: 30}
}

// 每次调用 Child 都会初始化一个新的 child 实例，然后使用 call 或 apply 方法把 this 绑定到当前实例，每个实例都有自己的 info 属性

// 解决传递参数的问题
// 可以在子类构造函数中向父类构造函数中传递参数
function inherit2_1() {
  function Parent(age) {
    this.info = {
      name: "hk",
      age: age,
    };
  }

  function Child(age) {
    Parent.call(this, age);
    // 实例属性
    this.gender = "男";
  }
  let child1 = new Child(18);
  console.log(child1.info); // {name: "hk",age: 18}
  console.log(child1.gender); // '男'

  let child2 = new Child(30);
  console.log(child2.info); // {name: "hk",age: 30}
  console.log(child2.gender); // '男'
}

// 为确保 Parent 构造函数不会覆盖 Child 定义的属性，可以在调用父类构造函数之后再给Child实例添加属性

// 优点：
// 1. 可以再子类构造函数中向父类传递参数
// 2. 父类的引用属性不会被共享
// 缺点：
// 子类不能访问父类原型上定义的方法（不能访问 Parent.prototype 上定义的方法），因此所有方法属性都写在构造函数中，每次创建实例都会初始化

// 三.组合继承

// 组合继承结合了原型链继承和盗用构造函数继承（构造函数继承）的优点。
// 基本思路就是使用原型链继承原型上的属性和方法，而使用构造函数继承的方法来继承实例的属性，这样既可以复用父类原型上的方法，又可以让每个实例都有自己的属性

function inherit3() {
  function Parent(age) {
    this.age = age;
    this.colors = ["red", "blue", "yellow"];
  }
  Parent.prototype.sayAge = function () {
    console.log(this.age);
  };
  function Child(age, name) {
    Parent.call(this, age);
    this.name = name;
  }
  Child.prototype = new Parent();
  Child.prototype.sayName = function () {
    console.log(this.name);
  };
  let child1 = new Child(20, "hk");
  child1.colors.push("pink");
  console.log(child1.colors); // ["red", "blue", "yellow", "pink"]
  child1.sayName(); // hk
  child1.sayAge(); // 20

  let child2 = new Child(28, "ls");
  console.log(child2.colors); // ["red", "blue", "yellow"]
  child2.sayName(); // "ls"
  child2.sayAge(); // 28
}
// 优点：
// 1. 父类的方法可以复用
// 2. 可以在Child构造函数中向Parent构造函数中传参
// 3. 父类构造函数中的引用属性不会被共享

// 四.原型式继承

// 对参数对象的一种浅复制
function inherit4() {
  function shallowCopy(obj) {
    function Person() {}
    Person.prototype = obj;
    return new Person();
  }
  let person = {
    name: "hk",
    age: 20,
    friends: ["ls", "gtx", "mgdz"],
    sayAge() {
      console.log(this.age);
    },
  };
  let person1 = shallowCopy(person);
  person1.age = 100;
  person1.friends.push("hs");
  person1.sayAge(); // 100

  let person2 = shallowCopy(person);
  person2.age = 80;
  person2.friends.push("xy");
  person2.sayAge(); // 80

  console.log(person.friends); // [ 'ls', 'gtx', 'mgdz', 'hs', 'xy' ]
}
// 优点：父类方法可以复用
// 缺点：
// 1. 父类的引用会被所有子类所共享
// 2. 子类实例不能向父类传参

// ES5 的 Object.create() 在只有第一个参数时，与这里的 shallowCopy() 效果相同

// 五.寄生式继承

function inherit5() {
  function shallowCopy(obj) {
    function Person() {}
    Person.prototype = obj;
    return new Person();
  }

  function createAnother(original) {
    let clone = shallowCopy(original);
    clone.getAge = function () {
      console.log(this.age);
    };
    return clone;
  }

  let person = {
    name: "hk",
    age: 45,
    friends: ["ls", "gtx", "mgdz"],
  };

  let person1 = createAnother(person);
  person1.friends.push("qybs");
  console.error(person1.friends); // [ 'ls', 'gtx', 'mgdz', 'qybs' ]
  person1.getAge(); //45

  let person2 = createAnother(person);
  console.log(person2.friends); // [ 'ls', 'gtx', 'mgdz', 'qybs' ]
}

// 六.寄生式组合继承

function inherit6(obj) {
  function shallowCopy(obj) {
    function Person() {}
    Person.prototype = obj;
    return new Person();
  }

  function inheritPrototype(child, parent) {}
}

// inherit1(); // 原型链继承
// inherit2(); //构造函数继承
// inherit2_1(); //盗用构造函数继承
// inherit3(); // 组合继承
// inherit4(); // 原型式继承
inherit5(); // 寄生式继承
