let canv, ctx;
let degree;
let pts = [[10, 10, 0.1], [100, 100, 0.4], [50, 80, 1], [200, 150, 1], [100, 200, 0.8], [300, 100, 1], [500, 150, 0]];
let pressed = false

window.addEventListener("load", () => {
    canv = document.getElementById("canvas1");
    ctx = canv.getContext("2d");
    canv.addEventListener("pointermove", (ev) => {
        if (pressed) {
            putpoint(ev)
        }
    }
        , false);
    canv.addEventListener("pointerdown", (ev) => {
        pressed = true
    }, false);
    canv.addEventListener("pointerup", (ev) => {
        pressed = false
    }, false)
    redraw();
}, true);

function drawSpline() {
    ctx.clearRect(0, 0, canv.width, canv.height);
    if (pts.length == 0) {
        return;
    }
    for (let i = 0; i < pts.length; i++) {
        ctx.fillStyle = "rgba(0,255,0,1)";
        ctx.beginPath();
        ctx.arc(pts[i][0], pts[i][1], 5, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
    }
    const spline = new BSpline(pts, degree, true);
    let oldx, oldy, oldp, x, y, p, oldd;
    oldx = spline.calcAt(0)[0];
    oldy = spline.calcAt(0)[1];
    oldp = spline.calcAt(0)[2];
    oldd = 0;

    const leftPoints = []
    const rightPoints = []

    for (let t = 0; t <= 1; t += 0.001) {
        const interpol = spline.calcAt(t);
        x = interpol[0];
        y = interpol[1];
        p = interpol[2] * 20;
        // ctx.lineTo(x, y);

        // 点の間引き…実装してみたが、なにか線の描き味が悪化する気がする
        if(Math.pow( x-oldx, 2 ) + Math.pow( y-oldy, 2 ) < 32){
            continue
        }

        const deg = Math.atan2(y - oldy, x - oldx)
        const normal = 3.14 / 2

        rightPoints.push([x + Math.cos(deg + normal) * p, y + Math.sin(deg + normal) * p])
        leftPoints.push([x + Math.cos(deg - normal) * p, y + Math.sin(deg - normal) * p])
        // ctx.lineTo(oldx + Math.cos(oldd + normal) * oldp, oldy + Math.sin(oldd + normal) * oldp)
        // ctx.lineTo(x + Math.cos(deg + normal) * p, y + Math.sin(deg + normal) * p)
        // ctx.lineTo(x + Math.cos(deg - normal) * p, y + Math.sin(deg - normal) * p)
        // ctx.lineTo(oldx + Math.cos(oldd - normal) * oldp, oldy + Math.sin(oldd - normal) * oldp)
        // ctx.closePath();

        // ctx.arc(x, y, interpol[2] * 10 , 0, Math.PI * 2, false);
        oldx = x;
        oldy = y;
        oldd = deg;
        oldp = p;
    }
    ctx.beginPath();
    ctx.moveTo(oldx, oldy);

    // for(let i = leftPoints.length - 1; i >= 0; i--){
    //     console.log(i)

    //     ctx.fillStyle = "rgba(0,255,0,1)";
    //     ctx.beginPath();
    //     ctx.arc(leftPoints[i][0], leftPoints[i][1], 5, 0, Math.PI * 2, false);
    //     ctx.fill();
    //     ctx.closePath();
    // }
    // for(let i = 0; i < rightPoints.length; i++){
    //     ctx.fillStyle = "rgba(0,255,0,1)";
    //     ctx.beginPath();
    //     ctx.arc(rightPoints[i][0], rightPoints[i][1], 5, 0, Math.PI * 2, false);
    //     ctx.fill();
    //     ctx.closePath();
    // }

    for(let i = leftPoints.length - 1; i >= 0; i--){
        ctx.lineTo(leftPoints[i][0] , leftPoints[i][1])
    }
    for(let i = 0; i < rightPoints.length; i++){
        ctx.lineTo(rightPoints[i][0] , rightPoints[i][1])
    }

    //なんか先が割れちゃうけどなぜ？
    ctx.arc(x, y, p , oldd + Math.PI / 2, oldd - Math.PI / 2, true);
    ctx.closePath();
    ctx.stroke();
    ctx.fill()
}

function putpoint(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    pts.push([x, y, e.pressure]);
    drawSpline();
}

function redraw() {
    const degMenu = document.fm.degree;
    degree = Number(degMenu.options[degMenu.selectedIndex].value);
    drawSpline();
}

function ptsClear() {
    pts = [];
    drawSpline();
}