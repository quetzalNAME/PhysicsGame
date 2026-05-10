class Level1 extends Phaser.Scene {
    constructor() {
        super('lvl1');
    }
    create () {
        // pointer
        this.pointer = this.input.activePointer;

        // world bounds
        this.matter.world.setBounds();

        // floor
        this.add.rectangle(1080/2, 1920*7/8, 1080, 500, 0x303030, 1);
        let rect = this.matter.add.rectangle(1080/2, 1920*7/8, 1080, 500, {isStatic: true});

        // segment0
        this.segment0 = this.add.container(0, 1920/3);
        this.bone0 = this.add.rectangle(0, -400/2, 115, 400, 0x606060);
        this.joint0 = this.add.circle(0, 0, 100, 0x404040);
        this.segment0.add([this.bone0, this.joint0]);

        // segment1
        this.segment1 = this.add.container(0, -400);
        this.bone1 = this.add.rectangle(0, -400/2, 100, 400, 0x707070);
        this.joint1 = this.add.circle(0, 0, 85, 0x404040);
        this.segment1.add([this.bone1, this.joint1]);
        this.segment0.add([this.segment1]);

        // hand
        this.hand = this.add.circle(0, -400, 70, 0x303030);
        this.segment1.add(this.hand);

        // hand collider
        this.hand_col = this.matter.add.circle(500, 750, 70);
        this.constraint = this.matter.add.worldConstraint(this.hand_col, 0, 1, {pointA: {x: 500, y: 750}});

        // spawn boxes
        for (let i = 0; i < 30; i++) {
            this.matter.add.rectangle(50 + i*10, 100, 100, 100);
        }

        // mouse interaction
        this.matter.add.mouseSpring();
    }
    update () {
        // rotation
        this.segment0.rotation += 0.005;
        this.segment1.rotation += 0.01;

        // mouse tracking
        this.segment0.x = this.pointer.x;
        this.segment0.y = this.pointer.y;

        // link hand collider to hand position
        this.constraint.pointA = this.hand.getWorldPoint();
    }
}