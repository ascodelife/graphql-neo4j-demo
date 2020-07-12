# graphql-neo4j-demo

基于[neo4j-graphql-js](https://github.com/neo4j-graphql/neo4j-graphql-js)库写的一个操作概念格的demo（注意本例不包含格算法）。

## 下载与使用

1. 直接clone本项目

    ```
    git clone https://github.com/ascodelife/graphql-neo4j-demo.git
    ```

2. 安装依赖
    ```
    npm install
    ```
    或
    ```
    yarn
    ```
3. 运行由[apollo-server](https://github.com/apollographql/apollo-server)提供的graphql服务

    ```
    npm run start
    ```

    另外，本项目需要自行启动neo4j-desktop或创建neo4j sandbox [详情请访问neo4j官网](https://neo4j.com)，访问数据库认证信息请在根目录下```.env```文件中自行修改。

## 使用体验

[neo4j-graphql-js](https://github.com/neo4j-graphql/neo4j-graphql-js)比起更泛化的[express-graphql](https://github.com/graphql/express-graphql)来说，封装了一些常用的cypher语句，并提供了一些语法糖。但总体体验上来说，感觉其实意义不算很大，不仅应付不了复杂的cypher查询，甚至连一些简单的查询都处理的不是很完善，不如直接用[express-graphql](https://github.com/graphql/express-graphql)配合resolve编写cypher语句进行查询。这也与我预期出入较大——虽然确实可以用schema替换原有建模，但是依然需要自己编写cypher语句。

概念格节点本身的属性比较少，目前我只定义了5个字段，其中id、extents、intents为必选字段，isSup、isInf为可选字段，且其关系也只有一种（偏序关系）。所以其实也没有很大程度的体现出graphql的灵活性，graphql更适合于节点类型多属性多、关系复杂的图结构。

更一般的graphql全栈应用请参考[另一个项目](https://github.com/ascodelife/react-graphql-express-mongoDB)。

## 例子

运行后访问地址http://localhost:3003/ 对graphql语句进行测试。

![image-20200710232629932](https://github.com/ascodelife/graphql-neo4j-demo/raw/master/img/image-20200710232629932.png)

### 1. 创建第一个概念格节点，指定其id、extents、intents属性，并返回节点id。

   ```javascript
mutation {
	CreateConceptNode(id:1,extents:["e1","e2"],intents:["i1","i2"]){    
      id                                             
  }
}
   ```

执行结果

   ```javascript
{
  "data": {
    "CreateConceptNode": {
      "id": "1"
    }
  }
}
   ```

   ![image-20200711180711418](https://github.com/ascodelife/graphql-neo4j-demo/blob/master/img/image-20200711180711418.png)

### 2. 创建第二个概念格节点，指定其extents、intents属性，并返回节点的id、extents与intents属性，注意当不指定创建节点id时，会自动生成一个UUID作为id存储。[详情见文档说明](https://grandstack.io/docs/graphql-schema-generation-augmentation#create)
   ```javascript
mutation {
	CreateConceptNode(extents:["e3","e4"],intents:["i3","i4"]){    
    id
    intents
    extents                                               
  }
}
   ```

   执行结果

   ```javascript
{
  "data": {
    "CreateConceptNode": {
      "id": "01932936-93ab-446d-8290-1557c3759bfb",
      "intents": [
        "i3",
        "i4"
      ],
      "extents": [
        "e3",
        "e4"
      ]
    }
  }
}
   ```

   ![image-20200711183113361](https://github.com/ascodelife/graphql-neo4j-demo/blob/master/img/image-20200711183113361.png)

### 3. 在两个节点之间创建一个CHILD类型的关系，并返回第二个节点id。

```javascript
mutation {
	AddChild(fromID:1,toID:"01932936-93ab-446d-8290-1557c3759bfb"){
      id
  }
}
```

   执行结果

   ```javascript
{
  "data": {
    "AddChild": {
      "id": "01932936-93ab-446d-8290-1557c3759bfb"
    }
  }
}
   ```

   ![image-20200711212309673](https://github.com/ascodelife/graphql-neo4j-demo/blob/master/img/image-20200711212309673.png)

### 4. 根据节点id查询节点extents、intents属性，以及孩子、父亲节点id

   ```javascript
{
  ConceptNode(id:1){
    extents
    intents
    children{
      id
    }
    parents{
      id
    }
  }
}
   ```

   执行结果

   ```javascript
{
  "data": {
    "ConceptNode": [
      {
        "extents": [
          "e1",
          "e2"
        ],
        "intents": [
          "i1",
          "i2"
        ],
        "children": [
          {
            "id": "01932936-93ab-446d-8290-1557c3759bfb"
          }
        ],
        "parents": []
      }
    ]
  }
}
   ```

### 5. 更新第一个（id为1）节点的extents属性，并返回修改后节点的extents属性

   ```javascript
mutation{
  MergeConceptNode(id:1,extents:["e11","e22"]){
    extents
  }
}
   ```

执行结果

   ```javascript
{
  "data": {
    "MergeConceptNode": {
      "extents": [
        "e11",
        "e22"
      ]
    }
  }
}
   ```

   ![image-20200712163027952](https://github.com/ascodelife/graphql-neo4j-demo/blob/master/img/image-20200712163027952.png)

### 6. 指定第一个（id为1）节点为sup节点，并返回修改后节点的isSup属性

   ```javascript
mutation{
  MergeConceptNode(id:1,isSup:true){
    isSup
  }
}
   ```

   执行结果

   ```javascript
{
  "data": {
    "MergeConceptNode": {
      "isSup": true
    }
  }
}
   ```

![image-20200712163117338](https://github.com/ascodelife/graphql-neo4j-demo/blob/master/img/image-20200712163117338.png)

### 7. 指定第二个（id为01932936-93ab-446d-8290-1557c3759bfb）节点为inf节点，并返回修改后节点的isInf属性

   ```javascript
mutation{
  MergeConceptNode(id:"01932936-93ab-446d-8290-1557c3759bfb",isInf:true){
    isInf
  }
}
   ```

   执行结果

   ```javascript
{
  "data": {
    "MergeConceptNode": {
      "isInf": true
    }
  }
}
   ```

![image-20200712163539124](https://github.com/ascodelife/graphql-neo4j-demo/blob/master/img/image-20200712163539124.png)


### 8. 删除两个节点间的CHILD类型的关系

   ```javascript
mutation {
	RemoveChild(fromID:1,toID:"01932936-93ab-446d-8290-1557c3759bfb"){
  	  id
  }
}
}
   ```

   执行结果

   ```javascript
{
  "data": {
    "RemoveChild": null
  }
}
   ```

![image-20200712182811882](https://github.com/ascodelife/graphql-neo4j-demo/blob/master/img/image-20200712182811882.png)

### 9. 删除第一个节点，并返回删除节点的id

   ```javascript
mutation {
  DeleteConceptNode(id:1){
    id
  }
}
   ```

   执行结果

   ```javascript
{
  "data": {
    "DeleteConceptNode": {
      "id": "1"
    }
  }
}
   ```

![image-20200712190531395](https://github.com/ascodelife/graphql-neo4j-demo/blob/master/img/image-20200712190531395.png)