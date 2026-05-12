const chosenScreenX = 1080;
const chosenScreenY = 1920;

class Level1 extends Phaser.Scene {
    constructor() {
        super('lvl1');
    }
    create () {
        var camera = this.cameras.main;
        // world bounds
        this.matter.world.setBounds();

        // background
        this.bg = this.add.image(chosenScreenX/2, chosenScreenY/2 - 250, 'bg')
        .setScale(0.32)
        .setTint(0xd0d0f0)
        .setAlpha(0.5);

        // floor / control zone
        this.floor = this.add.rectangle(1080/2, 1920*7/8, 1080, 500, 0x404040, 1).setInteractive();
        let rect = this.matter.add.rectangle(1080/2, 1920*7/8, 1080, 500, {isStatic: true});

        // variables
        let stiff_val = 0.9;
        let loose_val = 0.005;
        let radius = {'joint0': 100, 'joint1': 60, 'hand': 50};
        let length = {'bone0': 300, 'bone1': 250};
        let width = {'bone0': 75, 'bone1': 75};
        let slop_val = 3;
        
        // segment0
        this.bone0 = this.matter.add.image(0, 400/2, 'bone0')
            .setScale(0.9)
            .setTint(0xf0f0ff)
            .setRectangle(width['bone0'], length['bone0'], {slop: slop_val, ignoreGravity: true, collisionFilter: {category: 0x0010, mask: 0x1010}, mass: 5});
        this.joint0 = this.matter.add.image(50, 1920*3.5/8, 'joint0')
            .setScale(0.7)
            .setTint(0xe0e0f0)
            .setCircle(radius['joint0'], {slop: slop_val, isStatic: true, collisionFilter: {category: 0x0010, mask: 0x0011}});

        // segment1
        this.bone1 = this.matter.add.image(0, 400/2, 'bone1')
            .setScale(0.7)
            .setTint(0xf0f0ff)
            .setRectangle(width['bone1'], length['bone1'], {slop: slop_val, ignoreGravity: true, collisionFilter: {category: 0x0100, mask: 0x1100}, mass: 5});
        this.joint1 = this.matter.add.image(0, 0, 'joint1')
            .setScale(0.55)
            .setTint(0xf0f0ff)
            .setCircle(radius['joint1'], {slop: slop_val, collisionFilter: {category: 0x1000, mask: 0x0110}});//, ignoreGravity: true, mass: 5});

        // hand
        this.hand = this.matter.add.image(600, 750, 'hand')
        .setScale(0.5)
        .setTint(0xf0f0ff)
        .setCircle(radius['hand'], {ignoreGravity: true, collisionFilter: {category: 0x0100, mask: 0x0101}, mass: 5})

        // constraints
        this.constraint0 = this.matter.add.constraint(this.joint0, this.bone0, radius['joint0'], stiff_val, {pointB: {x: 0, y: length['bone0']/2 - slop_val}});
        this.constraint1 = this.matter.add.constraint(this.bone0, this.joint1, radius['joint1'], stiff_val, {pointA: {x: 0, y: -length['bone0']/2 + slop_val}});
        this.constraint2 = this.matter.add.constraint(this.joint1, this.bone1, radius['joint1'], stiff_val, {pointB: {x: 0, y: length['bone1']/2 - slop_val}});
        this.constraint3 = this.matter.add.constraint(this.bone1, this.hand, radius['hand'], stiff_val, {pointA: {x: 0, y: -length['bone1']/2 + slop_val}});
        this.constraint4 = this.matter.add.worldConstraint(this.hand, 0, loose_val, {pointA: {x: 500, y: 750}});

        // spawn boxes
        let boxes = [];
        for (let i = 0; i < 4; i++) {
            boxes[i] = this.matter.add.rectangle(750 + i*100, 100, 150, 150);
        }

        // hand grabbing
        this.sinceGrab = 0;
        this.nograb = this.matter.add.circle(300, 300, 3, {ignoreGravity: true, collisionFilter: {mask: 0x0000}});
        this.grabbed = this.nograb;
        this.grabbing = this.matter.add.worldConstraint(this.nograb, 0, loose_val, {pointA: {x: 30, y: 30}});
        this.hand.setOnCollideWith(boxes, (instance) =>
        {
            if (this.sinceGrab < 3) {
                return;
            }
            if (this.grabbed != this.nograb) {
                this.grabbed.collisionFilter = {category: 0x0001, mask: 0x1111};
            }
            this.matter.world.removeConstraint(this.grabbing);
            instance.collisionFilter = {category: 0x0001, mask: 0x0001};
            this.grabbed = instance;
            this.grabbing = this.matter.add.worldConstraint(instance, instance.width * 2, loose_val, {pointA: {x: this.hand.x, y: this.hand.y}});
            this.sinceGrab = 0;
        });

        this.floor.on('pointermove', (pointer) =>
        {
            this.constraint4.pointA.x = (pointer.x - 75) * 1.15;
            this.constraint4.pointA.y = (pointer.y - 1920*6/8) * 3.5;
        });

        this.floor.on('pointerdown', () =>
        {
            this.grabbed.collisionFilter = {category: 0x0001, mask: 0x1111};
            this.matter.world.removeConstraint(this.grabbing);
            this.grabbed = this.nograb;
            this.grabbing = this.matter.add.worldConstraint(this.nograb, 0, loose_val, {pointA: {x: 30, y: 30}});
        });

        // mouse interaction
        this.matter.add.mouseSpring();
    }
    update (time) {
        //this.grabbing.pointA = this.constraint4.pointA;
        this.sinceGrab += Math.floor((time * 1000) % 2);
        this.grabbing.pointA.x = this.hand.x;
        this.grabbing.pointA.y = this.hand.y;
    }
}