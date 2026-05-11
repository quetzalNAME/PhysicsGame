const chosenScreenX = 1080;
const chosenScreenY = 1920;

class Level1 extends Phaser.Scene {
    constructor() {
        super('lvl1');
    }
    create () {
        // world bounds
        this.matter.world.setBounds();

        // background
        this.bg = this.add.image(chosenScreenX/2, chosenScreenY/2 - 250, 'bg')
        .setScale(0.32)
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
        
        // segment0
        this.bone0 = this.matter.add.image(0, 400/2, 'bone0')
            .setScale(0.9)
            .setRectangle(width['bone0'], length['bone0'], {ignoreGravity: true, collisionFilter: {category: 0x0010, mask: 0x0011}, mass: 5});
        this.joint0 = this.matter.add.image(50, 1920*3.5/8, 'joint0')
            .setScale(0.7)
            .setCircle(radius['joint0'], {isStatic: true, collisionFilter: {category: 0x0010, mask: 0x0011}});

        // segment1
        this.bone1 = this.matter.add.image(0, 400/2, 'bone1')
            .setScale(0.7)
            .setRectangle(width['bone1'], length['bone1'], {ignoreGravity: true, collisionFilter: {category: 0x0100, mask: 0x0101}, mass: 5});
        this.joint1 = this.matter.add.image(0, 0, 'joint1')
            .setScale(0.6)
            .setCircle(radius['joint1'], {slop: 10, collisionFilter: {category: 0x0001, mask: 0x0111}});//, ignoreGravity: true, mass: 5});

        // offset cursor
        this.hand = this.matter.add.image(500, 750, 'hand')
        .setScale(0.5)
        .setCircle(radius['hand'], {ignoreGravity: true, collisionFilter: {category: 0x0100, mask: 0x0101}, mass: 5})
        // .setOnCollide((gameObject, ) =>
        // {
        //     this.newConstraint = this.matter.add.constraint();
        // });

        // constraints
        this.constraint0 = this.matter.add.constraint(this.joint0, this.bone0, radius['joint0'], stiff_val, {pointB: {x: 0, y: length['bone0']/2 - 10}});
        this.constraint1 = this.matter.add.constraint(this.bone0, this.joint1, radius['joint1'], stiff_val, {pointA: {x: 0, y: -length['bone0']/2 + 10}});
        this.constraint2 = this.matter.add.constraint(this.joint1, this.bone1, radius['joint1'], stiff_val, {pointB: {x: 0, y: length['bone1']/2 - 10}});
        this.constraint3 = this.matter.add.constraint(this.bone1, this.hand, radius['hand'], stiff_val, {pointA: {x: 0, y: -length['bone1']/2 + 10}});
        this.constraint4 = this.matter.add.worldConstraint(this.hand, 0, loose_val, {pointA: {x: 500, y: 750}});

        // spawn boxes
        for (let i = 0; i < 4; i++) {
            this.matter.add.rectangle(750 + i*100, 100, 150, 150);
        }

        this.floor.on('pointermove', (pointer) =>
        {
            this.constraint4.pointA.x = (pointer.x - 75) * 1.15;
            this.constraint4.pointA.y = (pointer.y - 1920*6/8) * 3.5;
        });

        // mouse interaction
        this.matter.add.mouseSpring();
    }
    update () {

    }
}