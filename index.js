// 一.原型链继承
// 原型链继承是大家最熟悉的继承，也是最基本的继承方式
// 原型链继承的主要目标就是为了复用父类的属性和方法
// 但同时也会有一些问题：
// 1.父类的引用属性会被所有子类共享，修改一个子类的引用属性，会影响其他子类
// 2.子类型实例不能给父类型构造函数传参，无法新增一些子类型实例独有的属性
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

// 二. 盗用构造函数继承（构造函数继承）
// 实现思路：每次调用 Child 都会初始化一个新的 child 实例，然后使用 call 或 apply 方法把 this 绑定到当前实例，每个实例都有自己的属性和方法
// 构造函数继承解决了子类向父类传递参数的问题，也不会出现父类引用属性修改后，影响全部子类的情况
// 但是也有其他问题：
// 子类不能访问父类原型上定义的方法（不能访问 Parent.prototype 上定义的方法），因此所有方法属性都写在构造函数中，每次创建实例都会初始化
function inherit2() {
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
    // 如果 Parent 有和 Child 的同名的属性，则 Child 定义的属性会覆盖 Parent 的属性
  }
  let child1 = new Child(18);
  console.log(child1.info); // {name: "hk",age: 18}
  console.log(child1.gender); // '男'

  let child2 = new Child(30);
  console.log(child2.info); // {name: "hk",age: 30}
  console.log(child2.gender); // '男'
}

// 三.组合继承

// 组合继承结合了原型链继承和盗用构造函数继承（构造函数继承）的优点。
// 基本思路就是使用原型链继承原型上的属性和方法，而使用构造函数继承的方法来继承实例的属性，这样既可以复用父类原型上的方法，又可以让每个实例都有自己的属性
// 这样就解决了原型链继承和构造函数继承存在的问题，已经很接近最优解了，但是又出现了一些问题：
// 1. Parent 构造函数会运行两次，多运行一次，就多一些性能开销，
// 2. 第二次调用的 Parent 还带来了一个副作用，就是属性在不同层级重复，我们希望 age 属性只存在于实例上，但实际上 Parent 上面也有了这个属性。
function inherit3() {
  function Parent(age) {
    this.age = age;
    this.colors = ["red", "blue", "yellow"];
  }
  Parent.prototype.sayAge = function () {
    console.log(this.age);
  };
  function Child(age, name) {
    // 第二次调用 Parent
    Parent.call(this, age);
    console.error(Parent);
    this.name = name;
  }
  // 第一次调用 Parent
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

// 四.原型式继承
//
// 原型式继承本质上和原型链继承是相同的，唯一的区别在于：原型式继承新增了 对参数对象的浅拷贝
// 每个子类实例指向的是不同的 Person 实例
// 也会存在和原型链类似的问题：
// 1. 父类的引用会被所有子类所共享，如果有一个子类修改了父类的引用类型，会影响所有的子类
// 2. 子类实例不能向父类传参

function inherit4() {
  // ES5 的 Object.create() 在只有第一个参数时，与这里的 shallowCopy() 效果相同
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

// 五.寄生式继承
// 寄生式继承对目标对象进行浅拷贝，同时可以扩展新的方法
// 但修改父类的引用类型依然会影响所有的子类
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
// 寄生式组合继承是现在继承方式的最优解，解决了上面所有继承方式的问题
// 1. 只调用一次父类构造函数
// 2. Child 可以向 Parent 传参
// 3. 父类的方法可以复用
// 4. 父类的引用属性不会被共享

function inherit6() {
  // 组合继承
  function shallowCopy(obj) {
    // 构造一个 Parent 构造函数，生成一个 parent 实例
    function Person() {}
    Person.prototype = obj;
    return new Person();
  }

  function inheritPrototype(child, parent) {
    let prototype = shallowCopy(parent.prototype);
    // 把 Parent 放到 Child 的原型链上
    prototype.constructor = child;
    Child.prototype = prototype;
  }

  function Parent(name) {
    this.name = name;
    this.friends = ["ls", "gtx", "mgdz"];
  }

  Parent.prototype.getName = function () {
    console.log(this.name);
  };
  // 寄生式继承
  function Child(name, age) {
    Parent.call(this, name);
    this.age = age;
  }
  inheritPrototype(Child, Parent);
  Child.prototype.getAge = function () {
    console.log(this.age);
  };

  let child1 = new Child("hk", 35);
  child1.getAge(); // 35
  child1.getName(); // 'hk'
  child1.friends.push("mb");
  console.log(child1.friends); // ["ls", "gtx", "mgdz", "mb"]

  let child2 = new Child("ly", 40);
  child2.getAge(); // 40
  child2.getName(); // ly
  console.log(child2.friends); // ["ls", "gtx", "mgdz"]

  console.log(child1);
  console.log(child2);
}

// inherit1(); // 原型链继承
// inherit2(); //构造函数继承
// inherit2_1(); //盗用构造函数继承
// inherit3(); // 组合继承
inherit4(); // 原型式继承
// inherit5(); // 寄生式继承
// inherit6(); // 寄生式原生继承
