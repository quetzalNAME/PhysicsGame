class Level1 extends Phaser.Scene {
    constructor() {
        super('lvl1');
    }
    create () {
        this.matter.world.setBounds();
        this.add.rectangle(1080/2, 1920*7/8, 1080, 500, 0x303030, 1);
        let rect = this.matter.add.rectangle(1080/2, 1920*7/8, 1080, 500, {isStatic: true});
        this.circle = this.matter.add.circle(500, 750, 70);

        this.segment0 = this.add.container(0, 1920/3);
        this.bone0 = this.add.rectangle(0, -400/2, 115, 400, 0x606060);
        this.joint0 = this.add.circle(0, 0, 100, 0x404040);
        this.segment0.add([this.bone0, this.joint0]);

        this.segment1 = this.add.container(0, -400);
        this.bone1 = this.add.rectangle(0, -400/2, 100, 400, 0x707070);
        this.joint1 = this.add.circle(0, 0, 85, 0x404040);
        this.segment1.add([this.bone1, this.joint1]);
        this.segment0.add([this.segment1]);

        this.hand = this.add.circle(0, -400, 70, 0x303030);
        this.segment1.add(this.hand);

        this.constraint = this.matter.add.worldConstraint(this.circle, 0, 1, {pointA: {x: 500, y: 750}});

        let box = this.matter.add.rectangle(50, 0, 200, 200);
        for (let i = 0; i < 4; i++) {
            this.matter.add.rectangle(150 + i*10, 100, 100, 100);
        }
        this.matter.add.mouseSpring();
        
    }
    update () {
        this.segment0.rotation += 0.005;
        this.segment1.rotation += 0.01;
        this.constraint.pointA = this.hand.getWorldPoint();
    }
}