let shapeA = [];
let x = 0
for (let i = 0; i < 10; i++) {
    let length = Math.floor(Math.random() * 100)

  shapeA.push(
    [
      [40 + x, 50],
      [60 + x + length, 50],
      [60 + x + length, 100],
      [40 + x, 100],
    ],
  );
  x+= length
}

const shapeB = [
  [
    [110, 20],
    [110, 110],
    [20, 20],
  ],
  [
    [130, 170],
    [130, 20],
    [260, 20],
    [260, 170],
  ],
];
// const result = PolyBool.union(
//   {
//     regions: shapeA,
//     inverted: false,
//   },
//   {
//     regions: shapeB,
//     inverted: false,
//   }
// ).regions;

// import * as martinez from 'martinez-polygon-clipping';
// https://cdn.rawgit.com/w8r/martinez/master/dist/martinez.umd.js

// const result = shapeA.reduce((a,b)=>{
//     return greinerHormann.union(a, b)    
//     // return dPolygonBoolean(a, b, "union")
// })

// const result = polygonClipping.union(shapeA)

const result = polygonClipping.union(shapeA)

// console.log(result)

// const result = dPolygonBoolean(shapeA, shapeB, "union")

const el = document.querySelector("canvas");
const ctx = el.getContext("2d");

// ctx.moveTo(result[0][0], result[0][1])

function drawRegion(result, fill) {
  for (const region of result) {
    ctx.beginPath();
    ctx.moveTo(region[0][0], region[0][1]);
    for (const p of region) {
      ctx.lineTo(p[0], p[1]);
    }
    ctx.closePath();
    if(fill){
        ctx.fill()

    }else{
        ctx.stroke();

    }
  }
}

// ctx.fillStyle = "yellow"

ctx.strokeStyle = "red";
drawRegion(shapeA);
ctx.strokeStyle = "blue";
drawRegion(shapeB);

// ctx.strokeStyle = "black";
for(r of result){
    drawRegion(r);
    ctx.fill()
}
