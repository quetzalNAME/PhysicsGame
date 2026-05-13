class Level0 extends Phaser.Scene {
    constructor() {
        super('lvl0');
    }
    create () {
        // world bounds
        this.matter.world.setBounds();

        // background
        this.bg = this.add.image(chosenScreenX/2, chosenScreenY/2 - 250, 'bg')
        .setScale(0.32)
        .setTint(0x505070)
        .setAlpha(0.5);

        // text
        this.add.text(75, 50, 'Collect the stars.', {fontFamily: "Shadows Into Light", fontSize: '150px'});

        // floor
        this.floor = this.add.rectangle(1080/2, 1920*7/8, 1080, 500, 0x404040, 1);
        let rect = this.matter.add.rectangle(1080/2, 1920*7/8, 1080, 500, {isStatic: true});

        // variables
        let stiff_val = 0.9;
        let loose_val = 0.005;
        let scale = 0.75; // scale effects everything without changing proportions
        let radius = {'joint0': 110 * scale, 'joint1': 60 * scale, 'hand': 50 * scale};
        let length = {'bone0': 300 * scale, 'bone1': 250 * scale, 'bat': 550 * scale};
        let width = {'bone0': 120 * scale, 'bone1': 110 * scale, 'bat': 100 * scale};
        let slop_val = 3;
        let arm_x = chosenScreenX/2;
        let arm_y = chosenScreenY*3.75/8;
        
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
        this.hand = this.matter.add.image(arm_x, arm_y, 'hand')
        .setScale(0.5 * scale)
        .setTint(0xf0f0ff)
        .setCircle(radius['hand'], {ignoreGravity: true, collisionFilter: {category: 0x0100, mask: 0x0101}, mass: 5})

        // constraints
        this.constraint0 = this.matter.add.constraint(this.joint0, this.bone0, radius['joint0'], stiff_val, {pointB: {x: 0, y: length['bone0']/2 - slop_val}});
        this.constraint1 = this.matter.add.constraint(this.bone0, this.joint1, radius['joint1'], stiff_val, {pointA: {x: 0, y: -length['bone0']/2 + slop_val}});
        this.constraint2 = this.matter.add.constraint(this.joint1, this.bone1, radius['joint1'], stiff_val, {pointB: {x: 0, y: length['bone1']/2 - slop_val}});
        this.constraint3 = this.matter.add.constraint(this.bone1, this.hand, radius['hand'], stiff_val, {pointA: {x: 0, y: -length['bone1']/2 + slop_val}});
        this.constraint4 = this.matter.add.worldConstraint(this.hand, 0, loose_val, {pointA: {x: chosenScreenX/2, y: 350}});

        // stars
        this.stars = [];
        this.stars[0] = this.matter.add.image(0, chosenScreenY*5/8, 'star');
        this.stars[1] = this.matter.add.image(chosenScreenX/2, chosenScreenY*6/8, 'star')
        this.stars[2] = this.matter.add.image(chosenScreenX, chosenScreenY*5/8, 'star')
        for (let i = 0; i < 3; i++) {
            this.stars[i]
            .setScale(1.5 * scale)
            .setCircle()
            .setIgnoreGravity(true)
            .setTint(0xffff70);
        }
        this.hand.setOnCollideWith(this.stars, (instance) =>
        {
            this.tweens.add({
                targets: instance.gameObject,
                angle: 360 * 2,
                alpha: 0,
                scale: 1.5,
                duration: 1000,
                //ease: 'Quart.easeIn',
                onComplete: () =>
                {
                    if (instance.gameObject != null) {
                        this.stars_collected += 1;
                        instance.gameObject.destroy();
                    }
                }
            });
        });
        this.stars_collected = 0;

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

        // text
        this.retry = this.add.text(-9000, arm_y - radius['joint0'], 'Retry', {fontFamily: "Shadows Into Light", fontSize: '150px'}).setInteractive();
        this.next = this.add.text(-9000, arm_y - radius['joint0'], 'Next', {fontFamily: "Shadows Into Light", fontSize: '150px'}).setInteractive();
        this.exit = this.add.text(-9000, arm_y + 150, 'Exit', {fontFamily: "Shadows Into Light", fontSize: '150px'}).setInteractive();
        this.retry.on('pointerup', () =>
        {
            this.homerun = null;
            followBall = false;
            this.scene.restart();
        });
        this.next.on('pointerup', () =>
        {
            this.homerun = null;
            followBall = false;
            this.scene.start('lvl1');
        });
        this.exit.on('pointerup', () =>
        {
            this.homerun = null;
            followBall = false;
            this.scene.restart();
        });
        
        // filters
        this.cameras.main.filters.external.addShadow(0, 0, 0.01, 100, 0x000000, 1000, 350);
        this.cameras.main.filters.external.addVignette(0.5, 0.5, 1, 0.15);
    }
    update () {
        if (this.stars_collected == 3) {
            this.stars_collected += 1;
            for (let i = 0; i < 3; i++) {
                this.stars[i] = this.matter.add.image(0, 450, 'star');
            }
            this.stars[0].x = chosenScreenX/2 - 300;
            this.stars[1].x = chosenScreenX/2;
            this.stars[2].x = chosenScreenX/2 + 300;
            this.stars[0]
                .setCircle()
                .setCollidesWith(0x000000)
                .setIgnoreGravity(true)
                .setTint(0xffff70)
                .setScale(4 * scale);
            this.stars[1]
                .setCircle()
                .setCollidesWith(0x000000)
                .setIgnoreGravity(true)
                .setTint(0xffff70)
                .setScale(5.25 * scale);
            this.stars[2]
                .setCircle()
                .setCollidesWith(0x000000)
                .setIgnoreGravity(true)
                .setTint(0xffff70)
                .setScale(4 * scale);
            this.retry.x = 100;
            this.next.x = 700;
            this.exit.x = 450;
        }
    }
}