class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get_angle_to(p) {
        return Math.atan2(p.y - this.y, p.x - this.x);
    }

    get_angle_between(p0, p1) {
		const theta1 = this.get_angle_to(p0);
		const theta2 = this.get_angle_to(p1);
		return theta2 - theta1;
    }

    dot_product(p) {
        return this.x * v.x + this.y * v.y;
    }

    get_distance(v) {
        return Math.sqrt(Math.pow(v.x - this.x, 2) + Math.pow(v.y - this.y, 2));
    }

    add_to(p) {
        this.x += p.x;
        this.y += p.y;
    }

    set_zero() {
        this.x = this.y = 0;
    }

    static mag(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }
}

class Circle extends Point {
    constructor(x, y, radius) {
        super(x, y);
        this.radius = radius;
    }

    contains(p) {
        return this.get_distance(p) <= this.radius;
    }
}

class Line {
    constructor(start_x, start_y, end_x, end_y) {
        this.start_x = start_x;
        this.start_y = start_y;
        this.end_x = end_x;
        this.end_y = end_y;
        this.start_point = new Point(start_x, start_y);
        this.end_point = new Point(end_x, end_y);
    }

    get_length() {
        return this.start_point.get_distance(this.end_point);
    }

    project(p) {
        const theta = this.start_point.get_angle_between(this.end_point, p);
        const angle = this.start_point.get_angle_to(this.end_point);
        const length = Math.abs(this.start_point.get_distance(p) * Math.cos(theta));
		const x = this.start_point.x + Math.cos(angle) * length;
		const y = this.start_point.y + Math.sin(angle) * length;
        return {
            length: Math.abs(this.start_point.get_distance(p) * Math.cos(theta)),
            point: new Point(x, y)
        };
	}

    reverse() {
        return new Line(this.end_x, this.end_y, this.start_x, this.start_y);
    }
}

function line_intersects_with_circle(line, circle) {
    const proj0 = line.project(circle);
    const proj1 = line.reverse().project(circle);
    if (proj0.length > line.get_length() || proj1.length > line.get_length()) {
        if (circle.contains(line.start_point)) {
            return line.start_point;
        } else if (circle.contains(line.end_point)) {
            return line.end_point;
        }
        return null;
    }

    const theta = line.start_point.get_angle_between(circle, line.end_point);
    const dist = line.start_point.get_distance(circle);
    const length = dist * Math.cos(theta);
    return Math.sqrt(dist * dist - length * length) <= circle.radius ? proj0.point : null;
}

window.onload = function () {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let debug_mode = false;
    const lines = [];
    const circle = new Circle(0, 0, 20);
    const circle_vec = new Point(0, 0);

    for (let i = 0; i < 15; i++) {
        const start_x = Math.random() * canvas.width,
              start_y = Math.random() * canvas.height,
              end_x = Math.random() * canvas.width,
              end_y = Math.random() * canvas.height;
        lines.push(new Line(start_x, start_y, end_x, end_y));
    }

    update();

    window.onmousedown = function (e) {
        const down = new Point(e.clientX, e.clientY);
        const angle = circle.get_angle_to(down);
        circle_vec.x = Math.cos(angle) * 2;
        circle_vec.y = Math.sin(angle) * 2;
    };

    window.onkeydown = function (e) {
        debug_mode = !debug_mode;
    }

    function update() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        circle.add_to(circle_vec);
        for (const line of lines) {
            context.beginPath();
            context.moveTo(line.start_point.x, line.start_point.y);
            context.lineTo(line.end_point.x, line.end_point.y);
            context.strokeStyle = 'black';
            context.stroke();
            if ((intersection = line_intersects_with_circle(line, circle)) != null) {
                if (debug_mode) {
                    context.beginPath();
                    context.strokeStyle = 'orange';
                    context.moveTo(circle.x, circle.y);
                    context.lineTo(intersection.x, intersection.y);
                    context.stroke();
                }
                const dist = circle.radius - circle.get_distance(intersection);
                const angle = intersection.get_angle_to(circle);
                circle.x += Math.cos(angle) * dist;
                circle.y += Math.sin(angle) * dist;
            }
            if (debug_mode) {
                context.strokeStyle = 'green';
                context.beginPath();
                context.moveTo(line.start_x, line.start_y);
                context.lineTo(circle.x, circle.y);
                context.stroke();
                
                context.beginPath();
                context.moveTo(line.end_x, line.end_y);
                context.lineTo(circle.x, circle.y);
                context.stroke();
            }
        }
        context.strokeStyle = 'black';
        context.beginPath();
        context.moveTo(circle.x, circle.y);
        context.lineTo(circle.x + circle_vec.x * circle.radius * 0.5, circle.y + circle_vec.y * circle.radius * 0.5);
        context.stroke();
        context.beginPath();
        context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        context.stroke();
        requestAnimationFrame(update);
    }

    function get_angle(p1, p2) {
        
    }
};