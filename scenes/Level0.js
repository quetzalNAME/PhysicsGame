class Level0 extends Phaser.Scene {
    constructor() {
        super('lvl0');
    }
    levelSetup(tint) {
        // bounds
        this.matter.world.setBounds();
        // background
        this.bg = this.add.image(chosenScreenX/2, chosenScreenY/2 - 250, 'bg')
            .setScale(0.45)
            .setTint(tint)
            .setAlpha(0.5);
        // filters
        this.cameras.main.filters.external.addShadow(0, 0, 0.01, 100, 0x000000, 1000, 350);
        this.cameras.main.filters.external.addVignette(0.5, 0.5, 1, 0.15);
    }
    buildArm(
    arm_x, arm_y, scale, stiff_val = 0.9, loose_val = 0.005, slop_val = 3,
    radius  = {'joint0': 110 * scale, 'joint1': 60 * scale, 'hand': 50 * scale},
    length = {'bone0': 300 * scale, 'bone1': 250 * scale, 'bat': 550 * scale},
    width = {'bone0': 120 * scale, 'bone1': 110 * scale, 'bat': 100 * scale}) {
        this.cursor = this.add.image(offscreen, offscreen, 'cursor')
            .setScale(0.5)
            .setAlpha(0.5);
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
        // hand (segment2)
        this.hand = this.matter.add.image(arm_x, arm_y, 'hand')
            .setScale(0.5 * scale)
            .setTint(0xf0f0ff)
            .setCircle(radius['hand'], {ignoreGravity: true, collisionFilter: {category: 0x0100, mask: 0x0101}, mass: 5});
        // connections (constraints)
        // joint0->bone0
        this.constraint0 = this.matter.add.constraint(this.joint0, this.bone0, radius['joint0'], stiff_val, {pointB: {x: 0, y: length['bone0']/2 - slop_val}});
        // bone0->joint1
        this.constraint1 = this.matter.add.constraint(this.bone0, this.joint1, radius['joint1'], stiff_val, {pointA: {x: 0, y: -length['bone0']/2 + slop_val}});
        // joint1->bone1
        this.constraint2 = this.matter.add.constraint(this.joint1, this.bone1, radius['joint1'], stiff_val, {pointB: {x: 0, y: length['bone1']/2 - slop_val}});
        // bone1->hand
        this.constraint3 = this.matter.add.constraint(this.bone1, this.hand, radius['hand'], stiff_val, {pointA: {x: 0, y: -length['bone1']/2 + slop_val}});
        // hand--->cursor
        this.constraint4 = this.matter.add.worldConstraint(this.hand, 0, loose_val, {pointA: {x: chosenScreenX/2, y: 350}});
        // choose if cursor displays above or below the arm
        // this.cursor = this.add.image(offscreen, offscreen, 'cursor')
        //     .setScale(0.5)
        //     .setAlpha(0.5);
    }
    // uiSetup('0. Tutorial') adds pause, trackpad, and name text
    create () {
        // generic setup
        this.levelSetup(bgBlue);

        // text
        this.temp = this.add.text(75, -50, '\n\n\n\nThe trackpad translates\nyour movement.', {fontFamily: "Shadows Into Light", fontSize: '100px', lineSpacing: -40, align: 'center'});
        this.add.text(75, 50, 'Collect the stars.', {fontFamily: "Shadows Into Light", fontSize: '150px'});

        // variables
        let arm_x = chosenScreenX/2;
        let arm_y = chosenScreenY*2.75/8;
        let scale = 0.75; // scale effects everything without changing proportions

        // build the arm
        this.buildArm(arm_x, arm_y, scale);

        // floor
        this.floor = this.add.rectangle(chosenScreenX/2, chosenScreenY*5/8 + 175, chosenScreenX, chosenScreenY*2/8, 0x303050, 1);
        let floor_hitbox = this.matter.add.rectangle(this.floor.x, this.floor.y, this.floor.width, this.floor.height, {isStatic: true});

        // stars
        this.stars = [];
        this.stars[0] = this.matter.add.image(0, chosenScreenY*3/8, 'star');
        this.stars[1] = this.matter.add.image(chosenScreenX/2, chosenScreenY*4.5/8, 'star')
        this.stars[2] = this.matter.add.image(chosenScreenX, chosenScreenY*3/8, 'star')
        for (let i = 0; i < 3; i++) {
            this.stars[i]
            .setScale(1.75 * scale)
            .setCircle()
            .setIgnoreGravity(true)
            .setTint(starYellow);
        }
        this.hand.setOnCollideWith(this.stars, (instance) =>
        {
            this.tweens.add({
                targets: instance.gameObject,
                angle: 360 * 2,
                alpha: 0,
                scale: 1.5,
                duration: 1000,
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
        this.trackpad = this.add.image(chosenScreenX/2, chosenScreenY*5/8 + 150, 'trackpad')
            .setScale(2.75 * 3/4, 3/2)
            .setTint(0xeaf0ff)
            .setInteractive();

        // hand movement
        this.trackpad.on('pointermove', (pointer) =>
        {
            // x is mostly the same but constraint can be partially offscreen
            this.constraint4.pointA.x = (pointer.x - 75) * 1.15;
            // y is translated to the portion of the screen that isnt the trackpad
            this.constraint4.pointA.y = (pointer.y - chosenScreenY*4.75/8) * 3.15;
            this.cursor.x = this.constraint4.pointA.x;
            this.cursor.y = this.constraint4.pointA.y;
        });

        // end text
        this.retry = this.add.text(offscreen, arm_y - 100, 'Retry', {fontFamily: "Shadows Into Light", fontSize: '150px'}).setInteractive();
        this.next = this.add.text(offscreen, arm_y - 100, 'Next', {fontFamily: "Shadows Into Light", fontSize: '150px'}).setInteractive();
        this.exit = this.add.text(offscreen, arm_y + 200, 'Level Select', {fontFamily: "Shadows Into Light", fontSize: '120px'}).setInteractive();
        this.retry.on('pointerup', () =>
        {
            this.scene.restart();
        });
        this.next.on('pointerup', () =>
        {
            this.scene.start('lvl1');
        });
        this.exit.on('pointerup', () =>
        {
            this.scene.start('lvlselect');
        });
    }
    update () {
        if (this.stars_collected == 3) {
            this.stars_collected += 1;
            for (let i = 0; i < 3; i++) {
                this.stars[i] = this.matter.add.image(0, 450, 'star');
            }
            this.temp.destroy();
            this.stars[0].x = chosenScreenX/2 - 300;
            this.stars[1].x = chosenScreenX/2;
            this.stars[2].x = chosenScreenX/2 + 300;
            this.stars[0]
                .setCircle()
                .setCollidesWith(0x000000)
                .setIgnoreGravity(true)
                .setTint(starYellow)
                .setScale(4 * scale);
            this.stars[1]
                .setCircle()
                .setCollidesWith(0x000000)
                .setIgnoreGravity(true)
                .setTint(starYellow)
                .setScale(5.25 * scale);
            this.stars[2]
                .setCircle()
                .setCollidesWith(0x000000)
                .setIgnoreGravity(true)
                .setTint(starYellow)
                .setScale(4 * scale);
            this.retry.x = (chosenScreenX/2 - this.retry.width/2) - 350;
            this.next.x = (chosenScreenX/2 - this.next.width/2) + 350;
            this.exit.x = chosenScreenX/2 - this.exit.width/2;
        }
    }
}