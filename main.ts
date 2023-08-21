class Circle {
  x: number;
  y: number;
  vx: number = 0;
  vy: number = 0;
  mass: number;
  constructor(x: number, y: number, mass: number) {
    this.x = x;
    this.y = y;
    this.mass = mass;
  }
  setV(x: number, y: number): void {
    this.vx = x;
    this.vy = y;
  }
}

class WorldMap {
  canvas: any;
  ctx: any;
  fps: number;
  mapObjects: Circle[] = [];
  constructor(height: number, width: number, canvasID: string) {
    this.fps = 30;
    this.canvas = document.getElementById(canvasID);
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "black";
    this.ctx.fill();
  }
  addMapObeject(n: Circle): void {
    this.mapObjects.push(n);
  }

  draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let obj of this.mapObjects) {
      this.ctx.beginPath();
      this.ctx.arc(obj.x, obj.y, 5, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.fillText(obj.mass, obj.x + 10, obj.y);
    }
  }

  calcNewPos(): void {
    let newMapObjects: Circle[] = [];
    for (let c1 of this.mapObjects) {
      for (let c2 of this.mapObjects) {
        if (c1 == c2) continue;

        let dx: number = c2.x - c1.x;
        let dy: number = c2.y - c1.y;

        const r: number = Math.sqrt(dx * dx + dy * dy);
        const f = (1e-4 * c1.mass * c2.mass) / (r * r);

        if (c1.x > this.canvas.width || c1.x < 0) c1.vx = -(c1.vx * 0.001);
        c1.vx += dx * (f / c1.mass);
        c1.x += c1.vx;
        if (c1.y > this.canvas.height || c1.y < 0) c1.vy = -(c1.vy * 0.001);
        c1.vy += dy * (f / c1.mass);
        c1.y += c1.vy;
      }
    }
    this.updateInfo();
  }
  updateInfo(): void {
    const infoBox: any = document.getElementById("info");
    let res = ``;
    res += `<table>`;
    res += `<tr><th>Mass</th><th>Position</th><tr>`;
    for (let c of this.mapObjects) {
      res += `<tr><td>${c.mass}</td><td>(${Math.round(c.x)},${Math.round(
        c.y
      )})<td><tr> \n`;
    }
    res += `</table>`;
    infoBox.innerHTML = res;
  }
  start(): void {
    setInterval(() => {
      this.calcNewPos();
      this.draw();
    }, 1000 / this.fps);
  }
}

const t: WorldMap = new WorldMap(500, 500, "root");

t.addMapObeject(new Circle(250, 250, 150e3));

for (let i = 0; i < 10; i++) {
  const tmp = new Circle(
    Math.random() * 500,
    Math.random() * 500,
    Math.round(Math.random() * 1000 + 1)
  );
  tmp.setV(Math.random() * 2 - 1, Math.random() * 2 - 1);
  t.addMapObeject(tmp);
}

t.start();
