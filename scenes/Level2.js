let followBall = false;

class Level2 extends Phaser.Scene {
    constructor() {
        super('lvl2');
    }
    create () {
        // world bounds
        this.matter.world.setBounds();

        // background
        this.bg = this.add.image(chosenScreenX*3/2, chosenScreenY/2 - 250, 'bg')
            .setScale(3, 1)
            .setTint(0x303070, 0xff6666, 0x303070, 0xff6666)
            .setAlpha(0.5);

        // variables
        let stiff_val = 0.9;
        let loose_val = 0.005;
        let scale = 0.6; // scale effects everything without changing proportions
        let radius = {'joint0': 110 * scale, 'joint1': 60 * scale, 'hand': 50 * scale};
        let length = {'bone0': 300 * scale, 'bone1': 250 * scale, 'bat': 550 * scale};
        let width = {'bone0': 120 * scale, 'bone1': 110 * scale, 'bat': 100 * scale};
        let slop_val = 3;
        let arm_x = 1080*1/4 + 150;
        let arm_y = 1920*5/8;
        
        // segment0
        this.bone0 = this.matter.add.image(arm_x, arm_y, 'bone0')
            .setScale(0.9 * scale)
            .setTint(0xf0f0ff)
            .setRectangle(width['bone0'], length['bone0'], {slop: slop_val, ignoreGravity: true, collisionFilter: {category: 0x0010, mask: 0x1010}, mass: 5});
        this.joint0 = this.matter.add.image(arm_x, arm_y, 'joint0')
            .setScale(0.8 * scale)
            .setTint(0xe0e0f0)
            .setCircle(radius['joint0'], {slop: slop_val, isStatic: true, collisionFilter: {category: 0x0010, mask: 0x0011}});

        // segment1
        this.bone1 = this.matter.add.image(arm_x, arm_y, 'bone1')
            .setScale(0.7 * scale)
            .setTint(0xf0f0ff)
            .setRectangle(width['bone1'], length['bone1'], {slop: slop_val, ignoreGravity: true, collisionFilter: {category: 0x0100, mask: 0x0110}, mass: 5});
        this.joint1 = this.matter.add.image(arm_x, arm_y, 'joint1')
            .setScale(0.55 * scale)
            .setTint(0xf0f0ff)
            .setCircle(radius['joint1'], {slop: slop_val, collisionFilter: {category: 0x0010, mask: 0x0110}});

        // hand + bat (segment2)
        this.hand = this.matter.add.image(arm_x - 500, arm_y, 'hand')
        .setScale(0.5 * scale)
        .setTint(0xf0f0ff)
        .setCircle(radius['hand'], {ignoreGravity: true, collisionFilter: {category: 0x0100, mask: 0x0100}, mass: 5})
        this.bat = this.matter.add.image(arm_x, arm_y, 'bat')
        .setScale(2 * scale)
        .setTint(0xa8815f)
        .setRectangle(width['bat'], length['bat'], {slop: 0, ignoreGravity: true, collisionFilter: {category: 0x0100, mask: 0x1000}, mass: 5, pointA: {y: 1000}});

        // constraints
        this.constraint0 = this.matter.add.constraint(this.joint0, this.bone0, radius['joint0'], stiff_val, {pointB: {x: 0, y: length['bone0']/2 - slop_val}});
        this.constraint1 = this.matter.add.constraint(this.bone0, this.joint1, radius['joint1'], stiff_val, {pointA: {x: 0, y: -length['bone0']/2 + slop_val}});
        this.constraint2 = this.matter.add.constraint(this.joint1, this.bone1, radius['joint1'], stiff_val, {pointB: {x: 0, y: length['bone1']/2 - slop_val}});
        this.constraint3 = this.matter.add.constraint(this.bone1, this.hand, radius['hand'], stiff_val, {pointA: {x: 0, y: -length['bone1']/2 + slop_val}});
        this.constraint4 = this.matter.add.worldConstraint(this.hand, 0, loose_val, {pointA: {x: 500, y: 750}});
        this.constraint5 = this.matter.add.constraint(this.hand, this.bat, 0, stiff_val, {pointB: {x: 0, y: length['bat']/2 - slop_val}});

        // stars
        this.stars = [];
        this.stars[0] = this.matter.add.image(3000 + 1100, 500, 'star')
        this.stars[1] = this.matter.add.image(4000 + 1100, 500, 'star')
        this.stars[2] = this.matter.add.image(5000 + 1100, 500, 'star')
        for (let i = 0; i < 3; i++) {
            this.stars[i]
                .setScale(3 * scale)
                .setCircle()
                .setIgnoreGravity(true)
                .setTint(0xffff70);
        }

        // paper balls
        this.ball = this.matter.add.image(750, 2500, 'crumple')
            .setCircle(125)
            .setCollisionCategory(0x1000)
            .setCollidesWith(0x0100)
            .setMass(0.0000001)
            .setScale(0.5);

        this.ball.setOnCollideWith(this.bat, () =>
            {
                followBall = true;
            });

        // control zone
        this.trackpad = this.add.image(chosenScreenX/2, chosenScreenY*7/8 - 15, 'trackpad')
            .setScale(2.75 *3/4, 1.75 *3/4)
            .setTint(0xeaf0ff)
            .setInteractive();

        // hand movement
        this.trackpad.on('pointermove', (pointer) =>
        {
            this.constraint4.pointA.x = (pointer.x - 75) * 1.15;
            this.constraint4.pointA.y = (pointer.y - 1920*6/8) * 3.5;
        });

        // debug mouse interaction
        this.matter.add.mouseSpring();
        
        // filters
        this.cameras.main.filters.external.addShadow(0, 0, 0.01, 100, 0x000000, 1000, 350);
        this.cameras.main.filters.external.addVignette(0.5, 0.5, 1, 0.15);
    }
    update () {
        this.bat.setAngle(90 * ((this.bat.x - 750)/chosenScreenX));
        if (this.ball.y > chosenScreenY + 100) {
            if (followBall) {
                followBall = false;
                console.log(`${Math.floor(this.ball.x - 1100)} centimeters!`);
                this.scene.restart();
            }
            this.ball.y = -100;
            this.ball.x = 600;
            this.ball.setToSleep();
            this.tweens.add({
                targets: this.ball,
                duration: 750,
                y: -100,
                onComplete: () =>
                {
                    this.ball.setAwake();
                }
            });
        }
        if (followBall) {
            this.cameras.main.scrollX = this.ball.x - chosenScreenX * 3/8 - 200;
        }
    }
}